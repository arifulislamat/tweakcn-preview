import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "tweakcn Preview",
  description: "Standalone example preview for tweakcn themes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
