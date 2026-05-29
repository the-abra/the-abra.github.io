"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Hakkımda", href: "#about" },
  { label: "Çalışmalar", href: "#work" },
  { label: "Gist'ler", href: "#gists" },
  { label: "İletişim", href: "#contact" },
];

export function Navigation({ isHighlighted = false }: { isHighlighted?: boolean }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHeroDismissed, setIsHeroDismissed] = useState(false);
  const [statusText, setStatusText] = useState("Müsait");

  useEffect(() => {
    const handleSlideChange = (e: Event) => {
      const { activeIndex, isHeroDismissed: dismissed } = (e as CustomEvent).detail;
      setActiveSlide(activeIndex);
      setIsHeroDismissed(dismissed);
    };
    window.addEventListener("slide-change", handleSlideChange);
    return () => window.removeEventListener("slide-change", handleSlideChange);
  }, []);

  useEffect(() => {
    const updateStatus = () => {
      const hour = new Date().getHours();
      const isWorking = (hour >= 9 && hour < 17) || (hour >= 0 && hour < 4);
      setStatusText(isWorking ? "İş Başında" : "Müsait");
    };
    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    e.preventDefault();
    let index = 0;
    let target = "";
    if (label === "Hakkımda") {
      index = 0;
    } else if (label === "Çalışmalar") {
      index = 1;
    } else if (label === "Gist'ler") {
      index = 2;
    } else if (label === "İletişim") {
      index = 3;
    }
    window.dispatchEvent(new CustomEvent("nav-change", { detail: { index, target } }));
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHighlighted
          ? "border-[3px] border-white shadow-[0_0_20px_rgba(255,255,255,0.85),inset_0_0_10px_rgba(255,255,255,0.45)] m-2 md:m-4 rounded-lg bg-neutral-950/95 overflow-hidden"
          : "border-b border-transparent"
      }`}
    >
      {/* Frosted bar — appears on scroll/slide change when hero is dismissed */}
      <motion.div
        animate={{ opacity: isHeroDismissed ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 border-b border-[oklch(0.96_0_0/0.06)] bg-[oklch(0.06_0_0/0.85)] backdrop-blur-xl pointer-events-none"
      />

      <nav className="relative max-w-6xl mx-auto px-4 md:px-8 py-4 md:py-5 flex items-center justify-between">
        {/* Mark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent("nav-change", { detail: { index: -1, target: "" } }));
          }}
          className="font-mono text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase text-foreground hover:text-muted-foreground transition-colors"
        >
          EGE KILIÇ
        </a>

        {/* Nav items */}
        <div className="flex items-center gap-3 md:gap-8">
          {navItems.map((item, i) => {
            const isActive = (() => {
              if (!isHeroDismissed) return false;
              if (item.label === "Hakkımda") return activeSlide === 0;
              if (item.label === "Çalışmalar") return activeSlide === 1;
              if (item.label === "Gist'ler") return activeSlide === 2;
              if (item.label === "İletişim") return activeSlide === 3;
              return false;
            })();

            return (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={(e) => handleClick(e, item.label)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6 }}
                className={`font-mono text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase transition-colors ${
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </motion.a>
            );
          })}
        </div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="hidden md:flex items-center gap-2"
        >
          <span
            className="block w-1.5 h-1.5 rounded-full bg-foreground"
            style={{ animation: "pulse 2.5s infinite" }}
          />
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
            {statusText}
          </span>
        </motion.div>
      </nav>
    </motion.header>
  );
}
