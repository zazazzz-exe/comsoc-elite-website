"use client";

import Image from "next/image";
import { Plus, Search, UserRound } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { savePerson } from "@/actions/people";
import { CloudinaryAssetField } from "@/components/content/cloudinary-asset-field";

const input = "mt-1.5 w-full border border-white/15 bg-[#09090b] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-emerald-300";

export type PersonRow = { id: string; name: string; role: string; organization: "comsoc" | "ccs_elites"; personKind: "officer" | "adviser"; tier: number; department: string | null; email: string | null; facebookUrl: string | null; imageUrl: string | null; imageAssetId: string | null; status: "draft" | "published" | "archived" };

function Status({ status }: { status: PersonRow["status"] }) {
  const color = status === "published" ? "bg-emerald-300" : status === "archived" ? "bg-white/30" : "bg-amber-300";
  return <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/45"><span className={`h-1.5 w-1.5 rounded-full ${color}`} />{status}</span>;
}

function PersonForm({ person, onNew }: { person?: PersonRow; onNew: () => void }) {
  const image = person?.imageUrl ? [{ id: person.imageAssetId ?? undefined, url: person.imageUrl }] : [];
  return <form action={savePerson} className="space-y-7">
    {person && <input type="hidden" name="id" value={person.id} />}
    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
      <div><p className="text-xs font-medium tracking-[0.16em] text-emerald-300">{person ? "EDIT RECORD" : "NEW RECORD"}</p><h2 className="mt-2 text-xl font-medium text-white">{person?.name ?? "Add a person"}</h2></div>
      {person && <button type="button" onClick={onNew} className="border border-white/15 px-3 py-2 text-xs font-medium text-white/65 hover:border-emerald-300/60 hover:text-emerald-200">New record</button>}
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <label className="text-xs font-medium tracking-[0.12em] text-white/65">FULL NAME<input required name="name" defaultValue={person?.name} className={input} /></label>
      <label className="text-xs font-medium tracking-[0.12em] text-white/65">ROLE<input required name="role" defaultValue={person?.role} placeholder="President" className={input} /></label>
      <label className="text-xs font-medium tracking-[0.12em] text-white/65">ORGANIZATION<select name="organization" defaultValue={person?.organization ?? "comsoc"} className={input}><option value="comsoc">COMSOC</option><option value="ccs_elites">CCS Elites</option></select></label>
      <label className="text-xs font-medium tracking-[0.12em] text-white/65">RECORD TYPE<select name="personKind" defaultValue={person?.personKind ?? "officer"} className={input}><option value="officer">Officer</option><option value="adviser">Adviser</option></select></label>
      <label className="text-xs font-medium tracking-[0.12em] text-white/65">PYRAMID TIER<input name="tier" type="number" min="0" max="9" defaultValue={person?.tier ?? 0} className={input} /></label>
      <label className="text-xs font-medium tracking-[0.12em] text-white/65">VISIBILITY<select name="status" defaultValue={person?.status ?? "draft"} className={input}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
      <label className="text-xs font-medium tracking-[0.12em] text-white/65">DEPARTMENT<input name="department" defaultValue={person?.department ?? ""} className={input} /></label>
      <label className="text-xs font-medium tracking-[0.12em] text-white/65">EMAIL<input name="email" type="email" defaultValue={person?.email ?? ""} className={input} /></label>
      <label className="text-xs font-medium tracking-[0.12em] text-white/65 md:col-span-2">FACEBOOK URL <span className="font-normal normal-case tracking-normal text-white/35">optional</span><input name="facebookUrl" type="url" defaultValue={person?.facebookUrl ?? ""} placeholder="https://facebook.com/..." className={input} /></label>
      <div className="md:col-span-2"><CloudinaryAssetField name="imageUrl" initialAssets={image} label="PORTRAIT" /></div>
    </div>
    <div className="flex items-center justify-between border-t border-white/10 pt-5"><p className="text-xs text-white/40">{person ? "Changes publish when you save." : "Create as a draft, then publish when ready."}</p><button className="bg-emerald-300 px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-[#07110d] hover:bg-emerald-200">{person ? "SAVE CHANGES" : "CREATE PERSON"}</button></div>
  </form>;
}

export function PeopleEditor({ people }: { people: PersonRow[] }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(people[0]?.id ?? null);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filtered = people.filter((person) => !deferredQuery || `${person.name} ${person.role} ${person.organization}`.toLowerCase().includes(deferredQuery));
  const selected = people.find((person) => person.id === selectedId);

  return <div className="mt-8 grid overflow-hidden border border-white/10 bg-[#111113] lg:grid-cols-[20rem_minmax(0,1fr)]">
    <aside className="border-b border-white/10 bg-[#0c0c0e] lg:border-r lg:border-b-0">
      <div className="border-b border-white/10 p-4"><div className="relative"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people" className="w-full border border-white/10 bg-white/[0.03] py-2.5 pr-3 pl-9 text-sm text-white outline-none placeholder:text-white/30 focus:border-emerald-300" /></div></div>
      <div className="max-h-[26rem] overflow-y-auto lg:max-h-[calc(100dvh-18rem)]">
        <button type="button" onClick={() => setSelectedId(null)} className={`flex w-full items-center gap-3 border-b border-white/10 px-4 py-3.5 text-left ${selectedId === null ? "bg-emerald-300/[0.08]" : "hover:bg-white/[0.03]"}`}><span className="grid h-8 w-8 place-items-center border border-emerald-300/40 text-emerald-300"><Plus size={16} /></span><span><span className="block text-sm font-medium text-white">New person</span><span className="block text-xs text-white/40">Create a roster record</span></span></button>
        {filtered.length ? filtered.map((person) => <button key={person.id} type="button" onClick={() => setSelectedId(person.id)} className={`flex w-full items-center gap-3 border-b border-white/10 px-4 py-3.5 text-left ${selectedId === person.id ? "bg-white/[0.07]" : "hover:bg-white/[0.03]"}`}><span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden bg-white/[0.06] text-white/40">{person.imageUrl ? <Image src={person.imageUrl} alt="" fill unoptimized className="object-cover" /> : <UserRound size={16} />}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-white">{person.name}</span><span className="block truncate text-xs text-white/40">{person.role}</span></span><Status status={person.status} /></button>) : <p className="p-5 text-sm text-white/45">No people match this search.</p>}
      </div>
    </aside>
    <section className="min-w-0 p-5 md:p-7"><PersonForm key={selected?.id ?? "new"} person={selected} onNew={() => setSelectedId(null)} /></section>
  </div>;
}
