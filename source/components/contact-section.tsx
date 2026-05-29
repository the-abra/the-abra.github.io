"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const socials = [
  { label: "GitHub", handle: "/the-abra", href: "https://github.com/the-abra" },
  { label: "LinkedIn", handle: "/egekılıç", href: "https://www.linkedin.com/in/egekılıç/" },
  { label: "X", handle: "@theabraguy", href: "https://x.com/theabraguy" },
  { label: "Instagram", handle: "@theabracore", href: "https://www.instagram.com/theabracore/" },
];

type Status = "idle" | "sending" | "sent" | "error";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/mblyzjay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-transparent border-b border-[oklch(0.96_0_0/0.12)] py-3 text-sm text-foreground placeholder:text-foreground/50 font-sans focus:outline-none focus:border-[oklch(0.96_0_0/0.45)] transition-colors";

  return (
    <section
      id="contact"
      className="relative py-20 md:py-32 px-4 md:px-16 overflow-hidden"
      style={{
        backgroundImage: "url('/teti.webp')",
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
              004 / İLETİŞİM
            </p>
            <h2 className="text-2xl md:text-3xl font-sans font-light text-foreground tracking-tight">
              Bağlantı Kur
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {status === "sent" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16"
              >
                <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
                  İLETİ ALINDI
                </p>
                <p className="text-sm text-foreground/85 leading-relaxed">
                  Mesaj iletildi. Güvenli kanal üzerinden yanıt bekleniyor.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="font-mono text-[9px] tracking-[0.35em] uppercase text-muted-foreground block mb-2">
                    İsim
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="İsminiz"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-[0.35em] uppercase text-muted-foreground block mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e-posta@adresiniz.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-[0.35em] uppercase text-muted-foreground block mb-2">
                    Mesaj
                  </label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Amacınızı belirtin..."
                    rows={5}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={status === "sending"}
                    whileHover={{ opacity: 0.85 }}
                    whileTap={{ scale: 0.98 }}
                    className="font-mono text-[10px] tracking-[0.35em] uppercase px-8 py-4 border border-[oklch(0.96_0_0/0.25)] text-foreground bg-[oklch(0.96_0_0/0.04)] backdrop-blur-sm hover:bg-[oklch(0.96_0_0/0.10)] transition-all disabled:opacity-40"
                  >
                    {status === "sending" ? "İletiliyor..." : "Mesaj Gönder →"}
                  </motion.button>

                  {status === "error" && (
                    <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mt-4">
                      İletim başarısız. Tekrar deneyin.
                    </p>
                  )}
                </div>
              </form>
            )}
          </motion.div>

          {/* Right — links */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-0 divide-y divide-[oklch(0.96_0_0/0.07)]"
          >
            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="group flex items-center justify-between py-5"
              >
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
                  {s.label}
                </span>
                <span className="text-sm font-sans text-foreground/80 group-hover:text-foreground transition-colors">
                  {s.handle} <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </span>
              </motion.a>
            ))}

            {/* Gist / Blog */}
            <motion.a
              href="https://gist.github.com/the-abra"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55 }}
              className="group flex items-center justify-between py-5"
            >
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
                Gists / Blog
              </span>
              <span className="text-sm font-sans text-foreground/80 group-hover:text-foreground transition-colors">
                gist.github.com/the-abra <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
              </span>
            </motion.a>

            {/* Glass note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65 }}
              className="pt-8"
            >
              <div className="p-5 border border-[oklch(0.96_0_0/0.08)] bg-[oklch(0.96_0_0/0.02)] backdrop-blur-sm">
                <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
                  Yanıt süresi
                </p>
                <p className="text-sm text-foreground/85 font-sans leading-relaxed">
                  Ciddi talepler için 24–48 saat içinde. Gömülü sistemler, donanım tasarımı, 
                  3D CAD ve endüstriyel otomasyon (OT/ICS) iş birlikleri önceliklidir.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
