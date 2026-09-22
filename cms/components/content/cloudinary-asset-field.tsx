"use client";

import Image from "next/image";
import { useState } from "react";

type UploadedAsset = { id: string; url: string };

export function CloudinaryAssetField({ name, assetIdName = name === "cover_image_url" ? "coverImageAssetId" : "imageAssetId", label, multiple = false }: { name: string; assetIdName?: string; label: string; multiple?: boolean }) {
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [message, setMessage] = useState<string>();
  const [uploading, setUploading] = useState(false);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true); setMessage(undefined);
    const uploaded: UploadedAsset[] = [];
    for (const file of Array.from(files)) {
      const body = new FormData(); body.append("file", file);
      const response = await fetch("/admin/api/media", { method: "POST", body });
      const result = await response.json() as { id?: string; url?: string; error?: string };
      if (result.id && result.url) uploaded.push({ id: result.id, url: result.url }); else { setMessage(result.error ?? "Upload failed."); break; }
    }
    if (uploaded.length) { setAssets(multiple ? [...assets, ...uploaded] : uploaded); setMessage(`${uploaded.length} file${uploaded.length === 1 ? "" : "s"} attached.`); }
    setUploading(false);
  }

  return <div className="border border-dashed border-white/20 bg-[#0c0c0e] p-4">
    <div className="flex items-center justify-between gap-3"><label className="text-xs font-medium tracking-[0.12em] text-white/70">{label}<input onChange={(event) => upload(event.target.files)} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple={multiple} className="sr-only" /></label><label className="cursor-pointer border border-white/15 px-3 py-2 text-[10px] font-medium tracking-[0.12em] text-white/70 hover:border-emerald-300/60 hover:text-emerald-200">{uploading ? "UPLOADING" : "CHOOSE IMAGE"}<input onChange={(event) => upload(event.target.files)} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple={multiple} className="sr-only" /></label></div>
    {assets.map((asset) => <div key={asset.id}><input type="hidden" name={name} value={asset.url} /><input type="hidden" name={assetIdName} value={asset.id} /></div>)}
    {assets.length > 0 && <div className="mt-4 grid grid-cols-3 gap-2">{assets.map((asset) => <div key={asset.id} className="relative aspect-square overflow-hidden border border-white/10"><Image src={asset.url} alt="Uploaded asset" fill unoptimized className="object-cover" /></div>)}</div>}
    <p className="mt-3 text-xs text-white/40">{message ?? (multiple ? "Upload a gallery of supporting images." : "Upload a single image directly to this record.")}</p>
  </div>;
}
