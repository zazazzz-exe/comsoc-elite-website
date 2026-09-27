import { notFound } from "next/navigation";
import { FacultyForm, type FacultyRow } from "@/components/content/faculty-form";
import { prisma } from "@/lib/prisma";

export default async function EditFacultyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await prisma.facultyMember.findUnique({ where: { id } });
  if (!member) notFound();
  const row: FacultyRow = { ...member, status: member.status as FacultyRow["status"] };
  return <FacultyForm member={row} />;
}
