import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const demoEnabled = () => process.env.NODE_ENV === "development" && process.env.CMS_DEMO_MODE === "true";
const debug = (...args: unknown[]) => { if (process.env.NODE_ENV === "development") console.info("[cms auth]", ...args); };

export async function getAdmin() {
  const store = await cookies();
  if (demoEnabled() && store.get("comsoc-demo-session")?.value === "active") {
    return { id: "local-demo-admin", email: process.env.CMS_DEMO_EMAIL };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      debug("protected request has no authenticated user");
      return null;
    }
    // Auth verifies the session; the server-only database client checks membership.
    const admin = await prisma.cmsAdmin.findUnique({ where: { userId: user.id }, select: { userId: true } });
    debug("protected-request admin lookup complete", { userId: user.id, authorized: Boolean(admin) });
    return admin ? user : null;
  } catch (error) {
    console.error("[cms auth] protected-request authorization failed", error);
    return null;
  }
}

export async function requireAdmin() {
  const user = await getAdmin();
  if (!user) redirect("/login");
  return user;
}
