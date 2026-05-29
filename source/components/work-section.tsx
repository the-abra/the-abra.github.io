"use client";

import { motion } from "framer-motion";

// Declare custom element for model-viewer to satisfy TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "auto-rotate"?: boolean;
          "camera-controls"?: boolean;
          ar?: boolean;
          "ar-modes"?: string;
          "ios-src"?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

export interface Project {
  index: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  color: string;
  modelUrl?: string;
  longDescription?: string;
  specs?: Record<string, string>;
}

const projects: Project[] = [
  {
    index: "01",
    title: "Bitirme Projesi: PMIC",
    description: "TI BQ24074 tabanlı, giyilebilir AR/VR gözlükleri için tasarlanmış ultra kompakt (11x30mm) güç yönetim birimi (PMU) PCB tasarımı.",
    tags: ["KiCad", "TI BQ24074", "PCB Tasarımı", "IPC Standartları"],
    href: "https://github.com/the-abra/ultra-compact-pmic-bq24074",
    color: "#f43f5e",
  },
  {
    index: "02",
    title: "Robotik Kol",
    description: "3 eklemli ana kol, tabanda 1 eksen rotasyon ve ucundaki kıskaç ile toplam 4 eksenli robotik kolun kinematik tasarımı.",
    tags: ["Onshape", "3D CAD", "Mekanik Tasarım", "Mekatronik"],
    href: "#",
    color: "#3b82f6",
    modelUrl: "/thearm.glb",
    longDescription: "Onshape üzerinde endüstriyel hassasiyet standartlarında tasarlanmış 4 eksenli robotik kol prototipi. 3 eklemli hareketli kol yapısına ek olarak, tabanında 360 derece sağa/sola rotasyon sağlayan 1 eksenli bir döner tabla bulunur. Kolun uç kısmında (end-effector) nesneleri kavrayabilmesi için hareketli ve servo motor kontrollü bir kıskaç mekanizması entegre edilmiştir.",
    specs: {
      "Eksen Sayısı": "4 Eksen (3 Kol Eklemi + 1 Taban Rotasyonu)",
      "Uç İşlevci": "Servo Kontrollü Kıskaç (Gripper)",
      "Tasarım Yazılımı": "Onshape 3D CAD",
      "Kullanım Amacı": "Hassas Parça Taşıma ve Yerleştirme",
      "Malzeme Uyum": "3D Yazıcı (PLA/PETG) ve Alüminyum Şasi"
    }
  },
  {
    index: "03",
    title: "OT Güvenlik Ajanı",
    description: "Endüstriyel kontrol sistemleri (SCADA/PLC) ağlarındaki Modbus/TCP paket akışlarını dinleyen gömülü siber saldırı tespit aracı.",
    tags: ["OT Güvenliği", "Modbus/TCP", "Siber Vatan", "Protokol Analizi"],
    href: "https://github.com/the-abra",
    color: "#06b6d4",
  },
  {
    index: "04",
    title: "Dualliste C2 Engine",
    description: "Go ve Next.js tabanlı, otomasyon araçlarını (nmap, feroxbuster vb.) koordine eden ve yapay zeka destekli siber güvenlik HUD arayüzü.",
    tags: ["Go/Golang", "Next.js", "WebSockets", "React Flow"],
    href: "https://github.com/the-abra/dualliste",
    color: "#a855f7",
  },
  {
    index: "05",
    title: "RC İHA Modeli",
    description: "Onshape üzerinde aerodinamik gövde yapısı, iç donanım ve batarya bölmesi optimize edilerek tasarlanmış RC insansız hava aracı.",
    tags: ["Onshape", "UAV CAD", "Aerodinamik", "RC Donanım"],
    href: "#",
    color: "#10b981",
    modelUrl: "/UAV.glb",
    longDescription: "Onshape üzerinde aerodinamik verimlilik ilkelerine sadık kalınarak tasarlanmış radyo kontrollü insansız hava aracı (RC UAV) gövdesi. Kanat profili, kuyruk tasarımı ve burun geometrisi stabiliteyi maksimize edecek şekilde modellenmiştir. Gövde içi, seçilecek batarya, ESC, alıcı ve servo motor gibi elektronik donanımların yerleşimine ve ağırlık merkezine göre optimize edilebilir modüler bir iç hacme sahiptir.",
    specs: {
      "Kanat Yapısı": "Yüksek Taşıma Güçlü Sabit Kanat (Fixed Wing)",
      "İç Donanım Hacmi": "Batarya ve ESC Modeline Göre Ayarlanabilir Modüler Tasarım",
      "Tasarım Yazılımı": "Onshape 3D CAD",
      "İtki Sistemi": "Burun Montajlı Elektrikli Fırçasız Motor",
      "İmalat Tekniği": "Köpük Kesim / 3D Baskı Destekli Gövde Kabuğu"
    }
  },
  {
    index: "06",
    title: "CONNER Relay",
    description: "Tor ağını destekleyen, Ed25519 kimlik doğrulamalı ve otomatik dosya senkronizasyonlu zero-knowledge uçtan uca şifreli mesajlaşma aracı.",
    tags: ["Go/Golang", "Tor/Anonymity", "Cryptography", "E2EE Sync"],
    href: "https://github.com/the-abra/conner",
    color: "#eab308",
  },
];

const cardVariants = {
  hidden: (isDownward: boolean) => ({
    opacity: 0,
    y: isDownward ? -30 : 30,
    scale: 0.95,
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

function DownwardTriangleSVG({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_20px_rgba(0,0,0,0.6)]"
    >
      {/* High-opacity solid dark fill to prevent background text interference */}
      <polygon points="4,4 96,4 50,96" fill="rgba(8, 8, 8, 0.95)" />

      {/* Primary colored border */}
      <polygon
        points="4,4 96,4 50,96"
        stroke={color}
        strokeWidth="2"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />

      {/* Corner corner-brackets / crosshairs */}
      {/* Top Left */}
      <path d="M2,8 L2,2 L8,2" stroke={color} strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
      <circle cx="4" cy="4" r="1.5" fill="#ffffff" />
      
      {/* Top Right */}
      <path d="M98,8 L98,2 L92,2" stroke={color} strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
      <circle cx="96" cy="4" r="1.5" fill="#ffffff" />

      {/* Bottom Peak */}
      <path d="M46,88 L50,96 L54,88" stroke={color} strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
      <circle cx="50" cy="96" r="1.5" fill="#ffffff" />

      {/* Tech notches / details on the top edge */}
      <path
        d="M38,4 L43,4 L46,8 L54,8 L57,4 L62,4"
        stroke="#ffffff"
        strokeWidth="1.5"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <line x1="20" y1="4" x2="30" y2="4" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" vectorEffect="non-scaling-stroke" />
      <line x1="70" y1="4" x2="80" y2="4" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" vectorEffect="non-scaling-stroke" />

      {/* Tiny tick marks on diagonals */}
      <path
        d="M20,36 L24,34 M30,56 L34,54 M80,36 L76,34 M70,56 L66,54"
        stroke="#ffffff"
        strokeWidth="1"
        strokeOpacity="0.4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function UpwardTriangleSVG({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_20px_rgba(0,0,0,0.6)]"
    >
      {/* High-opacity solid dark fill to prevent background text interference */}
      <polygon points="50,4 96,96 4,96" fill="rgba(8, 8, 8, 0.95)" />

      {/* Primary colored border */}
      <polygon
        points="50,4 96,96 4,96"
        stroke={color}
        strokeWidth="2"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />

      {/* Corner brackets / crosshairs */}
      {/* Top Peak */}
      <path d="M46,12 L50,4 L54,12" stroke={color} strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
      <circle cx="50" cy="4" r="1.5" fill="#ffffff" />

      {/* Bottom Left */}
      <path d="M2,92 L2,98 L8,98" stroke={color} strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
      <circle cx="4" cy="96" r="1.5" fill="#ffffff" />

      {/* Bottom Right */}
      <path d="M98,92 L98,98 L92,98" stroke={color} strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
      <circle cx="96" cy="96" r="1.5" fill="#ffffff" />

      {/* Tech notches / details on the bottom edge */}
      <path
        d="M38,96 L43,96 L46,92 L54,92 L57,96 L62,96"
        stroke="#ffffff"
        strokeWidth="1.5"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <line x1="20" y1="96" x2="30" y2="96" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" vectorEffect="non-scaling-stroke" />
      <line x1="70" y1="96" x2="80" y2="96" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" vectorEffect="non-scaling-stroke" />

      {/* Tiny tick marks on diagonals */}
      <path
        d="M20,64 L24,66 M30,44 L34,46 M80,64 L76,66 M70,44 L66,46"
        stroke="#ffffff"
        strokeWidth="1"
        strokeOpacity="0.4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

interface WorkSectionProps {
  onProjectSelect: (project: Project) => void;
}

export function WorkSection({ onProjectSelect }: WorkSectionProps) {

  // Divide projects into two rows of 3 to interlock beautifully
  const row1 = projects.slice(0, 3);
  const row2 = projects.slice(3, 6);

  return (
    <section
      id="work"
      className="relative py-20 md:py-32 px-4 md:px-16 overflow-hidden"
      style={{
        backgroundImage: "url('/lab.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.06_0_0/0.65)] via-[oklch(0.06_0_0/0.85)] to-[oklch(0.06_0_0)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
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

        {/* Multi-Row interlocking triangles grid container */}
        <div className="flex flex-col gap-12 md:gap-0 max-w-6xl mx-auto py-8">
          
          {/* Row 1 (Projects 01, 02, 03) */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0">
            {row1.map((project, i) => {
              const isDownward = i % 2 === 0;
              const is3DModel = !!project.modelUrl;

              return (
                <motion.a
                  key={project.index}
                  href={is3DModel ? undefined : project.href}
                  target={is3DModel ? undefined : "_blank"}
                  rel={is3DModel ? undefined : "noopener noreferrer"}
                  custom={isDownward}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ scale: 1.05, zIndex: 30 }}
                  transition={{ duration: 0.3 }}
                  onClick={is3DModel ? (e) => { e.preventDefault(); onProjectSelect(project); } : undefined}
                  className={`relative group w-[300px] h-[300px] md:w-[350px] md:h-[350px] flex flex-col justify-between cursor-pointer ${
                    i > 0 ? "md:-ml-[100px]" : "md:ml-0"
                  }`}
                  style={{ zIndex: 10 + i }}
                >
                  {isDownward ? (
                    <DownwardTriangleSVG color={project.color} />
                  ) : (
                    <UpwardTriangleSVG color={project.color} />
                  )}

                  <div className="relative z-10 w-full h-full flex flex-col justify-between">
                    {isDownward ? (
                      <>
                        <div className="pt-10 px-12 text-center flex flex-col items-center gap-2">
                          <h3 className="text-sm md:text-base font-sans font-bold text-white group-hover:text-white transition-colors line-clamp-1 max-w-[210px]">
                            {project.title}
                          </h3>
                          <p className="text-[11px] md:text-xs text-white/90 group-hover:text-white transition-colors leading-relaxed line-clamp-3 max-w-[200px]">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 justify-center max-w-[200px] mt-1">
                            {project.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="font-mono text-[8px] md:text-[9px] tracking-[0.1em] px-2 py-0.5 border border-white/20 bg-white/5 text-white/80 group-hover:text-white group-hover:border-white/30 transition-colors uppercase"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="pb-8 flex flex-col items-center justify-center">
                          <span className="font-mono text-[10px] tracking-[0.3em] text-white/60 group-hover:text-white transition-colors">
                            {project.index}
                          </span>
                          <span className="text-white/60 group-hover:text-white text-xs mt-1 transition-all group-hover:translate-y-0.5">
                            {is3DModel ? "3D" : "↗"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="pt-8 flex flex-col items-center justify-center">
                          <span className="text-white/60 group-hover:text-white text-xs mb-1 transition-all group-hover:-translate-y-0.5">
                            {is3DModel ? "3D" : "↗"}
                          </span>
                          <span className="font-mono text-[10px] tracking-[0.3em] text-white/60 group-hover:text-white transition-colors">
                            {project.index}
                          </span>
                        </div>
                        <div className="pb-10 px-12 text-center flex flex-col items-center gap-2">
                          <div className="flex flex-wrap gap-1.5 justify-center max-w-[200px] mb-1">
                            {project.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="font-mono text-[8px] md:text-[9px] tracking-[0.1em] px-2 py-0.5 border border-white/20 bg-white/5 text-white/80 group-hover:text-white group-hover:border-white/30 transition-colors uppercase"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-sm md:text-base font-sans font-bold text-white group-hover:text-white transition-colors line-clamp-1 max-w-[210px]">
                            {project.title}
                          </h3>
                          <p className="text-[11px] md:text-xs text-white/90 group-hover:text-white transition-colors leading-relaxed line-clamp-3 max-w-[200px]">
                            {project.description}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* Row 2 (Projects 04, 05, 06) */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0 md:mt-6">
            {row2.map((project, i) => {
              // Alternate starting shape for row 2 to make it interlock
              const isDownward = i % 2 !== 0;
              const is3DModel = !!project.modelUrl;

              return (
                <motion.a
                  key={project.index}
                  href={is3DModel ? undefined : project.href}
                  target={is3DModel ? undefined : "_blank"}
                  rel={is3DModel ? undefined : "noopener noreferrer"}
                  custom={isDownward}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ scale: 1.05, zIndex: 30 }}
                  transition={{ duration: 0.3 }}
                  onClick={is3DModel ? (e) => { e.preventDefault(); onProjectSelect(project); } : undefined}
                  className={`relative group w-[300px] h-[300px] md:w-[350px] md:h-[350px] flex flex-col justify-between cursor-pointer ${
                    i > 0 ? "md:-ml-[100px]" : "md:ml-0"
                  }`}
                  style={{ zIndex: 10 + i }}
                >
                  {isDownward ? (
                    <DownwardTriangleSVG color={project.color} />
                  ) : (
                    <UpwardTriangleSVG color={project.color} />
                  )}

                  <div className="relative z-10 w-full h-full flex flex-col justify-between">
                    {isDownward ? (
                      <>
                        <div className="pt-10 px-12 text-center flex flex-col items-center gap-2">
                          <h3 className="text-sm md:text-base font-sans font-bold text-white group-hover:text-white transition-colors line-clamp-1 max-w-[210px]">
                            {project.title}
                          </h3>
                          <p className="text-[11px] md:text-xs text-white/90 group-hover:text-white transition-colors leading-relaxed line-clamp-3 max-w-[200px]">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 justify-center max-w-[200px] mt-1">
                            {project.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="font-mono text-[8px] md:text-[9px] tracking-[0.1em] px-2 py-0.5 border border-white/20 bg-white/5 text-white/80 group-hover:text-white group-hover:border-white/30 transition-colors uppercase"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="pb-8 flex flex-col items-center justify-center">
                          <span className="font-mono text-[10px] tracking-[0.3em] text-white/60 group-hover:text-white transition-colors">
                            {project.index}
                          </span>
                          <span className="text-white/60 group-hover:text-white text-xs mt-1 transition-all group-hover:translate-y-0.5">
                            {is3DModel ? "3D" : "↗"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="pt-8 flex flex-col items-center justify-center">
                          <span className="text-white/60 group-hover:text-white text-xs mb-1 transition-all group-hover:-translate-y-0.5">
                            {is3DModel ? "3D" : "↗"}
                          </span>
                          <span className="font-mono text-[10px] tracking-[0.3em] text-white/60 group-hover:text-white transition-colors">
                            {project.index}
                          </span>
                        </div>
                        <div className="pb-10 px-12 text-center flex flex-col items-center gap-2">
                          <div className="flex flex-wrap gap-1.5 justify-center max-w-[200px] mb-1">
                            {project.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="font-mono text-[8px] md:text-[9px] tracking-[0.1em] px-2 py-0.5 border border-white/20 bg-white/5 text-white/80 group-hover:text-white group-hover:border-white/30 transition-colors uppercase"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-sm md:text-base font-sans font-bold text-white group-hover:text-white transition-colors line-clamp-1 max-w-[210px]">
                            {project.title}
                          </h3>
                          <p className="text-[11px] md:text-xs text-white/90 group-hover:text-white transition-colors leading-relaxed line-clamp-3 max-w-[200px]">
                            {project.description}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </motion.a>
              );
            })}
          </div>

        </div>
      </div>

    </section>
  );
}
