"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface GistFile {
  filename: string;
  type: string;
  language: string;
  raw_url: string;
  size: number;
}

interface Gist {
  id: string;
  html_url: string;
  description: string;
  files: Record<string, GistFile>;
  created_at: string;
  updated_at: string;
}

const GISTS_DATA: Gist[] = [
  {
    id: "c510ddb94dda4bdce9c353a7e6d6ff04",
    html_url: "https://gist.github.com/the-abra/c510ddb94dda4bdce9c353a7e6d6ff04",
    description: "Hackviser Impact Makinesi Write-up",
    files: {
      "impact.md": {
        filename: "impact.md",
        type: "text/markdown",
        language: "Markdown",
        raw_url: "https://gist.githubusercontent.com/the-abra/c510ddb94dda4bdce9c353a7e6d6ff04/raw/152cf1c1fbd2e50683d9610e5bac3220b990e3eb/impact.md",
        size: 5845,
      },
    },
    created_at: "2026-05-17T19:21:34Z",
    updated_at: "2026-05-17T19:23:25Z",
  },
  {
    id: "2f360876a12eefb68fff3e2ebc24daf4",
    html_url: "https://gist.github.com/the-abra/2f360876a12eefb68fff3e2ebc24daf4",
    description: "Kriptografik donanım ivmelendirmesi ve korumalı alan (sandbox) kısıtlamalarından kaynaklanan çalışma zamanı (runtime) çökmeleri.",
    files: {
      "SEGV.md": {
        filename: "SEGV.md",
        type: "text/markdown",
        language: "Markdown",
        raw_url: "https://gist.githubusercontent.com/the-abra/2f360876a12eefb68fff3e2ebc24daf4/raw/fdd31baad69ef507727b3d8d84e2d42560c3319e/SEGV.md",
        size: 3801,
      },
    },
    created_at: "2026-05-16T21:03:32Z",
    updated_at: "2026-05-16T21:03:33Z",
  },
  {
    id: "6236161f9d44ca6bb62c145049aea783",
    html_url: "https://gist.github.com/the-abra/6236161f9d44ca6bb62c145049aea783",
    description: "Arch Linux Ollama Setup",
    files: {
      "arch-ollama.md": {
        filename: "arch-ollama.md",
        type: "text/markdown",
        language: "Markdown",
        raw_url: "https://gist.githubusercontent.com/the-abra/6236161f9d44ca6bb62c145049aea783/raw/ba0a1bca3413849e38836166ab3730690c016f19/arch-ollama.md",
        size: 3158,
      },
    },
    created_at: "2026-05-07T09:09:13Z",
    updated_at: "2026-05-12T14:06:36Z",
  },
  {
    id: "dd9825a0190560430f88aa50700a3b77",
    html_url: "https://gist.github.com/the-abra/dd9825a0190560430f88aa50700a3b77",
    description: "KiCAD v10+ Standard Operating Procedure",
    files: {
      "kiCAD-SOP.md": {
        filename: "kiCAD-SOP.md",
        type: "text/markdown",
        language: "Markdown",
        raw_url: "https://gist.githubusercontent.com/the-abra/dd9825a0190560430f88aa50700a3b77/raw/bb79bc53a2193ad43c8efe46360f8758cf27d95e/kiCAD-SOP.md",
        size: 5023,
      },
    },
    created_at: "2026-04-10T15:20:37Z",
    updated_at: "2026-04-10T15:20:38Z",
  },
  {
    id: "b05cc4d1c46edce41d615255f762840f",
    html_url: "https://gist.github.com/the-abra/b05cc4d1c46edce41d615255f762840f",
    description: "ThinkPad X1 Yoga Gen 2 Fingerprint Sensor Setup",
    files: {
      "fingerprint-setup.md": {
        filename: "fingerprint-setup.md",
        type: "text/markdown",
        language: "Markdown",
        raw_url: "https://gist.githubusercontent.com/the-abra/b05cc4d1c46edce41d615255f762840f/raw/4921db1377b6851c9ca1af95ceec1d928671faea/fingerprint-setup.md",
        size: 3293,
      },
    },
    created_at: "2026-03-24T07:10:11Z",
    updated_at: "2026-03-26T00:37:16Z",
  },
  {
    id: "60602bb4fc89fe9ae1d2971b08d4cf1c",
    html_url: "https://gist.github.com/the-abra/60602bb4fc89fe9ae1d2971b08d4cf1c",
    description: "VMware vmmon not loaded Fix",
    files: {
      "VMware_Arch_Linux_Fix_TR.md": {
        filename: "VMware_Arch_Linux_Fix_TR.md",
        type: "text/markdown",
        language: "Markdown",
        raw_url: "https://gist.githubusercontent.com/the-abra/60602bb4fc89fe9ae1d2971b08d4cf1c/raw/ffaafad191ead60a256ac47217babe7543b5e0e5/VMware_Arch_Linux_Fix_TR.md",
        size: 2367,
      },
    },
    created_at: "2026-03-14T16:01:54Z",
    updated_at: "2026-03-14T16:02:05Z",
  },
  {
    id: "4887d5d17aec54997c2248cadf17f6c9",
    html_url: "https://gist.github.com/the-abra/4887d5d17aec54997c2248cadf17f6c9",
    description: "ISP vs ME: Arch Linux DPI Bypass & Secure DNS (TR 2026 Edition)",
    files: {
      "ispvsme.md": {
        filename: "ispvsme.md",
        type: "text/markdown",
        language: "Markdown",
        raw_url: "https://gist.githubusercontent.com/the-abra/4887d5d17aec54997c2248cadf17f6c9/raw/fc50c671867146e368a6b19981c90dacd3a077ca/ispvsme.md",
        size: 8711,
      },
    },
    created_at: "2026-02-25T21:10:46Z",
    updated_at: "2026-04-14T22:07:38Z",
  },
];

function GistModal({
  gist,
  onClose,
}: {
  gist: Gist;
  onClose: () => void;
}) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const firstFile = Object.values(gist.files)[0];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(firstFile.raw_url);
        const text = await res.text();
        setContent(text);
      } catch {
        setContent("İçerik yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [firstFile.raw_url]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-950 border border-white/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-1">
              {firstFile.filename}
            </p>
            <h3 className="text-sm md:text-base text-white/90 truncate">
              {gist.description || "Başlıksız Gist"}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={gist.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-white/40 hover:text-white transition-colors tracking-wider"
            >
              GITHUB'DA GÖRÜNTÜLE
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Close modal"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 md:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-5 h-5 border border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : (
            <article className="prose prose-invert prose-sm md:prose-base max-w-none
              prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-white/90
              prose-h1:text-2xl prose-h1:border-b prose-h1:border-white/10 prose-h1:pb-4 prose-h1:mb-6
              prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-lg prose-h3:text-white/80
              prose-p:text-white/60 prose-p:leading-relaxed
              prose-a:text-white/80 prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-white
              prose-strong:text-white/80 prose-strong:font-medium
              prose-code:text-white/70 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-none
              prose-ul:text-white/60 prose-ol:text-white/60
              prose-li:marker:text-white/30
              prose-blockquote:border-l-white/20 prose-blockquote:text-white/50 prose-blockquote:italic
              prose-hr:border-white/10
              prose-img:rounded-none prose-img:border prose-img:border-white/10
              prose-table:text-sm
              prose-th:text-white/70 prose-th:font-medium prose-th:border-white/10
              prose-td:border-white/10 prose-td:text-white/50
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </article>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function GistCard({
  gist,
  index,
  onClick,
}: {
  gist: Gist;
  index: number;
  onClick: () => void;
}) {
  const firstFile = Object.values(gist.files)[0];
  const date = new Date(gist.updated_at).toLocaleDateString("tr-TR", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1],
      }}
      onClick={onClick}
      className="group w-full text-left p-5 md:p-6 border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.12] transition-all duration-300 cursor-pointer"
    >
      {/* File info */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
          {firstFile.language}
        </span>
        <span className="text-white/10">|</span>
        <span className="text-[10px] font-mono text-white/30 tracking-wider">
          {date}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm md:text-base text-white/80 group-hover:text-white transition-colors mb-2 line-clamp-2">
        {gist.description || firstFile.filename}
      </h3>

      {/* Filename */}
      <p className="text-xs font-mono text-white/30 truncate">
        {firstFile.filename}
      </p>

      {/* Size indicator */}
      <div className="mt-4 flex items-center gap-2">
        <div className="h-px flex-1 bg-white/[0.06] group-hover:bg-white/[0.12] transition-colors" />
        <span className="text-[10px] font-mono text-white/20">
          {(firstFile.size / 1024).toFixed(1)}KB
        </span>
      </div>
    </motion.button>
  );
}

export function GistsSection() {
  const [selectedGist, setSelectedGist] = useState<Gist | null>(null);

  const handleClose = useCallback(() => {
    setSelectedGist(null);
  }, []);

  return (
    <section id="gists" className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="mb-12 md:mb-16"
        >
          <p className="text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase mb-3">
            Teknik Notlar
          </p>
          <h2 className="text-2xl md:text-3xl font-light text-white/90 tracking-tight">
            Gist'ler
          </h2>
          <p className="mt-4 text-sm text-white/40 max-w-xl">
            Write-up'lar, yapılandırmalar ve teknik dokümantasyon.
          </p>
        </motion.div>

        {/* Gists grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GISTS_DATA.map((gist, index) => (
            <GistCard
              key={gist.id}
              gist={gist}
              index={index}
              onClick={() => setSelectedGist(gist)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedGist && (
          <GistModal gist={selectedGist} onClose={handleClose} />
        )}
      </AnimatePresence>
    </section>
  );
}
