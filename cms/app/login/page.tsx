import { login } from "@/actions/auth";

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="relative grid min-h-[100dvh] place-items-center overflow-hidden bg-[#09090b] p-5"><div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-emerald-300/50" /><form action={login} className="w-full max-w-sm border border-white/15 bg-[#111113] p-7 shadow-[0_24px_80px_rgba(0,0,0,.35)]">
    <p className="font-mono text-[11px] tracking-[0.22em] text-emerald-300">COMSOC / CONTROL ROOM</p><h1 className="mt-4 font-display text-4xl font-light tracking-wide text-white">SIGN IN</h1>
    <p className="mt-3 text-sm leading-6 text-white/55">Access is limited to explicitly authorized administrators.</p>
    {error && <p role="alert" className="mt-5 border border-red-300/30 bg-red-400/10 p-3 text-sm text-red-100">{error}</p>}
    <label className="mt-7 block text-xs font-medium tracking-[0.12em] text-white/70">EMAIL<input required name="email" type="email" className="mt-2 w-full border border-white/15 bg-[#09090b] p-3 text-sm text-white placeholder:text-white/30 focus:border-emerald-300" /></label>
    <label className="mt-5 block text-xs font-medium tracking-[0.12em] text-white/70">PASSWORD<input required name="password" type="password" minLength={8} className="mt-2 w-full border border-white/15 bg-[#09090b] p-3 text-sm text-white placeholder:text-white/30 focus:border-emerald-300" /></label>
    <button className="mt-7 w-full border border-emerald-300/60 bg-emerald-300 p-3 text-xs font-semibold tracking-[0.16em] text-[#09090b] hover:bg-transparent hover:text-emerald-200">AUTHENTICATE</button>
  </form></main>;
}
