/** Refresh the separately deployed public site without making content writes depend on its availability. */
export async function refreshPublicWebsite() {
  const origin = process.env.WEBSITE_ORIGIN;
  const secret = process.env.REVALIDATE_SECRET;
  if (!origin || !secret) return;

  try {
    const response = await fetch(`${origin.replace(/\/$/, "")}/api/revalidate`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-revalidate-secret": secret },
      body: JSON.stringify({ paths: ["/"] }),
      cache: "no-store",
    });
    if (!response.ok) console.error("[cms revalidation] website rejected refresh", response.status);
  } catch (error) {
    console.error("[cms revalidation] website refresh failed", error);
  }
}
