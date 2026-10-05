import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Tone = "neutral" | "sage" | "amber" | "rose" | "sky" | "dark";

const TONES: Record<Tone, string> = {
  neutral: "bg-canvas text-ink-soft ring-line",
  sage: "bg-sage-50 text-sage-800 ring-sage-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  sky: "bg-sky-50 text-sky-600 ring-sky-100",
  dark: "bg-ink text-white ring-ink",
};

export function Badge({
  tone = "neutral",
  children,
  dot,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] text-xs font-medium ring-1 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      )}
      {children}
    </span>
  );
}

export const statusTone = (key: string): Tone =>
  key === "a_jour"
    ? "sage"
    : key === "bientot"
      ? "amber"
      : key === "en_retard"
        ? "rose"
        : "sky";
