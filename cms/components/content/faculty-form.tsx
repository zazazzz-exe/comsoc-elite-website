"use client";

import Link from "next/link";
import { deleteFaculty, saveFaculty } from "@/actions/people";
import { CloudinaryAssetField } from "@/components/content/cloudinary-asset-field";
import { ActionForm } from "@/components/feedback/action-form";

const input = "mt-1.5 w-full border border-white/15 bg-[#09090b] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-emerald-300";

export type FacultyRow = { id: string; name: string; department: string; imageUrl: string | null; imageAssetId: string | null; displayOrder: number; status: "draft" | "published" | "archived" };

export function FacultyForm({ member }: { member?: FacultyRow }) {
  const image = member?.imageUrl ? [{ id: member.imageAssetId ?? undefined, url: member.imageUrl }] : [];
  return <div className="mt-8 max-w-4xl"><ActionForm action={saveFaculty} pendingMessage={member ? "Saving faculty profile..." : "Creating faculty profile..."} successMessage={member ? "Faculty profile saved." : "Faculty profile created."} className="space-y-6 border border-white/10 bg-[#111113] p-5 md:p-7">
    {member && <input type="hidden" name="id" value={member.id} />}
    <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between"><div><h1 className="text-2xl font-semibold text-white">{member ? `Edit ${member.name}` : "Add a faculty member"}</h1><p className="mt-2 text-sm leading-6 text-white/55">Keep a profile, portrait, display order, and publishing state together in one focused workspace.</p></div><Link href="/content/faculty" className="w-fit border border-white/15 px-3 py-2 text-xs font-medium text-white/70 hover:border-white/35 hover:text-white">BACK TO FACULTY</Link></div>
    <div className="grid gap-5 md:grid-cols-2"><label className="text-xs font-medium tracking-[0.12em] text-white/65">FULL NAME<input required name="name" defaultValue={member?.name} className={input} /></label><label className="text-xs font-medium tracking-[0.12em] text-white/65">DEPARTMENT<input required name="department" defaultValue={member?.department ?? "College of Computer Studies"} className={input} /></label><label className="text-xs font-medium tracking-[0.12em] text-white/65">DISPLAY ORDER<input name="displayOrder" type="number" min="0" defaultValue={member?.displayOrder ?? 0} className={input} /></label><label className="text-xs font-medium tracking-[0.12em] text-white/65">PUBLISH STATUS<select name="status" defaultValue={member?.status ?? "draft"} className={input}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><div className="md:col-span-2"><CloudinaryAssetField name="imageUrl" initialAssets={image} label="PORTRAIT" /></div></div>
    <div className="flex justify-end border-t border-white/10 pt-5"><button className="bg-emerald-300 px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-[#07110d] hover:bg-emerald-200">{member ? "SAVE CHANGES" : "CREATE FACULTY PROFILE"}</button></div>
  </ActionForm>{member && <ActionForm action={deleteFaculty} pendingMessage="Deleting faculty profile..." successMessage="Faculty profile deleted." className="mt-4 text-right"><input type="hidden" name="id" value={member.id} /><button className="text-xs text-red-300 underline underline-offset-4">DELETE FACULTY PROFILE</button></ActionForm>}</div>;
}
