"use client";

import { motion } from "framer-motion";

const stack = [
  { category: "Donanım ve ICS", items: ["KiCad", "PLC Otomasyon", "PCB Tasarım", "Gömülü Sistemler"] },
  { category: "Yazılım", items: ["Go", "Python", "Rust", "Next.js", "Linux Kernel"] },
  { category: "Ofansif Güvenlik", items: ["OT/ICS Güvenliği", "C2 Mimarisi", "Red Teaming", "Tor"] },
];

const credentials = [
  { title: "Siber Vatan 2026", sub: "Ulusal Finalist", year: "2026" },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-32 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-16 border-b border-[oklch(0.96_0_0/0.10)] pb-6"
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-2">
              003 / PROFİL
            </p>
            <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground tracking-tight">
              Hakkımda
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm text-[oklch(0.55_0_0)] leading-[1.9] mb-6 font-sans">
              Türkiye merkezli Siber Güvenlik Araştırmacısı ve Sistem Geliştiricisi. 
              Donanım ve yazılım güvenliğinin kesişimine odaklanıyor — 
              bare-metal gömülü sistemlerden ölçeklenebilir C2 mimarilerine kadar.
            </p>
            <p className="text-sm text-[oklch(0.55_0_0)] leading-[1.9] mb-10 font-sans">
              Siber Vatan 2026 Ulusal Finalisti. Ofansif güvenlik araştırmaları ve donanım 
              seviyesinde zafiyet analizi uzmanlığı ile OT/ICS ortamlarında faaliyet gösteriyor.
            </p>

            {/* Stack table */}
            <div className="space-y-8">
              {stack.map((group, gi) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: gi * 0.1, duration: 0.7 }}
                >
                  <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-muted-foreground mb-3">
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="font-mono text-[10px] tracking-[0.15em] px-3 py-1.5 border border-[oklch(0.96_0_0/0.10)] text-[oklch(0.65_0_0)] hover:border-[oklch(0.96_0_0/0.25)] hover:text-foreground transition-all cursor-default"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Credentials */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-muted-foreground mb-6">
              Doğrulanmış Sertifikalar/Başarılar
            </p>

            <div className="space-y-0 divide-y divide-[oklch(0.96_0_0/0.07)]">
              {credentials.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start justify-between py-5 gap-4 group"
                >
                  <div>
                    <p className="text-sm font-sans font-medium text-foreground mb-0.5 group-hover:text-foreground transition-colors">
                      {c.title}
                    </p>
                    <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground">
                      {c.sub}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground shrink-0 mt-1">
                    {c.year}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Glass stat panel */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-10 p-6 border border-[oklch(0.96_0_0/0.10)] bg-[oklch(0.96_0_0/0.02)] backdrop-blur-sm"
            >
              <div className="grid grid-cols-3 gap-4 divide-x divide-[oklch(0.96_0_0/0.08)]">
                {[
                  { val: "4+", label: "Projeler" },
                  { val: "3", label: "Alanlar" },
                  { val: "TUR", label: "Menşei" },
                ].map((s) => (
                  <div key={s.label} className="text-center px-2">
                    <p className="font-mono text-lg font-bold text-foreground mb-1">{s.val}</p>
                    <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
