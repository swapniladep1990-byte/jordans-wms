import "./globals.css";
import type { Metadata } from "next";
import AppLayout from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Jordans WMS",
  description: "Warehouse Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}