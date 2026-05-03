import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "V-Corp Pulse — 経営判断を、AI で 10倍速く。",
  description:
    "毎朝3分。AI が世界の動きと自社の数字を読み解き、今日の経営判断に必要な3つのアクションを提示する SaaS。",
  metadataBase: new URL("https://pulse.v-corp.io"),
  openGraph: {
    title: "V-Corp Pulse",
    description: "経営判断を、AI で 10倍速く、10倍正確に。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-ink text-white antialiased">{children}</body>
    </html>
  );
}
