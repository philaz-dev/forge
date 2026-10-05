import { ClinicShell } from "@/components/clinic/clinic-shell";

export default function ClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClinicShell>{children}</ClinicShell>;
}
