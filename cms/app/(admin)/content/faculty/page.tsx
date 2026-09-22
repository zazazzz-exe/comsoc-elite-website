import Link from "next/link";
import { saveFaculty } from "@/actions/people";
import { CloudinaryAssetField } from "@/components/content/cloudinary-asset-field";
import { prisma } from "@/lib/prisma";

const input = "mt-2 w-full border border-white/15 bg-[#09090b] px-3 py-2.5 text-sm text-white focus:border-emerald-300";

type FacultyRow = { id: string; name: string; department: string; imageUrl: string | null; imageAssetId: string | null; displayOrder: number; status: "draft" | "published" | "archived" };

async function faculty(): Promise<FacultyRow[]> {
  try {
    const rows = await prisma.facultyMember.findMany({ orderBy: [{ displayOrder: "asc" }, { name: "asc" }] });
    return rows.map((member) => ({ ...member, status: member.status as FacultyRow["status"] }));
  } catch {
    return [];
  }
}

function FacultyForm({ member }: { member?: FacultyRow }) {
  const image = member?.imageUrl ? [{ id: member.imageAssetId ?? undefined, url: member.imageUrl }] : [];
  return <form action={saveFaculty} className="grid max-w-4xl gap-5 border border-white/10 bg-[#111113] p-5 md:grid-cols-2 md:p-7">
    {member && <input type="hidden" name="id" value={member.id} />}
    <label className="text-xs font-medium tracking-[0.12em] text-white/70">FULL NAME<input required name="name" defaultValue={member?.name} className={input} /></label>
    <label className="text-xs font-medium tracking-[0.12em] text-white/70">DEPARTMENT<input required name="department" defaultValue={member?.department ?? "College of Computer Studies"} className={input} /></label>
    <label className="text-xs font-medium tracking-[0.12em] text-white/70">DISPLAY ORDER<input name="displayOrder" type="number" min="0" defaultValue={member?.displayOrder ?? 0} className={input} /></label>
    <label className="text-xs font-medium tracking-[0.12em] text-white/70">STATUS<select name="status" defaultValue={member?.status ?? "draft"} className={input}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
    <div className="md:col-span-2"><CloudinaryAssetField name="imageUrl" initialAssets={image} label="PORTRAIT" /></div>
    <button className="w-fit border border-emerald-300/60 px-4 py-2.5 text-xs font-medium tracking-[0.14em] text-emerald-200 hover:bg-emerald-300 hover:text-[#09090b]">{member ? "SAVE PROFESSOR" : "CREATE PROFESSOR"}</button>
  </form>;
}

export default async function FacultyEditor() {
  const rows = await faculty();
  return <><Link href="/content" className="text-xs font-medium tracking-[0.12em] text-emerald-200 hover:text-white">BACK TO CONTENT</Link><p className="mt-8 font-mono text-[11px] tracking-[0.2em] text-emerald-300">FACULTY / DIRECTORY</p><h1 className="mt-3 font-display text-4xl font-light tracking-wide text-white">FACULTY</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">Faculty profiles appear in the public directory only after they are published.</p><h2 className="mt-10 font-display text-xl text-white">ADD A PROFESSOR</h2><div className="mt-4"><FacultyForm /></div><h2 className="mt-12 font-display text-xl text-white">EDIT FACULTY</h2><div className="mt-4 space-y-6">{rows.map((member) => <section key={member.id}><h3 className="mb-3 text-sm font-medium text-white">{member.name}</h3><FacultyForm member={member} /></section>)}</div></>;
}
