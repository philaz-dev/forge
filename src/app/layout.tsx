import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/outfit";
import "./globals.css";
import { DemoProvider } from "@/store/demo-store";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "SuperVet — le suivi de vie de chaque animal",
  description:
    "Transformez les données de votre clinique vétérinaire en suivi personnalisé, fidélisation et nouvelles opportunités — tout au long de la vie de l'animal.",
};

export const viewport: Viewport = {
  themeColor: "#FBFBF8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <DemoProvider>
          <ToastProvider>{children}</ToastProvider>
        </DemoProvider>
      </body>
    </html>
  );
}
