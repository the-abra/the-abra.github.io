import { Particles } from "@/components/particles";
import { HeroSection } from "@/components/hero-section";
import { WorkSection } from "@/components/work-section";
import { GistsSection } from "@/components/gists-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Monochrome particle field */}
      <Particles />

      {/* Subtle scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-40 opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 4px)",
        }}
      />

      <div className="relative z-10">
        <HeroSection />
        <WorkSection />
        <GistsSection />
        <AboutSection />
        <ContactSection />
      </div>
    </main>
  );
}
