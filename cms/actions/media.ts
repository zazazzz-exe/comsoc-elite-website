"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { audit } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth/admin";
import { cloudinary, cloudinaryConfig } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function deleteMediaAsset(formData: FormData) {
  const admin = await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
    include: { facultyImages: { select: { id: true } }, personImages: { select: { id: true } }, eventCoverImages: { select: { id: true } }, eventMediaAssets: { select: { id: true } } },
  });
  if (!asset) throw new Error("Media asset was not found.");
  const references = asset.facultyImages.length + asset.personImages.length + asset.eventCoverImages.length + asset.eventMediaAssets.length;
  if (references) throw new Error(`This asset is in use by ${references} content record${references === 1 ? "" : "s"} and cannot be deleted.`);

  await prisma.mediaAsset.delete({ where: { id } });
  try {
    cloudinaryConfig();
    await cloudinary.uploader.destroy(asset.publicId, { resource_type: asset.resourceType, invalidate: true });
  } catch (error) {
    console.error("[cms media] database asset deleted but Cloudinary cleanup failed", { id, error });
  }
  await audit(admin.id, "delete", "media_asset", id, { publicId: asset.publicId });
  revalidatePath("/media");
}
