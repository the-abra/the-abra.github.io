"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative py-10 px-8 md:px-16 border-t border-[oklch(0.96_0_0/0.08)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground"
        >
          © 2026 Mustafa Ege Kılıç — Tüm hakları saklıdır
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <span className="block w-1.5 h-1.5 rounded-full bg-foreground opacity-60" style={{ animation: "pulse 2.5s infinite" }} />
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
            Sistemler aktif
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground"
        >
          Turkey / Siber Vatan 2026
        </motion.p>
      </div>
    </footer>
  );
}
