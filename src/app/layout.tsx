import type { Metadata } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/manrope";
import "./globals.css";
export const metadata: Metadata = {
  title: "Nirav Patel — Code, curiosity & connections",
  description:
    "The personal portfolio of Nirav Patel. Web and mobile development, an interactive 3D world, and a different perspective. WordPress, PHP, Flutter, .NET, and Next.js.",
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
