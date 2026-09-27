"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { audit } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import { refreshPublicWebsite } from "@/lib/website-revalidation";

const status = z.enum(["draft", "published", "archived"]);
const assetId = z.string().uuid().optional().or(z.literal(""));
const personSchema = z.object({ id: z.string().uuid().optional(), name: z.string().min(1).max(120), role: z.string().min(1).max(120), organization: z.enum(["comsoc", "ccs_elites"]), personKind: z.enum(["officer", "adviser"]), tier: z.coerce.number().int().min(0).max(9), displayOrder: z.coerce.number().int().min(0).default(0), department: z.string().max(160).optional(), email: z.string().email().optional().or(z.literal("")), facebookUrl: z.string().url().optional().or(z.literal("")), imageUrl: z.string().url().optional().or(z.literal("")), imageAssetId: assetId, status });
const facultySchema = z.object({ id: z.string().uuid().optional(), name: z.string().min(1).max(120), department: z.string().min(1).max(160), imageUrl: z.string().url().optional().or(z.literal("")), imageAssetId: assetId, displayOrder: z.coerce.number().int().min(0).default(0), status });
const placementSchema = z.object({ id: z.string().uuid(), organization: z.enum(["comsoc", "ccs_elites"]), personKind: z.enum(["officer", "adviser"]), tier: z.number().int().min(0).max(2), displayOrder: z.number().int().min(0), status });
const bulkOfficerSchema = z.object({ name: z.string().min(1).max(120), role: z.string().min(1).max(120), organization: z.enum(["comsoc", "ccs_elites"]), tier: z.number().int().min(0).max(2), email: z.string().email().optional().or(z.literal("")), facebookUrl: z.string().url().optional().or(z.literal("")), status: status.default("draft"), imageUrl: z.string().url().optional().or(z.literal("")), imageAssetId: assetId });

export async function savePerson(formData: FormData) {
  const admin = await requireAdmin(); const { id, email, facebookUrl, imageUrl, imageAssetId, ...data } = personSchema.parse(Object.fromEntries(formData));
  const record = { ...data, email: email || null, facebookUrl: facebookUrl || null, imageUrl: imageUrl || null, ...(imageAssetId ? { imageAssetId } : {}) };
  const person = id ? await prisma.organizationPerson.update({ where: { id }, data: record }) : await prisma.organizationPerson.create({ data: record });
  await audit(admin.id, id ? "update" : "create", "organization_person", person.id, { status: person.status });
  revalidatePath("/content"); revalidatePath("/content/people");
  await refreshPublicWebsite();
}

export async function saveFaculty(formData: FormData) {
  const admin = await requireAdmin(); const { id, imageUrl, imageAssetId, ...data } = facultySchema.parse(Object.fromEntries(formData));
  const record = { ...data, imageUrl: imageUrl || null, ...(imageAssetId ? { imageAssetId } : {}) };
  const member = id ? await prisma.facultyMember.update({ where: { id }, data: record }) : await prisma.facultyMember.create({ data: record });
  await audit(admin.id, id ? "update" : "create", "faculty_member", member.id, { status: member.status });
  revalidatePath("/content"); revalidatePath("/content/faculty");
  await refreshPublicWebsite();
}

export async function savePeopleLayout(placements: z.infer<typeof placementSchema>[]) {
  const admin = await requireAdmin();
  const records = z.array(placementSchema).max(100).parse(placements);
  await prisma.$transaction(records.map(({ id, ...data }) => prisma.organizationPerson.update({ where: { id }, data })));
  revalidatePath("/content"); revalidatePath("/content/people");
  await audit(admin.id, "reorder", "organization_person", undefined, { records: records.length });
  await refreshPublicWebsite();
}

export async function bulkCreateOfficers(input: z.infer<typeof bulkOfficerSchema>[]) {
  const admin = await requireAdmin();
  const officers = z.array(bulkOfficerSchema).min(1).max(100).parse(input);
  const duplicateNames = new Set<string>();
  const seenNames = new Set<string>();
  officers.forEach((officer) => { const key = officer.name.trim().toLowerCase(); if (seenNames.has(key)) duplicateNames.add(officer.name); seenNames.add(key); });
  if (duplicateNames.size) throw new Error(`Duplicate names in import: ${[...duplicateNames].join(", ")}.`);

  await prisma.$transaction(async (tx) => {
    const nextOrder = new Map<string, number>();
    for (const officer of officers) {
      const key = `${officer.organization}-${officer.tier}`;
      if (!nextOrder.has(key)) {
        const result = await tx.organizationPerson.aggregate({ where: { organization: officer.organization, personKind: "officer", tier: officer.tier }, _max: { displayOrder: true } });
        nextOrder.set(key, (result._max.displayOrder ?? -1) + 1);
      }
      const displayOrder = nextOrder.get(key)!;
      nextOrder.set(key, displayOrder + 1);
      await tx.organizationPerson.create({ data: { name: officer.name.trim(), role: officer.role.trim(), organization: officer.organization, personKind: "officer", tier: officer.tier, displayOrder, status: officer.status, email: officer.email || null, facebookUrl: officer.facebookUrl || null, imageUrl: officer.imageUrl || null, ...(officer.imageAssetId ? { imageAssetId: officer.imageAssetId } : {}) } });
    }
  });
  revalidatePath("/content"); revalidatePath("/content/people");
  await audit(admin.id, "bulk_create", "organization_person", undefined, { records: officers.length });
  await refreshPublicWebsite();
  return { created: officers.length };
}

const recordId = z.object({ id: z.string().uuid() });

export async function setPersonStatus(formData: FormData) {
  const admin = await requireAdmin(); const { id } = recordId.parse(Object.fromEntries(formData));
  const status = z.enum(["draft", "published", "archived"]).parse(formData.get("status"));
  await prisma.organizationPerson.update({ where: { id }, data: { status } });
  await audit(admin.id, status === "archived" ? "archive" : "restore", "organization_person", id, { status });
  revalidatePath("/content"); revalidatePath("/content/people"); await refreshPublicWebsite();
}

export async function setFacultyStatus(formData: FormData) {
  const admin = await requireAdmin(); const { id } = recordId.parse(Object.fromEntries(formData));
  const status = z.enum(["draft", "published", "archived"]).parse(formData.get("status"));
  await prisma.facultyMember.update({ where: { id }, data: { status } });
  await audit(admin.id, status === "archived" ? "archive" : "restore", "faculty_member", id, { status });
  revalidatePath("/content"); revalidatePath("/content/faculty"); await refreshPublicWebsite();
}

export async function deleteFaculty(formData: FormData) {
  const admin = await requireAdmin(); const { id } = recordId.parse(Object.fromEntries(formData));
  await prisma.facultyMember.delete({ where: { id } });
  await audit(admin.id, "delete", "faculty_member", id);
  revalidatePath("/content"); revalidatePath("/content/faculty"); await refreshPublicWebsite();
}

export async function deletePerson(formData: FormData) {
  const admin = await requireAdmin(); const { id } = recordId.parse(Object.fromEntries(formData));
  await prisma.organizationPerson.delete({ where: { id } });
  await audit(admin.id, "delete", "organization_person", id);
  revalidatePath("/content"); revalidatePath("/content/people"); await refreshPublicWebsite();
}
