"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { audit } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import { refreshPublicWebsite } from "@/lib/website-revalidation";

const eventSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(160),
  event_kind: z.enum(["upcoming", "gallery"]),
  starts_at: z.string().date(),
  ends_at: z.string().date().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
  location: z.string().max(160).optional(),
  time_label: z.string().max(80).optional(),
  budget: z.coerce.number().min(0).max(9999999999.99).optional().or(z.literal("")),
  display_order: z.coerce.number().int().min(0).default(0),
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
  const admin = await requireAdmin();
  const values = data(formData);
  const { id, ...record } = values;
  const eventData = { slug: record.slug, title: record.title, eventKind: record.event_kind, startsAt: new Date(record.starts_at), endsAt: record.ends_at ? new Date(record.ends_at) : null, status: record.status, location: record.location || null, timeLabel: record.time_label || null, budget: record.budget === "" ? null : record.budget, displayOrder: record.display_order, description: record.description || null, coverImageUrl: record.cover_image_url || null, ...(record.coverImageAssetId ? { coverImageAssetId: record.coverImageAssetId } : {}) };
  const event = id ? await prisma.event.update({ where: { id }, data: eventData }) : await prisma.event.create({ data: eventData });
  await audit(admin.id, id ? "update" : "create", "event", event.id, { status: event.status, eventKind: event.eventKind });
  revalidatePath("/content/events");
  revalidatePath("/content");
  await refreshPublicWebsite();
}

export async function deleteEvent(formData: FormData) {
  const admin = await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  await prisma.event.delete({ where: { id } });
  await audit(admin.id, "delete", "event", id);
  revalidatePath("/content/events");
  revalidatePath("/content");
  await refreshPublicWebsite();
}

const eventMediaSchema = z.object({ id: z.string().uuid().optional(), eventId: z.string().uuid(), imageUrl: z.string().url(), mediaAssetId: z.string().uuid().optional().or(z.literal("")), altText: z.string().max(250).optional(), displayOrder: z.coerce.number().int().min(0).default(0) });

export async function saveEventMedia(formData: FormData) {
  const admin = await requireAdmin(); const { id, eventId, imageUrl, mediaAssetId, altText, displayOrder } = eventMediaSchema.parse(Object.fromEntries(formData));
  const data = { eventId, imageUrl, altText: altText || null, displayOrder, ...(mediaAssetId ? { mediaAssetId } : {}) };
  const media = id ? await prisma.eventMedia.update({ where: { id }, data }) : await prisma.eventMedia.create({ data });
  await audit(admin.id, id ? "update" : "create", "event_media", media.id, { eventId });
  revalidatePath("/content/events"); await refreshPublicWebsite();
}

export async function deleteEventMedia(formData: FormData) {
  const admin = await requireAdmin(); const id = z.string().uuid().parse(formData.get("id"));
  await prisma.eventMedia.delete({ where: { id } });
  await audit(admin.id, "delete", "event_media", id);
  revalidatePath("/content/events"); await refreshPublicWebsite();
}
