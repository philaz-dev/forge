"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

type Tone = "success" | "info";
interface ToastItem {
  id: number;
  title: string;
  description?: string;
  tone: Tone;
  action?: { label: string; onClick: () => void };
}

const ToastCtx = createContext<{
  toast: (t: Omit<ToastItem, "id" | "tone"> & { tone?: Tone }) => void;
} | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback(
    (id: number) => setItems((l) => l.filter((t) => t.id !== id)),
    [],
  );

  const toast = useCallback<
    NonNullable<React.ContextType<typeof ToastCtx>>["toast"]
  >(
    (t) => {
      const id = Date.now() + Math.random();
      setItems((l) => [...l.slice(-2), { tone: "success", ...t, id }]);
      window.setTimeout(() => dismiss(id), t.action ? 6500 : 4200);
    },
    [dismiss],
  );

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2 px-4 md:bottom-6 md:items-end md:px-6"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex w-full max-w-sm animate-scale-in items-start gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-pop",
            )}
          >
            <span
              className={cn(
                "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full",
                t.tone === "success"
                  ? "bg-sage-100 text-sage-700"
                  : "bg-sky-100 text-sky-600",
              )}
            >
              {t.tone === "success" ? (
                <CheckCircle2 size={15} />
              ) : (
                <Info size={15} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-[13px] text-ink-muted">
                  {t.description}
                </p>
              )}
              {t.action && (
                <button
                  onClick={() => {
                    t.action?.onClick();
                    dismiss(t.id);
                  }}
                  className="mt-1.5 text-[13px] font-medium text-sage-700 hover:underline"
                >
                  {t.action.label}
                </button>
              )}
            </div>
            <button
              aria-label="Fermer"
              onClick={() => dismiss(t.id)}
              className="rounded-md p-1 text-ink-faint hover:bg-canvas hover:text-ink"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast doit être utilisé dans <ToastProvider>");
  return ctx.toast;
}
