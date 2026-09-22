import Link from "next/link";
import { PeopleEditor, type PersonRow } from "@/components/content/people-editor";
import { prisma } from "@/lib/prisma";

async function people(): Promise<PersonRow[]> {
  try {
    const rows = await prisma.organizationPerson.findMany({ orderBy: [{ organization: "asc" }, { tier: "asc" }, { name: "asc" }] });
    return rows.map((person) => ({ ...person, organization: person.organization as PersonRow["organization"], personKind: person.personKind as PersonRow["personKind"], status: person.status as PersonRow["status"] }));
  } catch {
    return [];
  }
}

export default async function PeoplePage() {
  const rows = await people();
  return <><Link href="/content" className="text-sm text-emerald-200 hover:text-white">Content</Link><div className="mt-5 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-3xl font-semibold text-white">People</h1><p className="mt-2 text-sm text-white/55">{rows.length} roster records. Search a person to edit their details or portrait.</p></div><span className="border border-white/10 px-3 py-2 text-xs font-medium tracking-[0.12em] text-white/45">ROSTER</span></div><PeopleEditor people={rows} /></>;
}
