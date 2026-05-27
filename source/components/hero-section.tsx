"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";

function useScramble(target: string, delay = 0) {
  const [display, setDisplay] = useState(() => target.replace(/./g, "_"));

  useEffect(() => {
    let frame = 0;
    let started = false;
    const timer = setTimeout(() => { started = true; }, delay);

    const tick = () => {
      if (!started) { rafId = requestAnimationFrame(tick); return; }
      const progress = Math.min(1, frame / (target.length * 5));
      setDisplay(
        target
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i / target.length < progress) return ch;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      frame++;
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    let rafId = requestAnimationFrame(tick);
    return () => { clearTimeout(timer); cancelAnimationFrame(rafId); };
  }, [target, delay]);

  return display;
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const name = useScramble("MUSTAFA EGE KILIÇ", 300);
  const role = useScramble("MEKATRONİK \\ DEVOPS \\ SİBER GÜVENLİK", 900);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-end pb-20 px-8 md:px-16 overflow-hidden pt-12 md:pt-16"
      style={{
        backgroundImage: 'url(/hero-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.06_0_0/0.4)] via-[oklch(0.06_0_0/0.6)] to-[oklch(0.06_0_0)] pointer-events-none" />

      {/* Main content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-6xl w-full"
      >
        {/* Index */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-8"
        >
          001 / PORTFOLIO
        </motion.p>

        {/* Name — massive */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.02em] text-foreground mb-3 text-balance leading-none"
        >
          {name}
        </motion.h1>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="font-mono text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground mb-12"
        >
          {role}
        </motion.p>

        {/* Focus line */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="max-w-lg"
        >
          <p className="text-sm text-[oklch(0.60_0_0)] leading-relaxed font-sans">
            Donanım seviyesinde güvenlik. OT/ICS ortamları. Ölçeklenebilir C2 mimarileri.
            Another Day in Paradise
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mt-10"
        >
          <a
            href="#work"
            className="group inline-flex items-center gap-3 px-6 py-3 border border-[oklch(0.96_0_0/0.18)] bg-[oklch(0.96_0_0/0.04)] backdrop-blur-sm text-foreground font-mono text-xs tracking-[0.2em] uppercase hover:bg-[oklch(0.96_0_0/0.10)] hover:border-[oklch(0.96_0_0/0.30)] transition-all"
          >
            Projeleri Görüntüle
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              →
            </motion.span>
          </a>

          <a
            href="https://github.com/the-abra"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 border border-[oklch(0.96_0_0/0.08)] text-muted-foreground font-mono text-xs tracking-[0.2em] uppercase hover:text-foreground hover:border-[oklch(0.96_0_0/0.20)] transition-all"
          >
            GitHub /the-abra
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 right-8 flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground rotate-90 origin-center mb-6">
          Kaydır
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-[oklch(0.96_0_0/0.20)]"
        />
      </motion.div>

      {/* Bottom horizontal rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0 }}
        className="absolute bottom-0 left-8 right-8 h-px bg-[oklch(0.96_0_0/0.12)]"
      />
    </section>
  );
}
