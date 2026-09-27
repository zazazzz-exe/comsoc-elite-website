"use client";

import { CheckCircle2, WifiOff, X, XCircle } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

type Toast = { id: string; message: string; tone: "success" | "error" | "info" };
type ToastContextValue = { toast: (message: string, tone?: Toast["tone"]) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  function toast(message: string, tone: Toast["tone"] = "info") {
    const id = crypto.randomUUID(); setToasts((current) => [...current, { id, message, tone }]);
    if (tone !== "error") window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 4000);
  }
  useEffect(() => { const offline = () => toast("You are offline. Changes cannot be saved until the connection returns.", "error"); const online = () => toast("Connection restored.", "success"); window.addEventListener("offline", offline); window.addEventListener("online", online); return () => { window.removeEventListener("offline", offline); window.removeEventListener("online", online); }; }, []);
  return <ToastContext.Provider value={{ toast }}>{children}<div aria-live="polite" className="fixed right-4 bottom-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">{toasts.map((item) => <div key={item.id} className={`flex items-start gap-3 border p-3 shadow-[0_12px_32px_rgba(0,0,0,.3)] ${item.tone === "error" ? "border-red-300/40 bg-[#251113]" : item.tone === "success" ? "border-emerald-300/40 bg-[#0b211a]" : "border-white/15 bg-[#151518]"}`}>{item.tone === "error" ? <XCircle size={18} className="mt-0.5 shrink-0 text-red-200" /> : item.tone === "success" ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-200" /> : <WifiOff size={18} className="mt-0.5 shrink-0 text-white/60" />}<p className="flex-1 text-sm leading-5 text-white/85">{item.message}</p><button onClick={() => setToasts((current) => current.filter((toast) => toast.id !== item.id))} className="text-white/45 hover:text-white" aria-label="Dismiss notification"><X size={16} /></button></div>)}</div></ToastContext.Provider>;
}

export function useToast() { const value = useContext(ToastContext); if (!value) throw new Error("useToast must be used within ToastProvider."); return value; }
