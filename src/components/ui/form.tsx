import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const FIELD =
  "w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink shadow-soft outline-none transition placeholder:text-ink-faint hover:border-[#d3d7ce] focus:border-sage-400 focus:ring-4 focus:ring-sage-100";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[13px] font-medium text-ink-soft">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-xs text-ink-muted">{hint}</span>
      )}
    </label>
  );
}

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(FIELD, "h-10", className)} {...rest} />;
}

export function Textarea({
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        FIELD,
        "min-h-[96px] resize-y py-2.5 leading-relaxed",
        className,
      )}
      {...rest}
    />
  );
}

export function Select({
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(FIELD, "h-10 appearance-none pr-9", className)}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
      />
    </div>
  );
}

export function Chip({
  active,
  onClick,
  children,
  count,
  icon,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  count?: number;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-[13px] font-medium transition-all",
        active
          ? "border-sage-700 bg-sage-700 text-white shadow-soft"
          : "border-line bg-white text-ink-soft hover:border-sage-300 hover:bg-sage-50",
      )}
    >
      {icon}
      {children}
      {count !== undefined && (
        <span
          className={cn("text-xs", active ? "text-white/70" : "text-ink-faint")}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  className?: string;
}) {
  return (
    <div
      className={cn("inline-flex rounded-xl bg-black/[0.045] p-0.5", className)}
      role="tablist"
    >
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-[10px] px-3 py-1.5 text-[13px] font-medium transition",
            value === o.value
              ? "bg-white text-ink shadow-soft"
              : "text-ink-muted hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-10 shrink-0 rounded-full transition-colors",
        checked ? "bg-sage-600" : "bg-black/15",
      )}
    >
      <span
        className={cn(
          "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-4",
        )}
      />
    </button>
  );
}
