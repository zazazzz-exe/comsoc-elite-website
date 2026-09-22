"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

const status = z.enum(["draft", "published", "archived"]);
const assetId = z.string().uuid().optional().or(z.literal(""));
const personSchema = z.object({ id: z.string().uuid().optional(), name: z.string().min(1).max(120), role: z.string().min(1).max(120), organization: z.enum(["comsoc", "ccs_elites"]), personKind: z.enum(["officer", "adviser"]), tier: z.coerce.number().int().min(0).max(9), department: z.string().max(160).optional(), email: z.string().email().optional().or(z.literal("")), facebookUrl: z.string().url().optional().or(z.literal("")), imageUrl: z.string().url().optional().or(z.literal("")), imageAssetId: assetId, status });
const facultySchema = z.object({ id: z.string().uuid().optional(), name: z.string().min(1).max(120), department: z.string().min(1).max(160), imageUrl: z.string().url().optional().or(z.literal("")), imageAssetId: assetId, displayOrder: z.coerce.number().int().min(0).default(0), status });

export async function savePerson(formData: FormData) {
  await requireAdmin(); const { id, email, facebookUrl, imageUrl, imageAssetId, ...data } = personSchema.parse(Object.fromEntries(formData));
  const record = { ...data, email: email || null, facebookUrl: facebookUrl || null, imageUrl: imageUrl || null, ...(imageAssetId ? { imageAssetId } : {}) };
  if (id) await prisma.organizationPerson.update({ where: { id }, data: record }); else await prisma.organizationPerson.create({ data: record });
  revalidatePath("/content"); revalidatePath("/content/people");
}

export async function saveFaculty(formData: FormData) {
  await requireAdmin(); const { id, imageUrl, imageAssetId, ...data } = facultySchema.parse(Object.fromEntries(formData));
  const record = { ...data, imageUrl: imageUrl || null, ...(imageAssetId ? { imageAssetId } : {}) };
  if (id) await prisma.facultyMember.update({ where: { id }, data: record }); else await prisma.facultyMember.create({ data: record });
  revalidatePath("/content"); revalidatePath("/content/faculty");
}
