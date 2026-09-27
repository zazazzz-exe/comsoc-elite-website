import { NextResponse } from "next/server";
import { z } from "zod";
import { audit } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth/admin";
import { cloudinary, cloudinaryConfig, maxUploadBytes } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

const assetSchema = z.object({
  publicId: z.string().min(1).max(500).regex(/^comsoc\//),
  resourceType: z.enum(["image", "raw", "video"]),
});
const allowedFormats = new Set(["jpg", "jpeg", "png", "webp", "gif", "pdf"]);

export async function GET(request: Request) {
  await requireAdmin();
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  try {
    const assets = await prisma.mediaAsset.findMany({ where: { resourceType: "image", ...(query ? { OR: [{ publicId: { contains: query, mode: "insensitive" } }, { altText: { contains: query, mode: "insensitive" } }] } : {}) }, select: { id: true, url: true, publicId: true, altText: true }, orderBy: { createdAt: "desc" }, take: 48 });
    return NextResponse.json(assets);
  } catch {
    return NextResponse.json({ error: "Could not load the media library." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  try {
    const input = assetSchema.parse(await request.json());
    cloudinaryConfig();
    const asset = await cloudinary.api.resource(input.publicId, { resource_type: input.resourceType });
    if (asset.public_id !== input.publicId || !asset.secure_url) return NextResponse.json({ error: "Uploaded asset could not be verified." }, { status: 422 });
    if (!asset.format || !allowedFormats.has(asset.format.toLowerCase()) || asset.bytes > maxUploadBytes) {
      await cloudinary.uploader.destroy(input.publicId, { resource_type: input.resourceType, invalidate: true });
      return NextResponse.json({ error: "The uploaded file type or size is not allowed." }, { status: 422 });
    }
    const record = await prisma.mediaAsset.upsert({
      where: { publicId: asset.public_id },
      create: { publicId: asset.public_id, url: asset.secure_url, resourceType: asset.resource_type, format: asset.format, bytes: asset.bytes, width: asset.width, height: asset.height },
      update: { url: asset.secure_url, resourceType: asset.resource_type, format: asset.format, bytes: asset.bytes, width: asset.width, height: asset.height },
    });
    await audit(admin.id, "upsert", "media_asset", record.id, { publicId: record.publicId });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Cloudinary asset registration failed", error);
    return NextResponse.json({ error: "The upload completed but could not be verified by the CMS." }, { status: 500 });
  }
}
