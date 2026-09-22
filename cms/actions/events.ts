"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

const eventSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(160),
  event_kind: z.enum(["upcoming", "gallery"]),
  starts_at: z.string().date(),
  status: z.enum(["draft", "published", "archived"]),
  location: z.string().max(160).optional(),
  time_label: z.string().max(80).optional(),
  description: z.string().max(10000).optional(),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  coverImageAssetId: z.string().uuid().optional().or(z.literal("")),
});

function data(formData: FormData) {
  const result = eventSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) throw new Error("Invalid event data.");
  return result.data;
}

export async function saveEvent(formData: FormData) {
  await requireAdmin();
  const values = data(formData);
  const { id, ...record } = values;
  const eventData = { slug: record.slug, title: record.title, eventKind: record.event_kind, startsAt: new Date(record.starts_at), status: record.status, location: record.location || null, timeLabel: record.time_label || null, description: record.description || null, coverImageUrl: record.cover_image_url || null, ...(record.coverImageAssetId ? { coverImageAssetId: record.coverImageAssetId } : {}) };
  if (id) await prisma.event.update({ where: { id }, data: eventData }); else await prisma.event.create({ data: eventData });
  revalidatePath("/content/events");
  revalidatePath("/content");
}

export async function deleteEvent(formData: FormData) {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  await prisma.event.delete({ where: { id } });
  revalidatePath("/content/events");
  revalidatePath("/content");
}
