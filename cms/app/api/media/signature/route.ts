import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { cloudinary, cloudinaryConfig } from "@/lib/cloudinary";

export async function POST() {
  await requireAdmin();
  try {
    const { cloudName, apiKey, apiSecret } = cloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "comsoc";
    const allowedFormats = "jpg,jpeg,png,webp,gif,pdf";
    const signature = cloudinary.utils.api_sign_request({ timestamp, folder, allowed_formats: allowedFormats }, apiSecret);
    return NextResponse.json({ timestamp, signature, folder, allowedFormats, cloudName, apiKey });
  } catch (error) {
    console.error("Cloudinary signing failed", error);
    return NextResponse.json({ error: "Uploads are not configured." }, { status: 500 });
  }
}
