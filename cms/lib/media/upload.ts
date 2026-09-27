"use client";

const maxUploadBytes = 10 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);

export type MediaAsset = { id: string; url: string };

type UploadSignature = { timestamp: number; signature: string; folder: string; allowedFormats: string; cloudName: string; apiKey: string; error?: string };
type CloudinaryUpload = { public_id?: string; resource_type?: string; error?: { message?: string } };

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function registerAsset(publicId: string, resourceType: string): Promise<MediaAsset> {
  let lastError = "Could not record the uploaded file.";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch("/admin/api/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ publicId, resourceType }) });
      const result = await response.json() as MediaAsset & { error?: string };
      if (response.ok && result.id && result.url) return result;
      lastError = result.error ?? lastError;
    } catch {
      lastError = "The upload completed, but the CMS could not save its record. Retrying...";
    }
    if (attempt < 2) await wait((attempt + 1) * 800);
  }
  throw new Error(lastError);
}

export async function uploadMedia(file: File): Promise<MediaAsset> {
  if (!allowedTypes.has(file.type)) throw new Error("Use a JPG, PNG, WebP, GIF, or PDF file.");
  if (file.size > maxUploadBytes) throw new Error("Files must be 10 MB or smaller.");

  const signatureResponse = await fetch("/admin/api/media/signature", { method: "POST", cache: "no-store" });
  const signature = await signatureResponse.json() as UploadSignature;
  if (!signatureResponse.ok) throw new Error(signature.error ?? "Could not authorize the upload.");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signature.apiKey);
  form.append("timestamp", String(signature.timestamp));
  form.append("signature", signature.signature);
  form.append("folder", signature.folder);
  form.append("allowed_formats", signature.allowedFormats);
  const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`, { method: "POST", body: form });
  const uploaded = await uploadResponse.json() as CloudinaryUpload;
  if (!uploadResponse.ok || !uploaded.public_id || !uploaded.resource_type) throw new Error(uploaded.error?.message ?? "Cloudinary could not upload this file.");

  return registerAsset(uploaded.public_id, uploaded.resource_type);
}
