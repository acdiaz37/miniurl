import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "MiniURL",
  description: "Company-scoped URL shortener"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

