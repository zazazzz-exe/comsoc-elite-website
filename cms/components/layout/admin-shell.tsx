import Link from "next/link";
import { CalendarDays, Image, LayoutDashboard, Plus, Settings, Users } from "lucide-react";
import { logout } from "@/actions/auth";
import { ToastProvider } from "@/components/feedback/toast-provider";

const links = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Content", "/content", Users],
  ["Media", "/media", Image],
  ["Settings", "/settings", Settings],
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  return <ToastProvider><div className="min-h-[100dvh] bg-[#09090b] md:grid md:grid-cols-[17rem_1fr]">
    <aside className="border-b border-white/10 bg-[#0c0c0e] px-5 py-6 text-white md:border-r md:border-b-0 md:px-6 md:py-8">
      <Link href="/dashboard" className="mb-10 flex items-center gap-3 font-display text-sm font-medium tracking-[0.22em]"><span className="grid h-8 w-8 place-items-center border border-emerald-300/50 text-emerald-300"><CalendarDays size={17} strokeWidth={1.5} /></span> COMSOC</Link>
      <p className="mb-3 text-[10px] font-medium tracking-[0.24em] text-white/35">CONTROL ROOM</p>
       <nav className="flex gap-1 overflow-x-auto md:flex-col">{links.map(([label, href, Icon], index) => <Link key={href} href={href} className="group flex shrink-0 items-center gap-3 border border-transparent px-3 py-2.5 text-sm text-white/55 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"><span className="font-mono text-[10px] text-white/25 group-hover:text-emerald-300">0{index + 1}</span><Icon size={16} strokeWidth={1.5} />{label}</Link>)}</nav>
       <details className="group mt-6 border border-emerald-300/35 bg-emerald-300/[0.04]" open><summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-xs font-medium tracking-[0.12em] text-emerald-100 marker:hidden hover:bg-emerald-300/[0.08]"><span className="flex items-center gap-2"><Plus size={15} strokeWidth={1.5} />QUICK CREATE</span><span aria-hidden="true" className="text-emerald-300 group-open:rotate-45">+</span></summary><div className="border-t border-emerald-300/20 p-2"><Link href="/content/people/new" className="block px-2 py-2 text-sm text-white/70 hover:bg-white/[0.04] hover:text-white">Add person</Link><Link href="/content/people/bulk" className="block px-2 py-2 text-sm text-white/70 hover:bg-white/[0.04] hover:text-white">Bulk people</Link><Link href="/content/faculty/new" className="block px-2 py-2 text-sm text-white/70 hover:bg-white/[0.04] hover:text-white">Add faculty</Link><Link href="/content/events/new" className="block px-2 py-2 text-sm text-white/70 hover:bg-white/[0.04] hover:text-white">Add event</Link><Link href="/media" className="block px-2 py-2 text-sm text-white/70 hover:bg-white/[0.04] hover:text-white">Upload media</Link></div></details>
       <form action={logout} className="mt-10 border-t border-white/10 pt-5"><button className="text-xs font-medium tracking-[0.15em] text-white/45 hover:text-white">SIGN OUT</button></form>
    </aside>
    <main className="min-w-0 p-5 md:p-10 lg:p-14"><div className="mx-auto max-w-6xl">{children}</div></main>
  </div></ToastProvider>;
}
