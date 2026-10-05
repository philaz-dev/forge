import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "soft" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-sage-700 text-white shadow-soft hover:bg-sage-800 active:bg-sage-900 disabled:bg-sage-300",
  secondary:
    "bg-white text-ink border border-line shadow-soft hover:bg-canvas hover:border-[#d9dcd4]",
  soft: "bg-sage-50 text-sage-800 hover:bg-sage-100",
  ghost: "text-ink-soft hover:bg-black/[0.045]",
  danger: "bg-rose-50 text-rose-700 hover:bg-rose-100",
};
const SIZES: Record<Size, string> = {
  sm: "h-8 gap-1.5 rounded-lg px-3 text-[13px]",
  md: "h-10 gap-2 rounded-xl px-4 text-sm",
  lg: "h-12 gap-2 rounded-2xl px-6 text-[15px]",
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
}

export function Button({
  variant,
  size,
  icon,
  iconRight,
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
    </button>
  );
}

interface LinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export function ButtonLink({
  variant,
  size,
  icon,
  iconRight,
  className,
  children,
  ...rest
}: LinkProps) {
  return (
    <Link className={buttonStyles(variant, size, className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </Link>
  );
}
