"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { uploadMedia } from "@/lib/media/upload";
import { useToast } from "@/components/feedback/toast-provider";

type UploadedAsset = { id?: string; url: string };
type LibraryAsset = { id: string; url: string; publicId: string; altText: string | null };

export function CloudinaryAssetField({ name, assetIdName = name === "cover_image_url" ? "coverImageAssetId" : "imageAssetId", initialAssets = [], label, multiple = false }: { name: string; assetIdName?: string; initialAssets?: UploadedAsset[]; label: string; multiple?: boolean }) {
  const [assets, setAssets] = useState<UploadedAsset[]>(initialAssets);
  const [message, setMessage] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [library, setLibrary] = useState<LibraryAsset[]>([]);
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => { if (!libraryOpen) return; const controller = new AbortController(); const timer = window.setTimeout(async () => { try { const response = await fetch(`/admin/api/media?q=${encodeURIComponent(query)}`, { signal: controller.signal }); const data = await response.json() as LibraryAsset[] | { error?: string }; if (response.ok) setLibrary(data as LibraryAsset[]); else toast((data as { error?: string }).error ?? "Could not load media.", "error"); } catch (error) { if ((error as Error).name !== "AbortError") toast("Could not load media.", "error"); } }, 200); return () => { controller.abort(); window.clearTimeout(timer); }; }, [libraryOpen, query, toast]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    if (!navigator.onLine) { toast("You are offline. The image was not uploaded.", "error"); return; }
    setUploading(true); setMessage(undefined); toast(`Uploading ${files.length} image${files.length === 1 ? "" : "s"}…`);
    const uploaded: UploadedAsset[] = [];
    for (const file of Array.from(files)) { try { uploaded.push(await uploadMedia(file)); } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); toast(error instanceof Error ? error.message : "Upload failed.", "error"); break; } }
    if (uploaded.length) { setAssets(multiple ? [...assets, ...uploaded] : uploaded); setMessage(`${uploaded.length} file${uploaded.length === 1 ? "" : "s"} attached.`); toast(`${uploaded.length} image${uploaded.length === 1 ? "" : "s"} attached.`, "success"); }
    setUploading(false);
  }
  function choose(asset: LibraryAsset) { setAssets(multiple ? [...assets, asset] : [asset]); setLibraryOpen(false); setMessage("Image selected from media library."); toast("Image selected from media library.", "success"); }

  return <div className="border border-dashed border-white/20 bg-[#0c0c0e] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs font-medium tracking-[0.12em] text-white/70">{label}</span><div className="flex gap-2"><label className="cursor-pointer border border-white/15 px-3 py-2 text-[10px] font-medium tracking-[0.12em] text-white/70 hover:border-emerald-300/60 hover:text-emerald-200">{uploading ? "UPLOADING" : "UPLOAD NEW"}<input onChange={(event) => upload(event.target.files)} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple={multiple} className="sr-only" /></label><button type="button" onClick={() => setLibraryOpen((open) => !open)} className="border border-white/15 px-3 py-2 text-[10px] font-medium tracking-[0.12em] text-white/70 hover:border-emerald-300/60 hover:text-emerald-200">MEDIA LIBRARY</button></div></div>{libraryOpen && <div className="mt-4 border border-white/10 p-3"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search uploaded images" className="w-full border border-white/15 bg-[#09090b] px-3 py-2 text-sm text-white outline-none focus:border-emerald-300" /><div className="mt-3 grid max-h-64 grid-cols-3 gap-2 overflow-y-auto">{library.map((asset) => <button key={asset.id} type="button" onClick={() => choose(asset)} className="group relative aspect-square overflow-hidden border border-white/10 hover:border-emerald-300"><Image src={asset.url} alt={asset.altText ?? asset.publicId} fill unoptimized className="object-cover" /><span className="absolute inset-x-0 bottom-0 truncate bg-black/70 px-1 py-1 text-[9px] text-white opacity-0 group-hover:opacity-100">{asset.publicId}</span></button>)}{!library.length && <p className="col-span-3 py-6 text-center text-xs text-white/40">No images found.</p>}</div></div>}{assets.map((asset) => <div key={asset.id ?? asset.url}><input type="hidden" name={name} value={asset.url} />{asset.id && <input type="hidden" name={assetIdName} value={asset.id} />}</div>)}{assets.length > 0 && <div className="mt-4 grid grid-cols-3 gap-2">{assets.map((asset) => <div key={asset.id ?? asset.url} className="relative aspect-square overflow-hidden border border-white/10"><Image src={asset.url} alt="Selected asset" fill unoptimized className="object-cover" /></div>)}</div>}<p className="mt-3 text-xs text-white/40">{message ?? (multiple ? "Upload or select gallery images." : "Upload a new image or select one from the media library.")}</p></div>;
}
