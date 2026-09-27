import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function overview() {
  try {
    const [people, faculty, events, media, drafts, published] = await Promise.all([
      prisma.organizationPerson.count(), prisma.facultyMember.count(), prisma.event.count(), prisma.mediaAsset.count(),
      Promise.all([prisma.organizationPerson.count({ where: { status: "draft" } }), prisma.facultyMember.count({ where: { status: "draft" } }), prisma.event.count({ where: { status: "draft" } })]),
      Promise.all([prisma.organizationPerson.count({ where: { status: "published" } }), prisma.facultyMember.count({ where: { status: "published" } }), prisma.event.count({ where: { status: "published" } })]),
    ]);
    return { people, faculty, events, media, drafts: drafts.reduce((sum, count) => sum + count, 0), published: published.reduce((sum, count) => sum + count, 0), connected: true };
  } catch { return { people: null, faculty: null, events: null, media: null, drafts: null, published: null, connected: false }; }
}

export default async function Dashboard() {
  const status = await overview();
  return <><p className="font-mono text-[11px] tracking-[0.2em] text-emerald-300">SYSTEM / OVERVIEW</p><h1 className="mt-3 font-display text-4xl font-light tracking-[0.04em] text-white md:text-5xl">CONTENT INDEX</h1><p className="mt-4 max-w-xl text-sm leading-6 text-white/55">Published records are counted from the connected Supabase project. Drafts remain private to this workspace.</p>
    <div className="mt-10 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-4">{[["Organization people", status.people], ["Faculty members", status.faculty], ["Events", status.events], ["Media assets", status.media]].map(([label, value], index) => <div key={String(label)} className="bg-[#111113] p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-white/40">0{index + 1} / {label}</p><p className="mt-6 font-display text-4xl font-light tabular-nums text-white">{value === null ? "--" : value}</p></div>)}</div>
    <div className="mt-8 grid gap-4 md:grid-cols-2"><section className="border border-white/10 bg-[#111113] p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-emerald-200">CONTENT HEALTH</p><p className="mt-4 text-2xl text-white">{status.drafts ?? "--"} drafts / {status.published ?? "--"} live</p><p className="mt-2 text-sm text-white/50">Draft records are private. Archived records remain recoverable in their editors.</p></section><section className="border border-white/10 bg-[#111113] p-5"><p className="font-mono text-[10px] tracking-[0.14em] text-emerald-200">SYSTEM CONNECTION</p><p className={`mt-4 text-2xl ${status.connected ? "text-emerald-200" : "text-red-300"}`}>{status.connected ? "DATABASE ONLINE" : "DATABASE UNAVAILABLE"}</p><p className="mt-2 text-sm text-white/50">Public-site refresh is configured when both deployment origin and shared secret are present.</p></section></div>
    <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6"><div><h2 className="font-display text-2xl font-light tracking-wide text-white">Quick actions</h2><p className="mt-2 text-sm text-white/50">Create a record, review drafts, or clean unused media.</p></div><div className="flex flex-wrap gap-3"><Link href="/content/people" className="border border-white/15 px-4 py-2.5 text-xs font-medium tracking-[0.12em] text-white hover:border-emerald-300">ADD PEOPLE</Link><Link href="/content/events" className="border border-white/15 px-4 py-2.5 text-xs font-medium tracking-[0.12em] text-white hover:border-emerald-300">ADD EVENT</Link><Link href="/media" className="border border-emerald-300/60 px-4 py-2.5 text-xs font-medium tracking-[0.14em] text-emerald-200 hover:bg-emerald-300 hover:text-[#09090b]">OPEN MEDIA</Link></div></div>
  </>;
}
