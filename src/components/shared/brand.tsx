import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Logo SuperVet. Wordmark en texte vivant (« Super » vert profond, « Vet »
 * vert sauge, comme le logo officiel) + pictogramme chien/chat à cape.
 * Pour utiliser le fichier officiel, déposer `public/supervet-logo.png`
 * et remplacer `<Glyph />` par une balise <img>.
 */
function Glyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className}>
      {/* cape */}
      <path
        d="M4 34C16 22 30 24 40 32L36 44C26 38 14 38 8 46Z"
        fill="#7BA08A"
      />
      {/* chien */}
      <path
        d="M30 8C40 4 52 10 54 22C54 28 50 31 46 33L44 50C44 56 40 58 36 58H26C20 58 20 52 22 46C24 38 22 30 24 22C25 15 27 10 30 8Z"
        fill="#123D2E"
      />
      <path d="M44 20C50 20 56 22 58 25C56 28 50 30 45 28Z" fill="#FBFAF5" />
      <circle cx="52" cy="24" r="2" fill="#123D2E" />
      {/* chat */}
      <path
        d="M34 38L36 30L42 34L48 30L50 38C52 44 50 52 44 54C38 54 32 50 34 38Z"
        fill="#D9BFA0"
      />
    </svg>
  );
}

export function BrandMark({
  href = "/",
  className,
  tone = "dark",
}: {
  href?: string;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <Link
      href={href}
      aria-label="SuperVet"
      className={cn("group inline-flex items-center gap-2", className)}
    >
      <Glyph className="h-9 w-9 transition-transform group-hover:-rotate-6" />
      <span className="font-display text-[24px] font-bold leading-none tracking-tight">
        <span className={tone === "dark" ? "text-[#123D2E]" : "text-white"}>
          Super
        </span>
        <span className={tone === "dark" ? "text-[#7BA08A]" : "text-white/80"}>
          Vet
        </span>
      </span>
    </Link>
  );
}
