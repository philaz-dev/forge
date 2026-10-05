"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CalendarClock, MessageCircleQuestion } from "lucide-react";
import { useDemo } from "@/store/demo-store";
import { cn } from "@/lib/cn";

const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

/** Reçoit en direct les actions faites dans l'espace propriétaire (démo). */
export function NotificationBell() {
  const { state, readAll } = useDemo();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = state.notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        aria-label={`Notifications${unread ? ` (${unread} non lues)` : ""}`}
        onClick={() => setOpen((o) => !o)}
        className="relative grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink-soft shadow-soft transition hover:bg-canvas"
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-sage-700 px-1 text-[10px] font-semibold text-white ring-2 ring-canvas">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-[360px] max-w-[calc(100vw-2rem)] animate-scale-in overflow-hidden rounded-2xl border border-line bg-white shadow-pop">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            <button
              onClick={readAll}
              className="text-xs font-medium text-sage-700 hover:underline"
            >
              Tout marquer comme lu
            </button>
          </div>
          <ul className="scroll-thin max-h-[380px] overflow-y-auto">
            {state.notifications.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push(`/clinique/animaux/${n.animalId}`);
                  }}
                  className={cn(
                    "flex w-full gap-3 px-4 py-3 text-left transition hover:bg-canvas",
                    !n.read && "bg-sage-50/60",
                  )}
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sage-100 text-sage-700">
                    {n.kind === "rdv" ? (
                      <CalendarClock size={15} />
                    ) : (
                      <MessageCircleQuestion size={15} />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink">
                      {n.title}
                    </span>
                    <span className="block text-[13px] leading-snug text-ink-muted">
                      {n.body}
                    </span>
                    <span className="mt-1 block text-[11px] text-ink-faint">
                      {fmtTime(n.at)}
                    </span>
                  </span>
                  {!n.read && (
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sage-600" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
