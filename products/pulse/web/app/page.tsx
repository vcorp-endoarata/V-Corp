import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { Founder } from "@/components/Founder";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <main>
      <Hero />
      <Problem />
      <Features />
      <Pricing />
      <Founder />
      <FAQ />
      <Footer />
    </main>
  );
}
