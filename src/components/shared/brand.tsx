import Link from "next/link";
import { PawPrint } from "lucide-react";
import { cn } from "@/lib/cn";

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
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "grid h-8 w-8 place-items-center rounded-[10px] shadow-soft transition-transform group-hover:-rotate-6",
          tone === "dark" ? "bg-sage-700 text-white" : "bg-white text-sage-700",
        )}
      >
        <PawPrint size={17} strokeWidth={2.2} />
      </span>
      <span
        className={cn(
          "font-display text-[22px] font-light lowercase leading-none tracking-tight",
          tone === "dark" ? "text-ink" : "text-white",
        )}
      >
        vita
      </span>
    </Link>
  );
}
