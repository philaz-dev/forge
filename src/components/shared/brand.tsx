import Link from "next/link";
import { cn } from "@/lib/cn";

/** Logo officiel SuperVet (chien et chat à cape + wordmark). */
export function BrandMark({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <Link
      href={href}
      aria-label="SuperVet"
      className={cn("inline-flex items-center", className)}
    >
      <img
        src="/supervet-lockup.webp"
        alt="SuperVet"
        width={622}
        height={160}
        className="h-14 w-auto mix-blend-multiply"
      />
    </Link>
  );
}
