"use client";

import Image from "next/image";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { bulkCreateOfficers } from "@/actions/people";
import { uploadMedia } from "@/lib/media/upload";
import { useToast } from "@/components/feedback/toast-provider";

type BulkRow = { id: string; name: string; role: string; organization: "comsoc" | "ccs_elites"; tier: number; status: "draft" | "published" | "archived"; imageUrl: string; imageAssetId: string };
const input = "mt-1.5 w-full border border-white/15 bg-[#09090b] px-3 py-2 text-sm text-white outline-none focus:border-emerald-300";

function nameFromFile(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function BulkOfficerImport() {
  const [rows, setRows] = useState<BulkRow[]>([]);
  const [message, setMessage] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const ready = rows.length > 0 && rows.every((row) => row.name.trim() && row.role.trim());

  function updateRow(id: string, patch: Partial<BulkRow>) { setRows((current) => current.map((row) => row.id === id ? { ...row, ...patch } : row)); }
  async function uploadPhotos(files: FileList | null) {
    if (!files?.length) return;
    if (!navigator.onLine) { toast("You are offline. Portraits were not uploaded.", "error"); return; }
    setUploading(true); setMessage(undefined); toast(`Uploading ${files.length} portraits…`);
    const uploaded: BulkRow[] = [];
    try {
      for (const file of Array.from(files)) {
        const asset = await uploadMedia(file);
        uploaded.push({ id: crypto.randomUUID(), name: nameFromFile(file.name), role: "", organization: "comsoc", tier: 0, status: "draft", imageUrl: asset.url, imageAssetId: asset.id });
      }
      setRows((current) => [...current, ...uploaded]);
      setMessage(`${uploaded.length} portraits uploaded. Complete each officer card, then save the batch.`); toast(`${uploaded.length} portraits ready for review.`, "success");
    } catch (error) { const message = error instanceof Error ? error.message : "Photo upload failed."; setMessage(message); toast(message, "error"); } finally { setUploading(false); }
  }
  async function saveAll() {
    if (!ready) { setMessage("Every officer needs a name and role before the batch can be created."); return; }
    if (!navigator.onLine) { toast("You are offline. Officers have not been created.", "error"); return; }
    setSaving(true); setMessage(undefined); toast(`Creating ${rows.length} officers…`);
    try {
      const result = await bulkCreateOfficers(rows.map(({ id: _id, ...row }) => row));
      setRows([]); setMessage(`${result.created} officers created. Return to People to arrange their board positions.`); toast(`${result.created} officers created.`, "success");
    } catch (error) { const message = error instanceof Error ? error.message : "Could not create officers."; setMessage(message); toast(message, "error"); } finally { setSaving(false); }
  }

  return <div className="mt-10 max-w-6xl space-y-6"><section className="border border-white/10 bg-[#111113] p-5 md:p-7"><div className="flex items-start gap-3"><ImagePlus className="mt-1 text-emerald-300" size={20} /><div><h2 className="text-lg font-semibold text-white">1. Upload portraits</h2><p className="mt-1 text-sm text-white/50">Select all officer photos at once. Images upload securely to Cloudinary, then appear as editable officer cards below.</p></div></div><label className="mt-5 block border border-dashed border-white/20 p-7 text-center text-sm text-white/55 hover:border-emerald-300/60"><input disabled={uploading} onChange={(event) => uploadPhotos(event.target.files)} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" /><Upload size={22} className="mx-auto mb-3 text-emerald-300" />{uploading ? "Uploading portraits..." : "Choose all portrait files"}<span className="mt-2 block text-xs text-white/35">JPG, PNG, WebP, or GIF. Up to 10 MB per file.</span></label></section>{rows.length > 0 && <><section className="border border-white/10 bg-[#111113]"><div className="flex flex-col gap-2 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-semibold text-white">2. Complete officer cards</h2><p className="mt-1 text-sm text-white/50">Names are suggested from the photo filename. Set each role and placement before saving.</p></div><span className="text-sm text-emerald-200">{rows.length} portraits</span></div><div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">{rows.map((row) => <article key={row.id} className="overflow-hidden border border-white/10 bg-[#0c0c0e]"><div className="relative aspect-[4/3] bg-white/[0.04]"><Image src={row.imageUrl} alt="" fill unoptimized className="object-cover" /><button type="button" onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))} className="absolute top-2 right-2 grid h-8 w-8 place-items-center bg-black/60 text-white/70 hover:bg-red-500 hover:text-white" aria-label={`Remove ${row.name || "officer"}`}><Trash2 size={15} /></button></div><div className="space-y-3 p-4"><label className="block text-[10px] font-medium tracking-[0.13em] text-white/55">NAME<input value={row.name} onChange={(event) => updateRow(row.id, { name: event.target.value })} className={input} /></label><label className="block text-[10px] font-medium tracking-[0.13em] text-white/55">ROLE<input value={row.role} onChange={(event) => updateRow(row.id, { role: event.target.value })} placeholder="President" className={input} /></label><div className="grid grid-cols-2 gap-3"><label className="block text-[10px] font-medium tracking-[0.13em] text-white/55">SECTION<select value={row.organization} onChange={(event) => updateRow(row.id, { organization: event.target.value as BulkRow["organization"] })} className={input}><option value="comsoc">COMSOC</option><option value="ccs_elites">CCS Elites</option></select></label><label className="block text-[10px] font-medium tracking-[0.13em] text-white/55">ROW<select value={row.tier} onChange={(event) => updateRow(row.id, { tier: Number(event.target.value) })} className={input}><option value="0">Row 1</option><option value="1">Row 2</option><option value="2">Row 3</option></select></label></div><label className="block text-[10px] font-medium tracking-[0.13em] text-white/55">STATUS<select value={row.status} onChange={(event) => updateRow(row.id, { status: event.target.value as BulkRow["status"] })} className={input}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label></div></article>)}</div></section><section className="flex flex-col gap-4 border border-white/10 bg-[#111113] p-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-white/50">{ready ? "All cards are ready to create." : "Add a role to every officer before saving."}</p><button type="button" disabled={!ready || saving} onClick={saveAll} className="bg-emerald-300 px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-[#07110d] hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-40">{saving ? "CREATING" : `CREATE ${rows.length} OFFICERS`}</button></section></>}{message && <p role="status" className="border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">{message}</p>}</div>;
}
