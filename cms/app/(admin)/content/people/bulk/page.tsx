import Link from "next/link";
import { BulkOfficerImport } from "@/components/content/bulk-officer-import";

export default function BulkPeoplePage() {
  return <><Link href="/content/people" className="text-sm text-emerald-200 hover:text-white">People</Link><div className="mt-5 max-w-4xl"><h1 className="text-3xl font-semibold text-white">Bulk add officers</h1><p className="mt-2 text-sm leading-6 text-white/55">Upload every portrait first, complete the matching officer cards, then create the full roster at once.</p></div><BulkOfficerImport /> </>;
}
