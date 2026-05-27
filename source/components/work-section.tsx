"use client";

import { motion } from "framer-motion";

const projects = [
  {
    index: "01",
    title: "Dualliste C2 Core",
    description: "Canlı topoloji görselleştirmesi ile yüksek performanslı komuta ve kontrol çalışma alanı. Gizli operasyonel ortamlar için tasarlandı.",
    tags: ["Go", "C2 Mimari", "Red Team", "Topoloji"],
    href: "https://github.com/the-abra/dualliste",
  },
  {
    index: "02",
    title: "Ultra-Kompakt PMIC",
    description: "Yüksek yoğunluklu donanımlar için IPC uyumlu güç yönetim birimi. Minyatürize edilmiş gömülü sistemler için tasarlandı.",
    tags: ["KiCad", "PCB Tasarım", "Gömülü", "BQ24074"],
    href: "https://github.com/the-abra/ultra-compact-pmic-bq24074",
  },
  {
    index: "03",
    title: "CONNER Protokolü",
    description: "Tor P2P ağları üzerinden çalışan güvenli röle mimarisi. Zorlu koşullar için anonimleştirilmiş iletişim.",
    tags: ["Rust", "Tor", "P2P", "Kriptografi"],
    href: "https://github.com/the-abra/conner",
  },
  {
    index: "04",
    title: "Dockero",
    description: "Operasyonel ölçekte karmaşık çoklu hizmet orkestrasyonu için oluşturulmuş gelişmiş konteyner yönetim araç kiti.",
    tags: ["Go", "Docker", "CLI", "Sistem"],
    href: "https://github.com/the-abra/dockero",
  },
];

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function WorkSection() {
  return (
    <section id="work" className="relative py-32 px-8 md:px-16">
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
              002 / STRATEJİK OPERASYONLAR
            </p>
            <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground tracking-tight">
              Seçili Projeler
            </h2>
          </div>
          <a
            href="https://github.com/the-abra"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Tümü GitHub'da →
          </a>
        </motion.div>

        {/* Project rows */}
        <div className="divide-y divide-[oklch(0.96_0_0/0.07)]">
          {projects.map((project, i) => (
            <motion.a
              key={project.index}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              custom={i}
              variants={rowVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover="hover"
              className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-8 cursor-pointer"
            >
              {/* Index */}
              <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground w-10 shrink-0 group-hover:text-foreground transition-colors">
                {project.index}
              </span>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-sans font-medium text-foreground group-hover:text-foreground transition-colors mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  {project.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 shrink-0 max-w-xs">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 border border-[oklch(0.96_0_0/0.10)] text-muted-foreground group-hover:border-[oklch(0.96_0_0/0.22)] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Arrow */}
              <motion.span
                initial={{ x: 0, opacity: 0.3 }}
                variants={{ hover: { x: 6, opacity: 1 } }}
                className="font-mono text-sm text-muted-foreground shrink-0 hidden md:block"
              >
                ↗
              </motion.span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
