import Link from "next/link";
import { PersonForm } from "@/components/content/person-form";

export default function NewPersonPage() {
  return <><Link href="/content/people" className="text-sm text-emerald-200 hover:text-white">People</Link><PersonForm /></>;
}
