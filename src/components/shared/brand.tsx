import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Logo SuperVet : wordmark en texte (« Super » vert profond, « Vet » vert
 * sauge, comme le logo officiel). Pour afficher le fichier officiel, déposer
 * `public/supervet-logo.png` et remplacer le contenu par une balise <img>.
 */
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
      className={cn("inline-flex items-baseline py-1", className)}
    >
      <span className="font-display text-[26px] font-bold leading-none tracking-tight">
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
