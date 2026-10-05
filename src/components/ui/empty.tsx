import type { ReactNode } from "react";

export function Empty({
  icon,
  title,
  children,
  action,
}: {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-sage-50 text-sage-600">
        {icon}
      </div>
      <p className="text-[15px] font-semibold text-ink">{title}</p>
      {children && (
        <p className="mt-1 max-w-sm text-sm text-ink-muted">{children}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
