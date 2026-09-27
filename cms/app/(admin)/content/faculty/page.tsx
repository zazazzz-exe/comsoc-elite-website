import Link from "next/link";
import { FacultyManager } from "@/components/content/faculty-manager";
import type { FacultyRow } from "@/components/content/faculty-form";
import { prisma } from "@/lib/prisma";

async function faculty(): Promise<FacultyRow[]> {
  try {
    const rows = await prisma.facultyMember.findMany({ orderBy: [{ displayOrder: "asc" }, { name: "asc" }] });
    return rows.map((member) => ({ ...member, status: member.status as FacultyRow["status"] }));
  } catch {
    return [];
  }
}

export default async function FacultyPage() {
  const rows = await faculty();
  return <><Link href="/content" className="text-xs font-medium tracking-[0.12em] text-emerald-200 hover:text-white">BACK TO CONTENT</Link><h1 className="mt-8 font-display text-4xl font-light tracking-wide text-white">FACULTY</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">Find a profile first, then edit it without losing your place in the directory. Archived profiles remain available for restoration.</p><FacultyManager faculty={rows} /></>;
}
