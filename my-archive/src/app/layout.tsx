import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page of Pages",
  description: "An archive of my homes on the web, past and present.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
