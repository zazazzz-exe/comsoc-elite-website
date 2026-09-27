import { notFound } from "next/navigation";
import Link from "next/link";
import { PersonForm } from "@/components/content/person-form";
import type { PersonRow } from "@/components/content/people-editor";
import { prisma } from "@/lib/prisma";

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await prisma.organizationPerson.findUnique({ where: { id } });
  if (!person) notFound();
  const row: PersonRow = { ...person, organization: person.organization as PersonRow["organization"], personKind: person.personKind as PersonRow["personKind"], status: person.status as PersonRow["status"] };
  return <><Link href="/content/people" className="text-sm text-emerald-200 hover:text-white">People</Link><PersonForm person={row} /></>;
}
