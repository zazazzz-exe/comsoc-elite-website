import { v2 as cloudinary } from "cloudinary";

export const allowedUploadTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);
export const maxUploadBytes = 10 * 1024 * 1024;

export function cloudinaryConfig() {
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = process.env;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary is not configured.");
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  return { cloudName, apiKey, apiSecret };
}

export { cloudinary };
