import { cn } from "@/lib/cn";

/** Gribouillis dessinés à la main (flèches, ondulations, soleil) — touche « charte vétérinaire ». */
export function Doodle({
  kind,
  className,
}: {
  kind: "arrow" | "squiggle" | "loop";
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 80"
      className={cn("pointer-events-none", className)}
    >
      {kind === "arrow" && (
        <g {...common}>
          <path d="M8 14C34 4 76 8 92 38C98 50 96 60 90 70" />
          <path d="M78 62L90 71L99 58" />
        </g>
      )}
      {kind === "squiggle" && (
        <g {...common}>
          <path d="M6 44C14 10 24 10 28 44C32 74 42 74 46 40C50 8 60 8 64 42C68 72 78 72 82 40C86 12 98 12 112 36" />
        </g>
      )}
      {kind === "loop" && (
        <g {...common}>
          <path d="M8 62C28 78 52 64 50 44C48 24 22 28 30 48C38 66 78 62 100 28" />
          <path d="M88 26L101 27L100 40" />
        </g>
      )}
    </svg>
  );
}

/** Soleil orange à 12 pointes. */
export function Sunburst({ className }: { className?: string }) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg
      aria-hidden
      viewBox="-50 -50 100 100"
      className={cn("pointer-events-none", className)}
    >
      {rays.map((a) => (
        <path
          key={a}
          d="M-6 -22L0 -46L6 -22Z"
          fill="#F2A649"
          transform={`rotate(${a})`}
        />
      ))}
      <circle r="22" fill="#F2A649" />
    </svg>
  );
}
