import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Commons — H’s research workspace",
  description: "Different minds. Shared direction. Coordinate agent work, evidence and decisions.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
