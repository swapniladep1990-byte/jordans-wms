import "./globals.css";
import type { Metadata } from "next";
import AppLayout from "@/components/layout/AppLayout";
import Providers from "./providers";

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
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}