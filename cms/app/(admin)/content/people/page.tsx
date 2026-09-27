import Link from "next/link";
import { PeopleEditor, type PersonRow } from "@/components/content/people-editor";
import { prisma } from "@/lib/prisma";

async function people(): Promise<PersonRow[]> {
  try {
    const rows = await prisma.organizationPerson.findMany({ orderBy: [{ organization: "asc" }, { personKind: "asc" }, { tier: "asc" }, { displayOrder: "asc" }, { name: "asc" }] });
    return rows.map((person) => ({ ...person, organization: person.organization as PersonRow["organization"], personKind: person.personKind as PersonRow["personKind"], status: person.status as PersonRow["status"] }));
  } catch {
    return [];
  }
}

export default async function PeoplePage() {
  const rows = await people();
  return <><Link href="/content" className="text-sm text-emerald-200 hover:text-white">Content</Link><div className="mt-5"><h1 className="text-3xl font-semibold text-white">People</h1><p className="mt-2 text-sm text-white/55">{rows.length} roster records. Choose the task you need, then return here to manage site placement.</p></div><nav aria-label="People tasks" className="mt-7 grid border border-white/10 bg-[#111113] sm:grid-cols-3"><Link href="/content/people/new" className="border-b border-white/10 p-5 hover:bg-white/[0.04] sm:border-r sm:border-b-0"><span className="block text-sm font-semibold text-white">Add one officer</span><span className="mt-2 block text-sm leading-5 text-white/50">Create one profile with a portrait and publish status.</span></Link><Link href="/content/people/bulk" className="border-b border-white/10 p-5 hover:bg-white/[0.04] sm:border-r sm:border-b-0"><span className="block text-sm font-semibold text-white">Bulk add officers</span><span className="mt-2 block text-sm leading-5 text-white/50">Upload portraits and create a full group together.</span></Link><a href="#roster" className="p-5 hover:bg-white/[0.04]"><span className="block text-sm font-semibold text-white">Manage roster</span><span className="mt-2 block text-sm leading-5 text-white/50">Arrange cards, set status, and edit existing profiles.</span></a></nav><div id="roster"><PeopleEditor people={rows} /></div></>;
}
