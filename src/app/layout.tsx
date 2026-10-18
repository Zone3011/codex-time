import type { Metadata } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/manrope";
import "./globals.css";
export const metadata: Metadata = {
  title: "Nirav Patel — Color outside the browser",
  description:
    "Nirav Patel’s interactive portfolio. Six experiments in motion, physics, and 3D. WordPress, PHP, Flutter, .NET, and Next.js.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
