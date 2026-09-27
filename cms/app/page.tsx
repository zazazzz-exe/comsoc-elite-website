import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth/admin";

export default async function Home() {
  redirect((await getAdmin()) ? "/dashboard" : "/login");
}
