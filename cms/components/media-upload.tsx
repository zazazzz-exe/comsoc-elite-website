"use client";

import { useState } from "react";
import { uploadMedia } from "@/lib/media/upload";
import { useToast } from "@/components/feedback/toast-provider";

export function MediaUpload() {
  const [message, setMessage] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  async function upload(formData: FormData) {
    if (!navigator.onLine) { toast("You are offline. The file was not uploaded.", "error"); return; }
    setUploading(true); toast("Uploading file to Cloudinary…");
    setMessage(undefined);
    const file = formData.get("file");
    if (!(file instanceof File)) { setMessage("Choose a file to upload."); setUploading(false); return; }
    try { await uploadMedia(file); setMessage("Upload complete. The Cloudinary URL is now recorded in Supabase."); toast("File uploaded and recorded.", "success"); } catch (error) { const message = error instanceof Error ? error.message : "Upload failed."; setMessage(message); toast(message, "error"); }
    setUploading(false);
  }

  return <form action={upload} className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6">
    <label className="text-xs font-medium tracking-[0.12em] text-white/70">SELECT FILE<input required name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" className="mt-2 block w-full text-sm text-white/55 file:mr-4 file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-medium file:tracking-[0.1em] file:text-white hover:file:bg-white/20" /></label>
    <div className="flex items-center gap-4"><button disabled={uploading} className="w-fit border border-emerald-300/60 px-4 py-2.5 text-xs font-medium tracking-[0.14em] text-emerald-200 hover:bg-emerald-300 hover:text-[#09090b] disabled:cursor-wait disabled:opacity-50">{uploading ? "UPLOADING" : "UPLOAD FILE"}</button><span className="text-xs text-white/45">JPG, PNG, WebP, GIF, or PDF. Max 10 MB.</span></div>
    {message && <p role="status" className="text-sm text-emerald-100">{message}</p>}
  </form>;
}
