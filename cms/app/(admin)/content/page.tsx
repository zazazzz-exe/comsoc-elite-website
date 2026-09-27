import Link from "next/link";
import { prisma } from "@/lib/prisma";

type AttentionItem = { id: string; name: string; kind: "Person" | "Faculty" | "Event"; href: string };

async function attention() {
  try {
    const [draftPeople, draftFaculty, draftEvents, peopleWithoutImages, facultyWithoutImages, eventsWithoutCovers, unusedMedia] = await Promise.all([
      prisma.organizationPerson.findMany({ where: { status: "draft" }, select: { id: true, name: true }, orderBy: { updatedAt: "desc" }, take: 8 }),
      prisma.facultyMember.findMany({ where: { status: "draft" }, select: { id: true, name: true }, orderBy: { updatedAt: "desc" }, take: 8 }),
      prisma.event.findMany({ where: { status: "draft" }, select: { id: true, title: true }, orderBy: { updatedAt: "desc" }, take: 8 }),
      prisma.organizationPerson.findMany({ where: { status: "published", imageAssetId: null, imageUrl: null }, select: { id: true, name: true }, orderBy: { updatedAt: "desc" }, take: 8 }),
      prisma.facultyMember.findMany({ where: { status: "published", imageAssetId: null, imageUrl: null }, select: { id: true, name: true }, orderBy: { updatedAt: "desc" }, take: 8 }),
      prisma.event.findMany({ where: { status: "published", coverImageAssetId: null, coverImageUrl: null }, select: { id: true, title: true }, orderBy: { updatedAt: "desc" }, take: 8 }),
      prisma.mediaAsset.count({ where: { facultyImages: { none: {} }, personImages: { none: {} }, eventCoverImages: { none: {} }, eventMediaAssets: { none: {} } } }),
    ]);

    const drafts: AttentionItem[] = [
      ...draftPeople.map((item) => ({ id: item.id, name: item.name, kind: "Person" as const, href: `/content/people/${item.id}` })),
      ...draftFaculty.map((item) => ({ id: item.id, name: item.name, kind: "Faculty" as const, href: `/content/faculty/${item.id}` })),
      ...draftEvents.map((item) => ({ id: item.id, name: item.title, kind: "Event" as const, href: `/content/events/${item.id}` })),
    ];
    const missingImages: AttentionItem[] = [
      ...peopleWithoutImages.map((item) => ({ id: item.id, name: item.name, kind: "Person" as const, href: `/content/people/${item.id}` })),
      ...facultyWithoutImages.map((item) => ({ id: item.id, name: item.name, kind: "Faculty" as const, href: `/content/faculty/${item.id}` })),
      ...eventsWithoutCovers.map((item) => ({ id: item.id, name: item.title, kind: "Event" as const, href: `/content/events/${item.id}` })),
    ];
    return { drafts, missingImages, unusedMedia };
  } catch {
    return { drafts: [], missingImages: [], unusedMedia: 0 };
  }
}

function AttentionList({ items, empty }: { items: AttentionItem[]; empty: string }) {
  if (!items.length) return <p className="py-5 text-sm text-white/50">{empty}</p>;
  return <ul className="divide-y divide-white/10">{items.map((item) => <li key={`${item.kind}-${item.id}`}><Link href={item.href} className="flex items-center justify-between gap-4 py-3 text-sm hover:text-emerald-200"><span className="min-w-0 truncate text-white">{item.name}</span><span className="shrink-0 text-xs text-white/45">{item.kind} <span aria-hidden="true">→</span></span></Link></li>)}</ul>;
}

export default async function Content() {
  const { drafts, missingImages, unusedMedia } = await attention();
  return <>
    <h1 className="font-display text-4xl font-light tracking-wide text-white">PUBLIC RECORDS</h1>
    <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">Resolve publishing and media issues here, then move directly into the record that needs work.</p>

    <section aria-labelledby="quick-add-heading" className="mt-8 border-y border-white/10 py-5">
      <h2 id="quick-add-heading" className="text-xs font-medium tracking-[0.14em] text-white/55">QUICK ADD</h2>
      <div className="mt-4 flex flex-wrap gap-3"><Link href="/content/people/new" className="border border-emerald-300/60 px-4 py-2.5 text-xs font-medium tracking-[0.12em] text-emerald-100 hover:bg-emerald-300 hover:text-[#09090b]">ADD PERSON</Link><Link href="/content/faculty/new" className="border border-white/15 px-4 py-2.5 text-xs font-medium tracking-[0.12em] text-white/75 hover:border-emerald-300/60 hover:text-emerald-200">ADD FACULTY</Link><Link href="/content/events/new" className="border border-white/15 px-4 py-2.5 text-xs font-medium tracking-[0.12em] text-white/75 hover:border-emerald-300/60 hover:text-emerald-200">ADD EVENT</Link></div>
    </section>

    <section aria-labelledby="attention-heading" className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3"><h2 id="attention-heading" className="font-display text-2xl font-light text-white">Needs attention</h2><p className="text-sm text-white/45">Published records without an image remain visible below so they can be completed.</p></div>
      <div className="mt-5 grid divide-y divide-white/10 border border-white/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        <section className="p-5"><div className="flex items-baseline justify-between gap-3"><h3 className="text-sm font-medium text-white">Drafts</h3><span className="font-mono text-xs tabular-nums text-emerald-200">{drafts.length}</span></div><AttentionList items={drafts} empty="No drafts need review." /><Link href="/content/people" className="text-xs font-medium tracking-[0.1em] text-emerald-200 hover:text-white">VIEW ALL RECORDS</Link></section>
        <section className="p-5"><div className="flex items-baseline justify-between gap-3"><h3 className="text-sm font-medium text-white">Published without media</h3><span className="font-mono text-xs tabular-nums text-emerald-200">{missingImages.length}</span></div><AttentionList items={missingImages} empty="Every published record has its required image." /><Link href="/media" className="text-xs font-medium tracking-[0.1em] text-emerald-200 hover:text-white">OPEN MEDIA LIBRARY</Link></section>
        <section className="p-5"><div className="flex items-baseline justify-between gap-3"><h3 className="text-sm font-medium text-white">Unused media</h3><span className="font-mono text-xs tabular-nums text-emerald-200">{unusedMedia}</span></div><p className="py-5 text-sm leading-6 text-white/50">Assets with no linked person, faculty, event cover, or gallery record can be reviewed safely.</p><Link href="/media?usage=unused" className="text-xs font-medium tracking-[0.1em] text-emerald-200 hover:text-white">REVIEW UNUSED MEDIA</Link></section>
      </div>
    </section>

    <section aria-labelledby="directories-heading" className="mt-10"><h2 id="directories-heading" className="font-display text-2xl font-light text-white">Directories</h2><div className="mt-5 grid border border-white/10 sm:grid-cols-3"><Link href="/content/people" className="border-b border-white/10 p-5 hover:bg-white/[0.04] sm:border-r sm:border-b-0"><span className="block text-sm font-medium text-white">People</span><span className="mt-2 block text-sm text-white/50">Manage officers and advisers.</span></Link><Link href="/content/faculty" className="border-b border-white/10 p-5 hover:bg-white/[0.04] sm:border-r sm:border-b-0"><span className="block text-sm font-medium text-white">Faculty</span><span className="mt-2 block text-sm text-white/50">Manage faculty profiles.</span></Link><Link href="/content/events" className="p-5 hover:bg-white/[0.04]"><span className="block text-sm font-medium text-white">Events</span><span className="mt-2 block text-sm text-white/50">Manage upcoming and gallery events.</span></Link></div></section>
  </>;
}
