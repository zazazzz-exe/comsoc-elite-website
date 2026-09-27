"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useDeferredValue, useState } from "react";
import type { EventRow } from "@/components/content/event-form";

function Status({ status }: { status: EventRow["status"] }) {
  const color = status === "published" ? "bg-emerald-300" : status === "archived" ? "bg-white/30" : "bg-amber-300";
  return <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/60"><span className={`h-1.5 w-1.5 rounded-full ${color}`} />{status}</span>;
}

export function EventManager({ events }: { events: EventRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | EventRow["status"]>("all");
  const [kind, setKind] = useState<"all" | EventRow["eventKind"]>("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filtered = events.filter((event) => (status === "all" || event.status === status) && (kind === "all" || event.eventKind === kind) && (!deferredQuery || `${event.title} ${event.slug} ${event.location ?? ""}`.toLowerCase().includes(deferredQuery)));

  return <section className="mt-8 border border-white/10 bg-[#111113]"><div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-base font-semibold text-white">Event program</h2><p className="mt-1 text-sm text-white/50">{events.length} events. Filter the program, then open one focused editor.</p></div><Link href="/content/events/new" className="w-fit bg-emerald-300 px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-[#07110d] hover:bg-emerald-200">QUICK ADD EVENT</Link></div><div className="grid gap-3 border-b border-white/10 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto]"><label className="relative min-w-0"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, slug, or location" className="w-full border border-white/10 bg-[#09090b] py-2.5 pr-3 pl-9 text-sm text-white outline-none placeholder:text-white/30 focus:border-emerald-300" /></label><select value={status} onChange={(event) => setStatus(event.target.value as "all" | EventRow["status"])} aria-label="Filter events by status" className="border border-white/10 bg-[#09090b] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-300"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select><select value={kind} onChange={(event) => setKind(event.target.value as "all" | EventRow["eventKind"])} aria-label="Filter events by type" className="border border-white/10 bg-[#09090b] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-300"><option value="all">All types</option><option value="upcoming">Upcoming</option><option value="gallery">Gallery</option></select></div><div className="divide-y divide-white/[0.07]">{filtered.map((event) => <article key={event.id} className="flex flex-col gap-4 p-4 hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><Link href={`/content/events/${event.id}`} className="block truncate text-sm font-medium text-white hover:text-emerald-200">{event.title}</Link><p className="mt-1 text-xs text-white/45">{event.eventKind === "gallery" ? "Gallery" : "Upcoming"} · {event.startsAt}{event.endsAt ? ` to ${event.endsAt}` : ""} · Order {event.displayOrder}</p></div><div className="flex items-center gap-4"><Status status={event.status} /><Link href={`/content/events/${event.id}`} className="text-xs font-medium text-emerald-200 underline underline-offset-4">EDIT</Link></div></article>)}{!filtered.length && <p className="p-8 text-center text-sm text-white/45">No events match these filters.</p>}</div></section>;
}
