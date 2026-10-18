import type { Metadata } from "next";
import { profile } from "@/content/portfolio";
import "./globals.css";
export const metadata: Metadata = {
  title: `${profile.name} — Developer`,
  description:
    "Nirav Patel’s personal portfolio. Working with WordPress, PHP, Flutter, .NET, and Next.js. A growing home for my work.",
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
