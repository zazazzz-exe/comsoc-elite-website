import { notFound } from "next/navigation";
import { EventForm, type EventRow } from "@/components/content/event-form";
import { prisma } from "@/lib/prisma";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id }, include: { media: { orderBy: [{ displayOrder: "asc" }, { id: "asc" }] } } });
  if (!event) notFound();
  const row: EventRow = { ...event, eventKind: event.eventKind as EventRow["eventKind"], status: event.status as EventRow["status"], startsAt: event.startsAt.toISOString().slice(0, 10), endsAt: event.endsAt?.toISOString().slice(0, 10) ?? null, budget: event.budget?.toString() ?? null, media: event.media };
  return <EventForm event={row} />;
}
