"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { GripVertical, LayoutGrid, ListFilter, Pencil, RotateCcw, Search, UserRound, X } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { savePeopleLayout } from "@/actions/people";
import { useToast } from "@/components/feedback/toast-provider";

type Organization = "comsoc" | "ccs_elites";
type PersonKind = "officer" | "adviser";
type Lane = { organization: Organization; personKind: PersonKind; tier: number };

export type PersonRow = { id: string; name: string; role: string; organization: Organization; personKind: PersonKind; tier: number; displayOrder: number; department: string | null; email: string | null; facebookUrl: string | null; imageUrl: string | null; imageAssetId: string | null; status: "draft" | "published" | "archived" };

const sameLane = (person: PersonRow, lane: Lane) => person.organization === lane.organization && person.personKind === lane.personKind && person.tier === lane.tier;
const laneKey = (lane: Lane) => `${lane.organization}-${lane.personKind}-${lane.tier}`;
const sameLayout = (left: PersonRow[], right: PersonRow[]) => left.length === right.length && left.every((person) => {
  const other = right.find((record) => record.id === person.id);
  return other?.organization === person.organization && other.personKind === person.personKind && other.tier === person.tier && other.displayOrder === person.displayOrder && other.status === person.status;
});

function Status({ status }: { status: PersonRow["status"] }) {
  const color = status === "published" ? "bg-emerald-300" : status === "archived" ? "bg-white/30" : "bg-amber-300";
  return <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/55"><span className={`h-1.5 w-1.5 rounded-full ${color}`} />{status}</span>;
}

function PersonCard({ person, selected, onSelect, onDragStart, onDropBefore }: { person: PersonRow; selected: boolean; onSelect: () => void; onDragStart: () => void; onDropBefore?: () => void }) {
  return <article draggable onDragStart={onDragStart} onDragOver={(event) => { if (onDropBefore) event.preventDefault(); }} onDrop={(event) => { if (!onDropBefore) return; event.preventDefault(); event.stopPropagation(); onDropBefore(); }} onClick={onSelect} className={`group relative min-w-0 cursor-grab border active:cursor-grabbing ${selected ? "border-emerald-300/70 bg-emerald-300/[0.08]" : "border-white/10 bg-white/[0.025] hover:border-white/25 hover:bg-white/[0.05]"}`}>
    <span className="absolute top-2 right-2 z-10 rounded-sm bg-black/40 p-1 text-white/45 group-hover:text-emerald-200"><GripVertical size={15} /></span>
    <div className="relative h-24 w-full overflow-hidden bg-white/[0.06]">{person.imageUrl ? <Image src={person.imageUrl} alt="" fill unoptimized className="object-cover" /> : <span className="grid h-full place-items-center text-white/30"><UserRound size={18} /></span>}</div>
    <div className="min-w-0 p-3"><p className="truncate text-sm font-medium text-white">{person.name}</p><p className="mt-1 min-h-8 line-clamp-2 text-xs leading-4 text-white/55">{person.role}</p><div className="mt-2 border-t border-white/10 pt-2"><Status status={person.status} /></div></div>
  </article>;
}

function DropLane({ title, lane, people, selectedId, onSelect, onDrop, onDragStart }: { title: string; lane: Lane; people: PersonRow[]; selectedId: string | null; onSelect: (id: string) => void; onDrop: (beforeId?: string) => void; onDragStart: (id: string) => void }) {
  const rows = people.filter((person) => person.status === "published" && sameLane(person, lane)).sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
  return <section onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); onDrop(); }} className="min-h-28 border border-dashed border-white/15 bg-[#0c0c0e] p-3">
    <div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-medium tracking-[0.14em] text-white/65">{title}</h3><span className="text-xs tabular-nums text-white/35">{rows.length}</span></div>
    <div className="space-y-2">{rows.map((person) => <PersonCard key={person.id} person={person} selected={person.id === selectedId} onSelect={() => onSelect(person.id)} onDragStart={() => onDragStart(person.id)} onDropBefore={() => onDrop(person.id)} />)}</div>
    {!rows.length && <p className="grid min-h-12 place-items-center border border-white/[0.06] text-xs text-white/30">Drop a card here</p>}
  </section>;
}

function OrganizationBoard({ title, organization, people, selectedId, onSelect, onDrop, onDragStart }: { title: string; organization: Organization; people: PersonRow[]; selectedId: string | null; onSelect: (id: string) => void; onDrop: (lane: Lane, beforeId?: string) => void; onDragStart: (id: string) => void }) {
  return <section className="border border-white/10 bg-[#111113]"><header className="flex items-center justify-between border-b border-white/10 px-5 py-4"><h2 className="text-base font-semibold text-white">{title}</h2><span className="hidden text-xs text-white/45 sm:block">Drag cards to set site placement</span></header><div className="space-y-4 p-4"><div className="grid gap-3 md:grid-cols-3">{[0, 1, 2].map((tier) => <DropLane key={tier} title={`ROW ${tier + 1}`} lane={{ organization, personKind: "officer", tier }} people={people} selectedId={selectedId} onSelect={onSelect} onDrop={(beforeId) => onDrop({ organization, personKind: "officer", tier }, beforeId)} onDragStart={onDragStart} />)}</div><DropLane title="ADVISER" lane={{ organization, personKind: "adviser", tier: 0 }} people={people} selectedId={selectedId} onSelect={onSelect} onDrop={(beforeId) => onDrop({ organization, personKind: "adviser", tier: 0 }, beforeId)} onDragStart={onDragStart} /></div></section>;
}

function InactiveTray({ people, selectedId, onSelect, onDragStart, onDrop }: { people: PersonRow[]; selectedId: string | null; onSelect: (id: string) => void; onDragStart: (id: string) => void; onDrop: (status: "draft" | "archived") => void }) {
  return <section className="border border-dashed border-white/20 bg-[#0c0c0e]"><header className="border-b border-white/10 px-5 py-4"><h2 className="text-base font-semibold text-white">Inactive cards</h2><p className="mt-1 text-sm text-white/50">Drag a card into a board lane to publish it. Drag an active card here to remove it from the public site.</p></header><div className="grid gap-4 p-4 md:grid-cols-2">{(["draft", "archived"] as const).map((status) => { const cards = people.filter((person) => person.status === status).sort((a, b) => a.name.localeCompare(b.name)); return <section key={status} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); onDrop(status); }} className="min-h-36 border border-dashed border-white/15 p-3"><div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-medium tracking-[0.14em] text-white/65">{status}</h3><span className="text-xs tabular-nums text-white/35">{cards.length}</span></div><div className="grid gap-3 sm:grid-cols-2">{cards.map((person) => <PersonCard key={person.id} person={person} selected={person.id === selectedId} onSelect={() => onSelect(person.id)} onDragStart={() => onDragStart(person.id)} />)}</div>{!cards.length && <p className="grid min-h-16 place-items-center text-xs text-white/30">Drop a card here</p>}</section>; })}</div></section>;
}

function AdvancedList({ people, onEdit }: { people: PersonRow[]; onEdit: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filtered = people.filter((person) => !deferredQuery || `${person.name} ${person.role} ${person.organization} ${person.personKind}`.toLowerCase().includes(deferredQuery));
  return <section className="border border-white/10 bg-[#111113]"><div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-base font-semibold text-white">All people</h2><p className="mt-1 text-sm text-white/50">Find a record, then open its focused editor.</p></div><label className="relative block sm:w-72"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, role, or team" className="w-full border border-white/10 bg-[#09090b] py-2.5 pr-3 pl-9 text-sm text-white outline-none placeholder:text-white/30 focus:border-emerald-300" /></label></div><div className="overflow-x-auto"><table className="w-full min-w-[44rem] text-left text-sm"><thead className="border-b border-white/10 text-[10px] font-medium tracking-[0.14em] text-white/40"><tr><th className="px-4 py-3">PERSON</th><th className="px-4 py-3">SECTION</th><th className="px-4 py-3">PLACEMENT</th><th className="px-4 py-3">STATUS</th><th className="px-4 py-3" /></tr></thead><tbody>{filtered.map((person) => <tr key={person.id} className="border-b border-white/[0.07] hover:bg-white/[0.03]"><td className="px-4 py-3.5"><span className="flex items-center gap-3"><span className="relative grid h-9 w-8 overflow-hidden bg-white/[0.06] text-white/30">{person.imageUrl ? <Image src={person.imageUrl} alt="" fill unoptimized className="object-cover" /> : <UserRound size={15} className="m-auto" />}</span><span><span className="block font-medium text-white">{person.name}</span><span className="block text-xs text-white/45">{person.role}</span></span></span></td><td className="px-4 py-3.5 text-white/60">{person.organization === "comsoc" ? "COMSOC" : "CCS Elites"} / {person.personKind}</td><td className="px-4 py-3.5 text-white/60">{person.personKind === "adviser" ? "Adviser" : `Row ${person.tier + 1}`}</td><td className="px-4 py-3.5"><Status status={person.status} /></td><td className="px-4 py-3.5 text-right"><button type="button" onClick={() => onEdit(person.id)} className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-[10px] font-medium tracking-[0.12em] text-white/70 hover:border-emerald-300/60 hover:text-emerald-200"><Pencil size={13} />EDIT</button></td></tr>)}</tbody></table></div></section>;
}

export function PeopleEditor({ people }: { people: PersonRow[] }) {
  const router = useRouter();
  const [records, setRecords] = useState(people);
  const [savedRecords, setSavedRecords] = useState(people);
  const [previousRecords, setPreviousRecords] = useState<PersonRow[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(people[0]?.id ?? null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string>();
  const [mode, setMode] = useState<"board" | "advanced">("board");
  const [layoutDirty, setLayoutDirty] = useState(false);
  const [savingLayout, setSavingLayout] = useState(false);
  const { toast } = useToast();
  const selected = records.find((person) => person.id === selectedId);

  function applyBoardChange(next: PersonRow[]) {
    setPreviousRecords(records); setRecords(next); setLayoutDirty(!sameLayout(next, savedRecords)); setSaveError(undefined);
  }

  function placeCard(personId: string, target: Lane, beforeId?: string) {
    const dragged = records.find((person) => person.id === personId);
    if (!dragged) return;
    const source: Lane = { organization: dragged.organization, personKind: dragged.personKind, tier: dragged.tier };
    const moved = { ...dragged, ...target, status: "published" as const };
    const targetRows = records.filter((person) => person.id !== dragged.id && person.status === "published" && sameLane(person, target)).sort((a, b) => a.displayOrder - b.displayOrder);
    const insertAt = beforeId ? Math.max(0, targetRows.findIndex((person) => person.id === beforeId)) : targetRows.length;
    targetRows.splice(insertAt, 0, moved);
    const sourceRows = records.filter((person) => person.id !== dragged.id && person.status === "published" && sameLane(person, source)).sort((a, b) => a.displayOrder - b.displayOrder);
    const normalize = (rows: PersonRow[]) => rows.map((person, displayOrder) => ({ ...person, displayOrder }));
    const untouched = records.filter((person) => person.id !== dragged.id && !(person.status === "published" && sameLane(person, target)) && !(laneKey(source) !== laneKey(target) && person.status === "published" && sameLane(person, source)));
    applyBoardChange(laneKey(source) === laneKey(target) ? [...untouched, ...normalize(targetRows)] : [...untouched, ...normalize(sourceRows), ...normalize(targetRows)]);
    setSelectedId(dragged.id); setDraggingId(null);
  }

  function moveToInactive(personId: string, status: "draft" | "archived") {
    if (!records.some((person) => person.id === personId)) return;
    applyBoardChange(records.map((person) => person.id === personId ? { ...person, status } : person));
    setSelectedId(personId); setDraggingId(null);
  }

  async function saveLayout() {
    if (!navigator.onLine) { toast("You are offline. Board changes have not been saved.", "error"); return; }
    setSavingLayout(true); setSaveError(undefined); toast("Saving board changes…");
    try { await savePeopleLayout(records.map(({ id, organization, personKind, tier, displayOrder, status }) => ({ id, organization, personKind, tier, displayOrder, status }))); setSavedRecords(records); setPreviousRecords(null); setLayoutDirty(false); toast("Board changes saved.", "success"); } catch { setSaveError("Board changes could not be saved. Refresh and try again."); toast("Board changes could not be saved.", "error"); } finally { setSavingLayout(false); }
  }

  function moveSelected(value: string) {
    if (!selected) return;
    if (value === "draft" || value === "archived") { moveToInactive(selected.id, value); return; }
    const [organization, personKind, tier] = value.split(":") as [Organization, PersonKind, string];
    placeCard(selected.id, { organization, personKind, tier: Number(tier) });
  }

  return <div className="mt-8 space-y-8"><div className="flex flex-col justify-between gap-4 border-y border-white/10 py-4 sm:flex-row sm:items-center"><p className="text-sm text-white/55">{mode === "board" ? "Place officers, publish cards, and save the staged layout." : "Search the full roster and open a focused record editor."}</p><div className="inline-flex w-fit border border-white/15 p-1"><button type="button" onClick={() => setMode("board")} className={`flex items-center gap-2 px-3 py-2 text-xs font-medium ${mode === "board" ? "bg-emerald-300 text-[#07110d]" : "text-white/55 hover:text-white"}`}><LayoutGrid size={15} />Board</button><button type="button" onClick={() => setMode("advanced")} className={`flex items-center gap-2 px-3 py-2 text-xs font-medium ${mode === "advanced" ? "bg-emerald-300 text-[#07110d]" : "text-white/55 hover:text-white"}`}><ListFilter size={15} />Advanced</button></div></div>{saveError && <p role="alert" className="border border-red-300/30 bg-red-400/10 p-3 text-sm text-red-100">{saveError}</p>}{mode === "board" ? <><section className="border border-white/10 bg-[#111113] p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium text-white">{selected ? selected.name : "Select a card"}</p><p className="mt-1 text-xs text-white/45">Use this control when drag and drop is inconvenient.</p></div>{selected && <label className="text-xs text-white/55">Move selected card<select value={selected.status === "published" ? `${selected.organization}:${selected.personKind}:${selected.tier}` : selected.status} onChange={(event) => moveSelected(event.target.value)} className="ml-2 border border-white/15 bg-[#09090b] px-3 py-2 text-sm text-white outline-none focus:border-emerald-300"><option value="comsoc:officer:0">COMSOC, Row 1</option><option value="comsoc:officer:1">COMSOC, Row 2</option><option value="comsoc:officer:2">COMSOC, Row 3</option><option value="ccs_elites:officer:0">CCS Elites, Row 1</option><option value="ccs_elites:officer:1">CCS Elites, Row 2</option><option value="ccs_elites:officer:2">CCS Elites, Row 3</option><option value="comsoc:adviser:0">COMSOC, Adviser</option><option value="ccs_elites:adviser:0">CCS Elites, Adviser</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label>}</div></section><div className="grid gap-6 xl:grid-cols-2"><OrganizationBoard title="COMSOC" organization="comsoc" people={records} selectedId={selectedId} onSelect={setSelectedId} onDrop={(lane, beforeId) => { if (draggingId) placeCard(draggingId, lane, beforeId); }} onDragStart={setDraggingId} /><OrganizationBoard title="CCS ELITES" organization="ccs_elites" people={records} selectedId={selectedId} onSelect={setSelectedId} onDrop={(lane, beforeId) => { if (draggingId) placeCard(draggingId, lane, beforeId); }} onDragStart={setDraggingId} /></div><InactiveTray people={records} selectedId={selectedId} onSelect={setSelectedId} onDragStart={setDraggingId} onDrop={(status) => { if (draggingId) moveToInactive(draggingId, status); }} /><div className="flex flex-col gap-3 border border-white/10 bg-[#111113] p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-white/55">{layoutDirty ? "You have unsaved board changes." : "Board layout is saved."}</p><div className="flex flex-wrap gap-2"><button type="button" disabled={!previousRecords || savingLayout} onClick={() => { if (!previousRecords) return; setRecords(previousRecords); setPreviousRecords(null); setLayoutDirty(!sameLayout(previousRecords, savedRecords)); setSaveError(undefined); }} className="inline-flex items-center gap-2 border border-white/15 px-3 py-2.5 text-xs font-medium text-white/70 disabled:cursor-not-allowed disabled:opacity-35 hover:border-white/35 hover:text-white"><RotateCcw size={14} />UNDO LAST</button><button type="button" disabled={!layoutDirty || savingLayout} onClick={() => { setRecords(savedRecords); setPreviousRecords(null); setLayoutDirty(false); setSaveError(undefined); toast("Unsaved board changes discarded."); }} className="inline-flex items-center gap-2 border border-white/15 px-3 py-2.5 text-xs font-medium text-white/70 disabled:cursor-not-allowed disabled:opacity-35 hover:border-white/35 hover:text-white"><X size={14} />DISCARD</button><button type="button" disabled={!layoutDirty || savingLayout} onClick={saveLayout} className="bg-emerald-300 px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-[#07110d] disabled:cursor-not-allowed disabled:opacity-45 hover:bg-emerald-200">{savingLayout ? "SAVING…" : "SAVE BOARD"}</button></div></div></> : <AdvancedList people={records} onEdit={(id) => router.push(`/content/people/${id}`)} />}</div>;
}
