import Image from "next/image";
import Link from "next/link";
import { deleteMediaAsset } from "@/actions/media";
import { ActionForm } from "@/components/feedback/action-form";
import { MediaUpload } from "@/components/media-upload";
import { prisma } from "@/lib/prisma";

type Search = Promise<{ q?: string; usage?: string; type?: string }>;

function usageLinks(asset: { facultyImages: { id: string; name: string }[]; personImages: { id: string; name: string }[]; eventCoverImages: { id: string; title: string }[]; eventMediaAssets: { event: { id: string; title: string } }[] }) {
  return [
    ...asset.personImages.map((item) => ({ label: `Person: ${item.name}`, href: `/content/people/${item.id}` })),
    ...asset.facultyImages.map((item) => ({ label: `Faculty: ${item.name}`, href: `/content/faculty/${item.id}` })),
    ...asset.eventCoverImages.map((item) => ({ label: `Event cover: ${item.title}`, href: `/content/events/${item.id}` })),
    ...asset.eventMediaAssets.map((item) => ({ label: `Event gallery: ${item.event.title}`, href: `/content/events/${item.event.id}` })),
  ];
}

export default async function Media({ searchParams }: { searchParams: Search }) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const usage = params.usage === "used" || params.usage === "unused" ? params.usage : "all";
  const resourceType = ["image", "video", "raw"].includes(params.type ?? "") ? params.type! : "all";
  const assets = await (async () => {
    try {
      return await prisma.mediaAsset.findMany({
        where: { ...(resourceType === "all" ? {} : { resourceType }), ...(query ? { OR: [{ publicId: { contains: query, mode: "insensitive" } }, { altText: { contains: query, mode: "insensitive" } }] } : {}) },
        include: { facultyImages: { select: { id: true, name: true } }, personImages: { select: { id: true, name: true } }, eventCoverImages: { select: { id: true, title: true } }, eventMediaAssets: { select: { event: { select: { id: true, title: true } } } } },
        orderBy: { createdAt: "desc" }, take: 100,
      });
    } catch { return []; }
  })();
  const filteredAssets = assets.filter((asset) => {
    const used = asset.facultyImages.length + asset.personImages.length + asset.eventCoverImages.length + asset.eventMediaAssets.length > 0;
    return usage === "all" || (usage === "used" ? used : !used);
  });

  return <>
    <h1 className="font-display text-4xl font-light tracking-wide text-white">MEDIA LIBRARY</h1>
    <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">Search by filename or alt text, see where each asset is used, and review unused uploads before deleting them.</p>
    <section className="mt-8 max-w-2xl border border-dashed border-white/25 bg-[#111113] p-6"><h2 className="font-display text-xl font-light tracking-wide text-white">Upload media</h2><p className="mt-3 text-sm leading-6 text-white/55">Files are verified before their delivery metadata is recorded. Assets linked to content cannot be deleted.</p><MediaUpload /></section>
    <section aria-labelledby="browse-assets-heading" className="mt-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 id="browse-assets-heading" className="font-display text-2xl font-light text-white">Browse assets</h2><p className="mt-2 text-sm text-white/50">{filteredAssets.length} of up to 100 newest assets shown.</p></div><form className="grid gap-3 sm:grid-cols-[minmax(15rem,1fr)_auto]"><label className="text-xs font-medium tracking-[0.1em] text-white/60">SEARCH<input name="q" defaultValue={query} placeholder="Public ID or alt text" className="mt-2 block w-full border border-white/15 bg-[#09090b] px-3 py-2.5 text-sm normal-case tracking-normal text-white" /></label><div className="grid grid-cols-2 gap-3"><label className="text-xs font-medium tracking-[0.1em] text-white/60">USAGE<select name="usage" defaultValue={usage} className="mt-2 block w-full border border-white/15 bg-[#09090b] px-3 py-2.5 text-sm normal-case tracking-normal text-white"><option value="all">All</option><option value="used">Used</option><option value="unused">Unused</option></select></label><label className="text-xs font-medium tracking-[0.1em] text-white/60">TYPE<select name="type" defaultValue={resourceType} className="mt-2 block w-full border border-white/15 bg-[#09090b] px-3 py-2.5 text-sm normal-case tracking-normal text-white"><option value="all">All</option><option value="image">Image</option><option value="video">Video</option><option value="raw">File</option></select></label></div><button className="border border-emerald-300/60 px-4 py-2.5 text-xs font-medium tracking-[0.12em] text-emerald-100 hover:bg-emerald-300 hover:text-[#09090b] sm:self-end">APPLY</button></form></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filteredAssets.map((asset) => { const links = usageLinks(asset); const used = links.length > 0; return <article key={asset.id} className="border border-white/10 bg-[#111113] p-3"><div className="relative aspect-[16/10] overflow-hidden bg-white/[0.04]">{asset.resourceType === "image" ? <Image src={asset.url} alt={asset.altText ?? asset.publicId} fill unoptimized className="object-cover" /> : <p className="grid h-full place-items-center text-xs text-white/40">{asset.format?.toUpperCase() ?? asset.resourceType}</p>}</div><div className="mt-3 flex items-start justify-between gap-3"><p className="min-w-0 truncate text-sm text-white" title={asset.publicId}>{asset.publicId}</p><span className={`shrink-0 border px-2 py-1 text-[10px] font-medium tracking-[0.1em] ${used ? "border-emerald-300/35 text-emerald-200" : "border-white/15 text-white/50"}`}>{used ? `USED ${links.length}` : "UNUSED"}</span></div><p className="mt-1 text-xs text-white/45">{asset.format?.toUpperCase() ?? asset.resourceType}{asset.bytes ? ` · ${(asset.bytes / 1024 / 1024).toFixed(1)} MB` : ""}</p>{used ? <div className="mt-4 border-t border-white/10 pt-3"><p className="text-[10px] font-medium tracking-[0.12em] text-white/45">USED IN</p><div className="mt-2 flex flex-wrap gap-x-3 gap-y-2">{links.map((link, index) => <Link key={`${link.href}-${index}`} href={link.href} className="max-w-full truncate text-xs text-emerald-200 hover:text-white">{link.label}</Link>)}</div></div> : <ActionForm action={deleteMediaAsset} pendingMessage="Deleting unused media..." successMessage="Unused media deleted." className="mt-4 border-t border-white/10 pt-3"><input type="hidden" name="id" value={asset.id} /><button className="text-xs font-medium tracking-[0.1em] text-red-300 hover:text-red-200">DELETE UNUSED ASSET</button></ActionForm>}</article>; })}</div>
      {!filteredAssets.length && <p className="mt-8 border border-dashed border-white/15 p-8 text-center text-sm text-white/50">No assets match these filters. Try another search, type, or usage state.</p>}</section>
  </>;
}
