"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Çalışmalar", href: "#work" },
  { label: "Hakkımda", href: "#about" },
  { label: "İletişim", href: "#contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setIsScrolled(v > 60));
    return unsub;
  }, [scrollY]);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Frosted bar — appears on scroll */}
      <motion.div
        style={{ opacity: navOpacity }}
        className="absolute inset-0 border-b border-[oklch(0.96_0_0/0.06)] bg-[oklch(0.06_0_0/0.85)] backdrop-blur-xl"
      />

      <nav className="relative max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
        {/* Mark */}
        <a
          href="#"
          className="font-mono text-xs tracking-[0.3em] uppercase text-foreground hover:text-muted-foreground transition-colors"
        >
          EGE KILIÇ
        </a>

        {/* Nav items */}
        <div className="flex items-center gap-8">
          {navItems.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.6 }}
              className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </motion.a>
          ))}
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
            Müsait
          </span>
        </motion.div>
      </nav>
    </motion.header>
  );
}
