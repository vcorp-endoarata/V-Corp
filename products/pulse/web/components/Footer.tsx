export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 text-center text-xs text-white/40">
      <div>© {new Date().getFullYear()} V-Corp · All rights reserved.</div>
      <div className="mt-2 space-x-4">
        <a href="/legal/terms" className="hover:text-white">利用規約</a>
        <a href="/legal/privacy" className="hover:text-white">プライバシー</a>
        <a href="/legal/tokutei" className="hover:text-white">特定商取引法</a>
        <a href="mailto:hello@v-corp.inc" className="hover:text-white">お問い合わせ</a>
      </div>
    </footer>
  );
}
