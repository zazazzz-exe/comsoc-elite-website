import { createClient } from "@supabase/supabase-js";
import { facultyMembers, type Faculty } from "@/lib/data/faculty";
import { ccsElites, ccsElitesAdviser, comsocOfficers, facultyAdviser, type Adviser, type Officer, type Team } from "@/lib/data/officers";
import { galleryEvents, upcomingEvents, type GalleryEvent, type UpcomingEvent } from "@/lib/data/events";

type CmsPerson = { name: string; role: string; organization: "comsoc" | "ccs_elites"; person_kind: "officer" | "adviser"; tier: number; display_order: number; department: string | null; email: string | null; facebook_url: string | null; image_url: string | null };
type CmsEvent = { id: string; slug: string; title: string; event_kind: "upcoming" | "gallery"; starts_at: string; ends_at: string | null; location: string | null; time_label: string | null; budget: number | string | null; description: string | null; cover_image_url: string | null };
type CmsEventMedia = { event_id: string; image_url: string };

export type PublicContent = { faculty: Faculty[]; comsocTeam: Team; elitesTeam: Team; comsocAdviser: Adviser; elitesAdviser: Adviser; upcoming: UpcomingEvent[]; gallery: GalleryEvent[] };

const fallback: PublicContent = { faculty: facultyMembers, comsocTeam: comsocOfficers, elitesTeam: ccsElites, comsocAdviser: facultyAdviser, elitesAdviser: ccsElitesAdviser, upcoming: upcomingEvents, gallery: galleryEvents };
const debug = (...args: unknown[]) => { if (process.env.NODE_ENV === "development") console.info("[website content]", ...args); };

function eventDate(startsAt: string, endsAt: string | null) {
  const start = new Date(`${startsAt}T00:00:00Z`);
  const end = endsAt ? new Date(`${endsAt}T00:00:00Z`) : null;
  const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(start).toUpperCase();
  const startDay = start.getUTCDate();
  return `${month} ${startDay}${end ? `-${end.getUTCDate()}` : ""}`;
}

function team(records: CmsPerson[], organization: CmsPerson["organization"], name: string, fallbackTeam: Team): Team {
  const officers = records.filter((person) => person.organization === organization && person.person_kind === "officer");
  if (!officers.length) return fallbackTeam;
  const tiers = Array.from({ length: Math.max(...officers.map((person) => person.tier)) + 1 }, () => [] as Officer[]);
  officers.forEach((person) => tiers[person.tier].push({ name: person.name, role: person.role, image: person.image_url ?? undefined, email: person.email ?? undefined, facebook: person.facebook_url ?? undefined }));
  return { name, tiers };
}

function adviser(records: CmsPerson[], organization: CmsPerson["organization"], fallbackAdviser: Adviser): Adviser {
  const person = records.find((record) => record.organization === organization && record.person_kind === "adviser");
  if (!person) return fallbackAdviser;
  return { name: person.name, role: person.role, department: person.department ?? "College of Computer Studies", image: person.image_url ?? undefined, email: person.email ?? undefined, facebook: person.facebook_url ?? undefined };
}

function alignTeams(comsocTeam: Team, elitesTeam: Team): [Team, Team] {
  const tierCount = Math.max(3, comsocTeam.tiers.length, elitesTeam.tiers.length);
  const placeholder = (tier: number) => ({ role: tier === 0 ? "President" : "Officer", name: "Vacant" });
  const tierSize = (tier: number) => Math.max(1, comsocTeam.tiers[tier]?.length ?? 0, elitesTeam.tiers[tier]?.length ?? 0);
  return [{ ...comsocTeam, tiers: Array.from({ length: tierCount }, (_, tier) => Array.from({ length: tierSize(tier) }, (_, index) => comsocTeam.tiers[tier]?.[index] ?? placeholder(tier))) }, { ...elitesTeam, tiers: Array.from({ length: tierCount }, (_, tier) => Array.from({ length: tierSize(tier) }, (_, index) => elitesTeam.tiers[tier]?.[index] ?? placeholder(tier))) }];
}

export async function getPublicContent(): Promise<PublicContent> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    debug("using fallback: missing Supabase configuration", { hasUrl: Boolean(url), hasPublishableKey: Boolean(key) });
    return fallback;
  }

  try {
    const supabase = createClient(url, key);
    const [facultyResult, peopleResult, eventsResult] = await Promise.all([
      supabase.from("faculty_members").select("name, department, image_url").eq("status", "published").order("display_order"),
      supabase.from("organization_people").select("name, role, organization, person_kind, tier, display_order, department, email, facebook_url, image_url").eq("status", "published").order("tier").order("display_order"),
      supabase.from("events").select("id, slug, title, event_kind, starts_at, ends_at, location, time_label, budget, description, cover_image_url").eq("status", "published").order("starts_at"),
    ]);
    if (facultyResult.error || peopleResult.error || eventsResult.error) {
      console.error("[website content] published-content query failed", { faculty: facultyResult.error?.message, people: peopleResult.error?.message, events: eventsResult.error?.message });
      return fallback;
    }

    const cmsEvents = (eventsResult.data ?? []) as CmsEvent[];
    const galleryIds = cmsEvents.filter((event) => event.event_kind === "gallery").map((event) => event.id);
    const mediaResult = galleryIds.length ? await supabase.from("event_media").select("event_id, image_url").in("event_id", galleryIds).order("display_order") : { data: [], error: null };
    if (mediaResult.error) {
      console.error("[website content] event-media query failed", mediaResult.error.message);
      return fallback;
    }
    const mediaByEvent = new Map<string, string[]>();
    ((mediaResult.data ?? []) as CmsEventMedia[]).forEach((media) => mediaByEvent.set(media.event_id, [...(mediaByEvent.get(media.event_id) ?? []), media.image_url]));

    const people = (peopleResult.data ?? []) as CmsPerson[];
    const publishedFaculty = (facultyResult.data ?? []).map((member) => ({ name: member.name, department: member.department, image: member.image_url ?? undefined }));
    const publishedUpcoming = cmsEvents.filter((event) => event.event_kind === "upcoming").map((event) => ({ id: event.slug, date: eventDate(event.starts_at, event.ends_at), title: event.title, location: event.location ?? undefined, time: event.time_label ?? undefined, budget: event.budget === null ? undefined : Number(event.budget), description: event.description ?? "", coverImage: event.cover_image_url ?? undefined, type: "upcoming" as const }));
    const publishedGallery = cmsEvents.filter((event) => event.event_kind === "gallery" && event.cover_image_url).map((event) => ({ id: event.slug, date: eventDate(event.starts_at, event.ends_at), title: event.title, location: event.location ?? undefined, time: event.time_label ?? undefined, budget: event.budget === null ? undefined : Number(event.budget), subtitle: event.description ?? "", coverImage: event.cover_image_url as string, images: [event.cover_image_url as string, ...(mediaByEvent.get(event.id) ?? [])], type: "gallery" as const }));

    const [comsocTeam, elitesTeam] = alignTeams(team(people, "comsoc", "COMSOC Officers", fallback.comsocTeam), team(people, "ccs_elites", "CCS ELITES", fallback.elitesTeam));
    debug("published content loaded", { faculty: publishedFaculty.length, people: people.length, upcoming: publishedUpcoming.length, gallery: publishedGallery.length });
    return { faculty: publishedFaculty.length ? publishedFaculty : fallback.faculty, comsocTeam, elitesTeam, comsocAdviser: adviser(people, "comsoc", fallback.comsocAdviser), elitesAdviser: adviser(people, "ccs_elites", fallback.elitesAdviser), upcoming: publishedUpcoming.length ? publishedUpcoming : fallback.upcoming, gallery: publishedGallery.length ? publishedGallery : fallback.gallery };
  } catch (error) {
    console.error("[website content] unexpected content-loader failure", error);
    return fallback;
  }
}
