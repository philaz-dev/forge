import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "soft" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-mint text-sage-900 shadow-soft ring-1 ring-inset ring-sage-300/80 hover:bg-[#D1E2B6] active:bg-[#C6DAA8] disabled:bg-sage-100 disabled:text-sage-400",
  secondary:
    "bg-white text-ink border border-line shadow-soft hover:bg-sage-50 hover:border-sage-300",
  soft: "bg-sage-50 text-sage-800 hover:bg-sage-100",
  ghost: "text-ink-soft hover:bg-black/[0.045]",
  danger: "bg-rose-50 text-rose-700 hover:bg-rose-100",
};
const SIZES: Record<Size, string> = {
  sm: "h-8 gap-1.5 rounded-full px-3.5 text-[13px]",
  md: "h-10 gap-2 rounded-full px-5 text-sm",
  lg: "h-12 gap-2.5 rounded-full px-6 text-[15px]",
};

export const buttonStyles = (
  variant: Variant = "primary",
  size: Size = "md",
  extra?: string,
) =>
  cn(
    "inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium transition-all duration-150 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-60",
    VARIANTS[variant],
    SIZES[size],
    extra,
  );

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  /** Pastille « flèche dans un rond » (charte). */
  arrow?: boolean;
}

const ArrowDot = () => (
  <span className="-mr-2.5 grid h-7 w-7 place-items-center rounded-full bg-white ring-1 ring-sage-300">
    <ArrowUpRight size={14} />
  </span>
);

export function Button({
  variant,
  size,
  icon,
  iconRight,
  arrow,
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={buttonStyles(variant, size, className)}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
      {arrow && <ArrowDot />}
    </button>
  );
}

interface LinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  /** Pastille « flèche dans un rond » (charte). */
  arrow?: boolean;
}

export function ButtonLink({
  variant,
  size,
  icon,
  iconRight,
  arrow,
  className,
  children,
  ...rest
}: LinkProps) {
  return (
    <Link className={buttonStyles(variant, size, className)} {...rest}>
      {icon}
      {children}
      {iconRight}
      {arrow && <ArrowDot />}
    </Link>
  );
}
