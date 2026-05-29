"use client";

import { useState, useEffect, useRef } from "react";
import { Particles } from "@/components/particles";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { WorkSection } from "@/components/work-section";
import { GistsSection, GistModal, Gist } from "@/components/gists-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import { Project } from "@/components/work-section";

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

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHeroDismissed, setIsHeroDismissed] = useState(false);
  const isLocked = useRef(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedGist, setSelectedGist] = useState<Gist | null>(null);
  // Ref mirror so event handlers can read modal state without dep array changes
  const isModalOpenRef = useRef(false);
  useEffect(() => {
    isModalOpenRef.current = !!(selectedGist || selectedProject);
  }, [selectedGist, selectedProject]);
  const [showScrollWarning, setShowScrollWarning] = useState(false);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownWarning = useRef(false);

  const triggerScrollWarning = () => {
    if (hasShownWarning.current) return;
    hasShownWarning.current = true;
    setShowScrollWarning(true);
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    warningTimeoutRef.current = setTimeout(() => {
      setShowScrollWarning(false);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, []);

  // Dispatch slide change event for the navigation bar background frosted bar
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("slide-change", { detail: { activeIndex, isHeroDismissed } })
    );
  }, [activeIndex, isHeroDismissed]);

  const triggerTransition = (direction: number) => {
    isLocked.current = true;
    setActiveIndex((prev) => (prev + direction + 4) % 4);
    setTimeout(() => {
      isLocked.current = false;
    }, 1200); // 1.2s lock to match transition duration
  };

  // Handle scroll/wheel event
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If any modal is open, let the browser handle scroll natively
      if (isModalOpenRef.current) return;

      if (!isHeroDismissed) {
        if (e.deltaY > 0) {
          e.preventDefault();
          triggerScrollWarning();
        }
        return;
      }

      if (isLocked.current) {
        e.preventDefault();
        return;
      }

      const currentSlide = slideRefs.current[activeIndex];
      if (!currentSlide) return;

      const deltaY = e.deltaY;
      if (Math.abs(deltaY) < 15) return; // Ignore small scrolls

      if (deltaY > 0) {
        // Scroll down: warn if at the bottom of the current slide
        const isAtBottom =
          currentSlide.scrollTop + currentSlide.clientHeight >= currentSlide.scrollHeight - 5;
        if (isAtBottom) {
          e.preventDefault();
          triggerScrollWarning();
        }
      } else {
        // Scroll up: warn if at the top of the current slide
        const isAtTop = currentSlide.scrollTop <= 5;
        if (isAtTop) {
          e.preventDefault();
          triggerScrollWarning();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeIndex, isHeroDismissed]);

  // Handle touch events for swipe support on mobile/trackpads
  const touchStart = useRef(0);
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isModalOpenRef.current) return;

      if (!isHeroDismissed) {
        const touchEnd = e.touches[0].clientY;
        const deltaY = touchStart.current - touchEnd;
        if (deltaY > 30) {
          // swipe up
          if (e.cancelable) e.preventDefault();
          triggerScrollWarning();
        }
        return;
      }

      if (isLocked.current) return;

      const currentSlide = slideRefs.current[activeIndex];
      if (!currentSlide) return;

      const touchEnd = e.touches[0].clientY;
      const deltaY = touchStart.current - touchEnd;

      if (Math.abs(deltaY) > 30) {
        if (deltaY > 0) {
          const isAtBottom =
            currentSlide.scrollTop + currentSlide.clientHeight >= currentSlide.scrollHeight - 10;
          if (isAtBottom) {
            if (e.cancelable) e.preventDefault();
            triggerScrollWarning();
          }
        } else {
          const isAtTop = currentSlide.scrollTop <= 10;
          if (isAtTop) {
            if (e.cancelable) e.preventDefault();
            triggerScrollWarning();
          }
        }
        touchStart.current = touchEnd;
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [activeIndex, isHeroDismissed, selectedGist, selectedProject]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If any modal is open, don't intercept keyboard scroll keys
      if (isModalOpenRef.current) return;

      if (!isHeroDismissed) {
        if (e.key === "PageDown" || e.key === "ArrowDown" || e.key === " ") {
          e.preventDefault();
          triggerScrollWarning();
        }
        return;
      }

      if (isLocked.current) return;
      if (e.key === "PageDown" || e.key === "ArrowDown" || e.key === " ") {
        // Only trigger if at bottom of internal content
        const currentSlide = slideRefs.current[activeIndex];
        if (currentSlide) {
          const isAtBottom =
            currentSlide.scrollTop + currentSlide.clientHeight >= currentSlide.scrollHeight - 5;
          if (isAtBottom) {
            e.preventDefault();
            triggerScrollWarning();
          }
        }
      } else if (e.key === "PageUp" || e.key === "ArrowUp") {
        // Only trigger if at top of internal content
        const currentSlide = slideRefs.current[activeIndex];
        if (currentSlide) {
          const isAtTop = currentSlide.scrollTop <= 5;
          if (isAtTop) {
            e.preventDefault();
            triggerScrollWarning();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, isHeroDismissed, selectedGist, selectedProject]);

  // Navigation click listener
  useEffect(() => {
    const handleNavChange = (e: Event) => {
      const { index } = (e as CustomEvent).detail;

      if (index === -1) {
        setIsHeroDismissed(false);
        setActiveIndex(0);
        return;
      }

      setIsHeroDismissed(true);
      setActiveIndex(index);

      // Reset scroll position on other slides
      setTimeout(() => {
        const slide = slideRefs.current[index];
        if (slide) {
          slide.scrollTo({ top: 0 });
        }
      }, 100);
    };

    window.addEventListener("nav-change", handleNavChange);
    return () => window.removeEventListener("nav-change", handleNavChange);
  }, []);

  // Determine viewport translation styling based on the active index
  // 0 (Hakkımda): x = 0%, y = 0% [0,0]
  // 1 (Çalışmalar): x = -50%, y = 0% [1,0] (slides horizontally right)
  // 2 (Gist'ler): x = -50%, y = -50% [1,1] (slides vertically down)
  // 3 (İletişim): x = 0%, y = -50% [0,1] (slides horizontally left)
  const getTransform = () => {
    switch (activeIndex) {
      case 0:
        return "translate(0%, 0%)";
      case 1:
        return "translate(-50%, 0%)";
      case 2:
        return "translate(-50%, -50%)";
      case 3:
        return "translate(0%, -50%)";
      default:
        return "translate(0%, 0%)";
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-background">
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

      {/* Global Navigation */}
      <Navigation isHighlighted={showScrollWarning} />

      {/* Hero overlay page */}
      <div
        className={`fixed inset-0 z-30 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isHeroDismissed ? "pointer-events-none" : ""
        }`}
        style={{ transform: isHeroDismissed ? "translateY(-100%)" : "translateY(0%)" }}
      >
        <div className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none">
          <HeroSection />
        </div>
      </div>

      {/* 2D Looping Scroll Grid Container */}
      <div
        className="absolute top-0 left-0 w-[200vw] h-[200vh] grid grid-cols-2 grid-rows-2 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: getTransform() }}
      >
        {/* Child 1: Slide 0 (Hakkımda) [0,0] */}
        <div
          ref={(el) => {
            slideRefs.current[0] = el;
          }}
          className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none"
        >
          <AboutSection />
        </div>

        {/* Child 2: Slide 1 (Çalışmalar) [1,0] */}
        <div
          ref={(el) => {
            slideRefs.current[1] = el;
          }}
          className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none"
        >
          <WorkSection onProjectSelect={setSelectedProject} />
        </div>

        {/* Child 4: Slide 3 (İletişim) [0,1] */}
        <div
          ref={(el) => {
            slideRefs.current[3] = el;
          }}
          className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none"
        >
          <ContactSection />
        </div>

        {/* Child 4: Slide 2 (Gist'ler) [1,1] */}
        <div
          ref={(el) => {
            slideRefs.current[2] = el;
          }}
          className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none"
        >
          <GistsSection onGistSelect={setSelectedGist} />
        </div>
      </div>

      {/* Import Google's model-viewer script dynamically */}
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        strategy="afterInteractive"
      />

      {/* Full screen 3D Viewer Modal (rendered outside the transformed grid container) */}
      <AnimatePresence>
        {selectedProject && selectedProject.modelUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-md bg-black/60"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl h-[85vh] bg-neutral-950 border border-white/10 flex flex-col md:flex-row overflow-hidden shadow-2xl"
            >
              {/* Left Panel: 3D Render Viewport */}
              <div className="flex-1 h-1/2 md:h-full relative bg-black/40">
                <model-viewer
                  src={selectedProject.modelUrl}
                  alt={selectedProject.title}
                  auto-rotate
                  camera-controls
                  style={{ width: "100%", height: "100%" }}
                />
                
                {/* Tech brackets / watermark info */}
                <div className="absolute bottom-6 left-6 pointer-events-none font-mono text-[9px] text-white/40 tracking-widest leading-relaxed">
                  MODEL // DYNAMIC 3D RENDER<br />
                  INTERACTIVE ORBIT WORKSPACE
                </div>
              </div>

              {/* Right Panel: Spec Information */}
              <div className="w-full md:w-[400px] h-1/2 md:h-full border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-between p-8 overflow-y-auto bg-neutral-950">
                <div className="space-y-6">
                  {/* Category & Title */}
                  <div>
                    <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase block mb-2">
                      {selectedProject.index} / ONSHAPE CAD MODEL
                    </span>
                    <h3 className="text-xl font-sans font-bold text-white tracking-tight">
                      {selectedProject.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-white/60 leading-relaxed font-sans">
                    {selectedProject.longDescription}
                  </p>

                  {/* Specs Table */}
                  {selectedProject.specs && (
                    <div className="space-y-4">
                      <span className="font-mono text-[9px] tracking-[0.35em] text-white/40 uppercase block border-b border-white/5 pb-2">
                        TEKNİK ÖZELLİKLER
                      </span>
                      <div className="space-y-3 font-mono text-[10px]">
                        {Object.entries(selectedProject.specs).map(([key, val]) => (
                          <div key={key} className="flex flex-col gap-1 border-b border-white/5 pb-2">
                            <span className="text-white/40 uppercase tracking-wider">{key}</span>
                            <span className="text-white/80">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="mt-8 w-full py-3 border border-white/10 text-white/80 hover:text-white hover:border-white/30 font-mono text-xs tracking-[0.25em] uppercase bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                >
                  KAPAT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gist Modal (rendered outside the transformed grid container) */}
      <AnimatePresence>
        {selectedGist && (
          <GistModal
            gist={selectedGist}
            onClose={() => setSelectedGist(null)}
          />
        )}
      </AnimatePresence>

      {/* Scroll Warning Overlay */}
      <AnimatePresence>
        {showScrollWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
            className="fixed inset-0 z-40 backdrop-blur-xl bg-black/75 flex items-center justify-center pointer-events-auto"
          >
            {/* Tech grid background pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />
            
            <motion.div
              initial={{ scale: 0.9, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 10, opacity: 0 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
              className="border border-white/10 bg-neutral-950/90 p-8 max-w-sm mx-4 text-center shadow-[0_0_50px_rgba(6,182,212,0.2)] relative rounded-lg overflow-hidden backdrop-blur-md"
            >
              {/* High-tech corner markings */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/80" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/80" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/80" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/80" />
              
              {/* High-tech pulsing indicator */}
              <div className="flex justify-center mb-4">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </div>
              </div>

              <div className="font-mono text-[9px] tracking-[0.35em] text-cyan-400/90 uppercase mb-2">
                [ SYSTEM_NAV // PROTOCOL_LOCK ]
              </div>
              
              <h3 className="font-mono text-xs md:text-sm tracking-[0.2em] text-white uppercase font-bold mb-3">
                GEÇİŞ İÇİN MENÜYÜ KULLANIN
              </h3>
              
              <p className="text-[11px] md:text-xs text-white/70 leading-relaxed font-sans mb-5">
                Sayfalar arasında geçiş yapmak için lütfen yukarıda yer alan menü butonlarını kullanın. Manuel kaydırma devre dışı bırakılmıştır.
              </p>
              
              {/* Bottom decorative stats */}
              <div className="border-t border-white/5 pt-3 flex items-center justify-between font-mono text-[8px] text-white/30">
                <span>STATUS: SECURE</span>
                <span>CODE: 0x9F_NAV</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
