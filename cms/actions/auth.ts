"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const credentials = z.object({ email: z.string().email(), password: z.string().min(8) });
const debug = (...args: unknown[]) => { if (process.env.NODE_ENV === "development") console.info("[cms auth]", ...args); };

export async function login(formData: FormData) {
  const parsed = credentials.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/login?error=Enter+a+valid+email+and+password.");
  if (
    process.env.NODE_ENV === "development" &&
    process.env.CMS_DEMO_MODE === "true" &&
    parsed.data.email === process.env.CMS_DEMO_EMAIL &&
    parsed.data.password === process.env.CMS_DEMO_PASSWORD
  ) {
    const store = await cookies();
    store.set("comsoc-demo-session", "active", { httpOnly: true, sameSite: "lax", path: "/admin" });
    redirect("/dashboard");
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) {
      debug("sign-in rejected", { email: parsed.data.email, message: error.message, status: error.status });
      redirect("/login?error=Invalid+email+or+password.");
    }
    debug("sign-in accepted", { userId: data.user?.id, email: data.user?.email });
    const admin = await prisma.cmsAdmin.findUnique({ where: { userId: data.user?.id ?? "" }, select: { userId: true } });
    debug("admin lookup complete", { userId: data.user?.id, authorized: Boolean(admin) });
    if (!admin) {
      await supabase.auth.signOut();
      debug("sign-out completed for unauthorized account", { userId: data.user?.id });
      redirect("/login?error=This+account+is+not+authorized+for+the+CMS.");
    }
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    console.error("[cms auth] login failed unexpectedly", error);
    redirect("/login?error=CMS+authentication+is+not+configured.");
  }
  redirect("/dashboard");
}

export async function logout() {
  const store = await cookies();
  store.delete("comsoc-demo-session");
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // A local demo session has no Supabase session to clear.
  }
  redirect("/login");
}
