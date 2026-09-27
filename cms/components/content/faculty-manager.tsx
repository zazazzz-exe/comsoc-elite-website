"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { setFacultyStatus } from "@/actions/people";
import { ActionForm } from "@/components/feedback/action-form";
import type { FacultyRow } from "@/components/content/faculty-form";

function Status({ status }: { status: FacultyRow["status"] }) {
  const color = status === "published" ? "bg-emerald-300" : status === "archived" ? "bg-white/30" : "bg-amber-300";
  return <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/60"><span className={`h-1.5 w-1.5 rounded-full ${color}`} />{status}</span>;
}

export function FacultyManager({ faculty }: { faculty: FacultyRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | FacultyRow["status"]>("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filtered = faculty.filter((member) => (status === "all" || member.status === status) && (!deferredQuery || `${member.name} ${member.department}`.toLowerCase().includes(deferredQuery)));

  return <section className="mt-8 border border-white/10 bg-[#111113]"><div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-base font-semibold text-white">Faculty directory</h2><p className="mt-1 text-sm text-white/50">{faculty.length} profiles. Select one record to edit its details.</p></div><Link href="/content/faculty/new" className="w-fit bg-emerald-300 px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-[#07110d] hover:bg-emerald-200">ADD FACULTY</Link></div><div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row"><label className="relative min-w-0 flex-1"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or department" className="w-full border border-white/10 bg-[#09090b] py-2.5 pr-3 pl-9 text-sm text-white outline-none placeholder:text-white/30 focus:border-emerald-300" /></label><select value={status} onChange={(event) => setStatus(event.target.value as "all" | FacultyRow["status"])} aria-label="Filter faculty by status" className="border border-white/10 bg-[#09090b] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-300"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></div><div className="divide-y divide-white/[0.07]">{filtered.map((member) => <article key={member.id} className="flex flex-col gap-4 p-4 hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><Link href={`/content/faculty/${member.id}`} className="block truncate text-sm font-medium text-white hover:text-emerald-200">{member.name}</Link><p className="mt-1 text-xs text-white/45">{member.department} · Order {member.displayOrder}</p></div><div className="flex flex-wrap items-center gap-4"><Status status={member.status} /><Link href={`/content/faculty/${member.id}`} className="text-xs font-medium text-emerald-200 underline underline-offset-4">EDIT</Link><ActionForm action={setFacultyStatus} pendingMessage={member.status === "archived" ? "Restoring faculty profile..." : "Archiving faculty profile..."} successMessage={member.status === "archived" ? "Faculty profile restored to draft." : "Faculty profile archived."}><input type="hidden" name="id" value={member.id} /><input type="hidden" name="status" value={member.status === "archived" ? "draft" : "archived"} /><button className="text-xs text-white/55 underline underline-offset-4 hover:text-white">{member.status === "archived" ? "RESTORE" : "ARCHIVE"}</button></ActionForm></div></article>)}{!filtered.length && <p className="p-8 text-center text-sm text-white/45">No faculty profiles match these filters.</p>}</div></section>;
}
