import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface shadow-soft",
        className,
      )}
      {...rest}
    />
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 px-5 pt-5",
        className,
      )}
    >
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold tracking-tight text-ink">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-[13px] text-ink-muted">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function SectionTitle({
  children,
  hint,
  action,
}: {
  children: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          {children}
        </h2>
        {hint && <p className="mt-0.5 text-sm text-ink-muted">{hint}</p>}
      </div>
      {action}
    </div>
  );
}
