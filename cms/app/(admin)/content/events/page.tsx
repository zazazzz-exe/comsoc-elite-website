import Link from "next/link";
import { EventManager } from "@/components/content/event-manager";
import type { EventRow } from "@/components/content/event-form";
import { prisma } from "@/lib/prisma";

async function events(): Promise<EventRow[]> {
  try {
    const rows = await prisma.event.findMany({ include: { media: { orderBy: [{ displayOrder: "asc" }, { id: "asc" }] } }, orderBy: [{ startsAt: "desc" }, { displayOrder: "asc" }] });
    return rows.map((event) => ({ ...event, eventKind: event.eventKind as EventRow["eventKind"], status: event.status as EventRow["status"], startsAt: event.startsAt.toISOString().slice(0, 10), endsAt: event.endsAt?.toISOString().slice(0, 10) ?? null, budget: event.budget?.toString() ?? null, media: event.media }));
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const rows = await events();
  return <><Link href="/content" className="text-xs font-medium tracking-[0.12em] text-emerald-200 hover:text-white">BACK TO CONTENT</Link><h1 className="mt-8 font-display text-4xl font-light tracking-wide text-white">EVENTS</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">Filter the program by status or type, then work on one event at a time. Drafts remain private until published.</p><EventManager events={rows} /></>;
}
