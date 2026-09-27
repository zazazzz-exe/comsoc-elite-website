"use client";

import { useTransition } from "react";
import { useToast } from "@/components/feedback/toast-provider";

export function ActionForm({ action, pendingMessage, successMessage, children, className }: { action: (formData: FormData) => Promise<void>; pendingMessage: string; successMessage: string; children: React.ReactNode; className?: string }) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  return <form className={className} onSubmit={(event) => { event.preventDefault(); if (!navigator.onLine) { toast("You are offline. Your changes have not been saved.", "error"); return; } const form = event.currentTarget; toast(pendingMessage); startTransition(async () => { try { await action(new FormData(form)); toast(successMessage, "success"); } catch (error) { toast(error instanceof Error ? error.message : "The change could not be saved.", "error"); } }); }}>{children}{pending && <span className="text-xs text-emerald-200">Saving…</span>}</form>;
}
