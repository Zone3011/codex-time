import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Your Name — Developer & creative thinker",
  description:
    "A developer portfolio exploring thoughtful interfaces, reliable engineering, and the space between design and code.",
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
