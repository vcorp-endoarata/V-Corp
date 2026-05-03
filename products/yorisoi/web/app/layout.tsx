import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "よりそい — 発達障害に悩む人々の安らぎの場",
  description:
    "ADHD・ASD・トゥレット症候群など、発達障害を持つ人と、その家族・身近な人たちが、" +
    "比較せず、攻撃せず、ただ寄り添える場所。",
  metadataBase: new URL("https://yorisoi.community"),
  openGraph: {
    title: "よりそい",
    description: "発達障害に悩む人々の安らぎの場",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "よりそい",
    description: "発達障害に悩む人々の安らぎの場",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-cream font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
