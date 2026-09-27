import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function validSecret(value: string | null) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !value) return false;
  const expected = Buffer.from(secret);
  const received = Buffer.from(value);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function POST(request: Request) {
  if (!validSecret(request.headers.get("x-revalidate-secret"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const paths = Array.isArray(body.paths) ? body.paths.filter((path: unknown): path is string => typeof path === "string" && path.startsWith("/") && path.length <= 200) : ["/"];
  for (const path of paths.length ? paths : ["/"]) revalidatePath(path);
  return NextResponse.json({ revalidated: paths.length ? paths : ["/"] });
}
