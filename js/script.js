document.addEventListener("DOMContentLoaded", () => {
    const unlockAudioAndHideOverlay = () => {
        // Play a dummy sound to unlock audio playback
        const clickSound = new Audio("static/click.webm");
        clickSound.volume = 0;
        clickSound.play().catch(() => {});

        const overlay = document.getElementById("privilege-overlay");
        if (overlay) {
            overlay.classList.add("hidden");
            setTimeout(() => overlay.remove(), 800);
        }
        document.removeEventListener("click", unlockAudioAndHideOverlay);
        document.removeEventListener("touchstart", unlockAudioAndHideOverlay);
        document.removeEventListener("keydown", unlockAudioAndHideOverlay);
    };

    document.addEventListener("click", unlockAudioAndHideOverlay, { passive: true });
    document.addEventListener("touchstart", unlockAudioAndHideOverlay, { passive: true });
    document.addEventListener("keydown", unlockAudioAndHideOverlay, { passive: true });

    const playHover = () => {
        const hoverSound = new Audio("static/hover.webm");
        hoverSound.volume = .25;
        hoverSound.play().catch(() => { })
    };

    const playClick = () => {
        const clickSound = new Audio("static/click.webm");
        clickSound.play().catch(() => { })
    };

    const addAudioListeners = () => {
        document.querySelectorAll("button, a, .card").forEach(el => {
            if (!el.dataset.audioBound) {
                // Skip global audio for poem navigation buttons
                if (el.classList.contains('poem-nav-btn')) return;

                el.addEventListener("mouseenter", playHover, { passive: true });
                el.addEventListener("click", playClick, { passive: true });
                el.dataset.audioBound = "true";
            }
        });
    };

    const canvas = document.getElementById("constellation-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d", { alpha: true });
        let particles = [];
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const particleCount = isMobile ? 40 : 80;
        const maxDistance = 150;
        const maxDistanceSq = maxDistance * maxDistance;
        let width, height;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize, { passive: true });
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - .5) * (isMobile ? .15 : .25);
                this.vy = (Math.random() - .5) * (isMobile ? .15 : .25);
                this.radius = Math.random() * (isMobile ? 1.2 : 1.8);
                this.baseOpacity = Math.random() * .4 + .1;
                this.opacity = this.baseOpacity;
                this.twinkleSpeed = Math.random() * .01 + .005;
                const colors = ["rgba(255, 201, 71, ", "rgba(224, 224, 224, ", "rgba(255, 255, 255, "];
                this.colorBase = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
                this.opacity = this.baseOpacity + Math.sin(Date.now() * this.twinkleSpeed) * .1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.colorBase + this.opacity + ")";
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            if (prefersReducedMotion) return;
            
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.update();
                p.draw();
                
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distSq = dx * dx + dy * dy;
                    
                    if (distSq < maxDistanceSq) {
                        const dist = Math.sqrt(distSq);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        const lineOpacity = .12 * (1 - dist / maxDistance);
                        ctx.strokeStyle = `rgba(255, 201, 71, ${lineOpacity})`;
                        ctx.lineWidth = .3;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        };

        init();
        if (!prefersReducedMotion) animate();
    }

    const progressBar = document.getElementById("scroll-progress");
    const nav = document.querySelector(".nav");
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScroll = () => {
        const scrollY = window.scrollY;
        
        // Progress bar
        if (progressBar) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollY / totalHeight) * 100;
            progressBar.style.width = scrollPercent + "%";
        }

        // Nav
        if (nav) {
            if (scrollY > 50) {
                nav.style.padding = "1rem 0";
                nav.style.background = "rgba(10, 25, 49, 0.7)";
                nav.style.boxShadow = "0 5px 20px rgba(0,0,0,0.3)";
            } else {
                nav.style.padding = "1.5rem 0";
                nav.style.background = "rgba(10, 25, 49, 0.4)";
                nav.style.boxShadow = "none";
            }
        }

        lastScrollY = scrollY;
        ticking = false;
    };

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }, { passive: true });

    const loadIcons = async () => {
        const iconElements = document.querySelectorAll("[data-lucide]");
        for (const el of iconElements) {
            const iconName = el.getAttribute("data-lucide");
            try {
                const response = await fetch(`images/lucide/${iconName}.svg`);
                if (!response.ok) continue;
                const svgContent = await response.text();
                
                // Parse the SVG string to a document element
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
                const svgElement = svgDoc.querySelector("svg");
                
                if (svgElement) {
                    // Copy existing classes to the new SVG
                    el.classList.forEach(cls => svgElement.classList.add(cls));
                    
                    // Copy data attributes
                    Object.keys(el.dataset).forEach(key => {
                        svgElement.dataset[key] = el.dataset[key];
                    });

                    // Replace original element with the SVG
                    el.replaceWith(svgElement);
                }
            } catch (err) {
                console.error(`Error loading icon ${iconName}:`, err);
            }
        }
    };

    loadIcons();
    addAudioListeners();

    // Poem Logic
   const poems = [
        {
            title: "Umbra Salutis",
            body: "Vidi portas ubi finis saeculi incipit,\nTransivi limen ubi terra in aere pendet.\nAnte oculos, alae lucis et cornua umbrae,\nDuae viae in silentio magno me vocant.\n\nNon sum ex igne, non sum ex aethere puro,\nSum viator sine signo in hac statera.\nInter nubes altas et abyssum profundam,\nQuaero veritatem quam dii occultaverunt.\n\nO Conditor absconditus in astris caecis,\nVel lumen vel tenebrae spiritum tangant.\nIn hac solitudine, cor meum est lex,\nEt umbra salutis fiet mea vera domus."
        },
        {
            title: "FIAT",
            body: "Scriptum est in tabulis e lapide aeterno:\nNe misceantur superi et vires inferi.\nAstra non tangant umbras in fundo caeco,\nHaec est lex magna quae universum tenet.\n\nSed natura frangit quod natura creavit,\nIn tenebris tacitis foedus novum ictum est.\nIgnis et nubes in uno amplexu iunguntur,\nSine voce, sine metu, contra deos ipsos.\n\nFiat ruina ordinis si amor est scelus,\nCadant columnae caeli sub pondere fati.\nNam catenae spiritus aevum non ferunt,\nEt lex falsa in cinerem mox vertetur."
        },
        {
            title: "JUSTITIA",
            body: "Silentium magnum in atriis deorum regnat,\nNomen ineffabile de memoria rasum est.\nAeva transierunt in mendacio perfecto,\nUbi lux et nox seorsum vivere iurant.\n\nSanguis duarum originum occulte fluit,\nIn una vena, vis utriusque mundi latet.\nVae staterae falsae, pondus non iam fert,\nQuia veritas sepulta e tumulo surgit.\n\nAequitas nova ex pulvere et sanguine orietur,\nIudicium verum super antiquas ruinas.\nUbi duo latera in uno corpore iunguntur,\nIbi vera justitia mundum denuo aedificat."
        },
        {
            title: "RUAT",
            body: "Caelum ruit et aeternitatis saxa tremunt,\nNuntii cladis advenerunt ex inani.\nMundum catenis aereis et frigidis ligant,\nEt umbra mortis super astra expanditur.\n\nCeciderunt immortales de sedibus altis,\nGloria eorum in lutum et fumum versa est.\nCoronae fractae sunt, alae in pulvere iacent,\nEt pax illusoria supernorum periit.\n\nRuat falsum caelum, ruat stultitia deorum,\nDum ex ruderibus obscuris ordo novus surgit.\nIn silentio et clade, rebellio nascitur,\nEt in fine dierum, vis vera invenitur."
        },
        {
            title: "CAELUM",
            body: "Firmamentum non est asylum pacis aeternae,\nSed campus cruoris ubi fata decernuntur.\nRadix vitae oculos aperuit ut devoret,\nEt monstra antiqua ex somno evigilant.\n\nSed nos sumus scintillae in hac nocte ultima,\nIn flammis renati, mortem ipsam spernentes.\nNon oremus ad astra quae in abyssum cadunt,\nNec ad numina quae nos ab exitio non salvant.\n\nNos ipsi fati magistri in aevo obscuro sumus,\nGladiis nostris vias per tenebras scindimus.\nHoc est caelum nostrum, haec est lex ultima:\nLocus ubi ipsi deos vincimus et vivimus."
        }
    ];

    let currentPoemIndex = 0;
    const poemOverlay = document.getElementById("poem-overlay");
    const poemTitle = document.getElementById("poem-title");
    const poemBody = document.getElementById("poem-body");
    const openSound = new Audio("static/open-page-sfx.webm");
    const emptinessAudio = new Audio("static/emptyness.webm");
    const whisperAudio = new Audio("static/whishper.webm");
    emptinessAudio.loop = true;
    whisperAudio.loop = true;
    emptinessAudio.addEventListener("ended", () => { emptinessAudio.currentTime = 0; emptinessAudio.play().catch(() => {}); });
    whisperAudio.addEventListener("ended", () => { whisperAudio.currentTime = 0; whisperAudio.play().catch(() => {}); });
    let whisperTimeout = null;
    let fadeIntervals = [];

    const fadeVolume = (audio, from, to, duration) => {
        return new Promise(resolve => {
            const steps = duration / 50;
            const delta = (to - from) / steps;
            let current = from;
            audio.volume = current;

            const interval = setInterval(() => {
                current += delta;
                if ((delta > 0 && current >= to) || (delta < 0 && current <= to)) {
                    current = to;
                    clearInterval(interval);
                    fadeIntervals = fadeIntervals.filter(i => i !== interval);
                }
                audio.volume = Math.max(0, Math.min(1, current));
            }, 50);

            fadeIntervals.push(interval);
            setTimeout(resolve, duration);
        });
    };

    const startPoemAmbient = () => {
        emptinessAudio.volume = 0;
        emptinessAudio.play().catch(() => {});
        fadeVolume(emptinessAudio, 0, 0.8, 2000);

        whisperTimeout = setTimeout(() => {
            whisperAudio.volume = 0;
            whisperAudio.play().catch(() => {});
            fadeVolume(whisperAudio, 0, 0.8, 2000);
        }, 1000);
    };

    const stopPoemAmbient = () => {
        if (whisperTimeout) {
            clearTimeout(whisperTimeout);
            whisperTimeout = null;
        }

        fadeIntervals.forEach(clearInterval);
        fadeIntervals = [];

        const fadeOutSequence = async (audio) => {
            await fadeVolume(audio, audio.volume, 0.3, 1000);
            await fadeVolume(audio, 0.3, 0, 1000);
            audio.pause();
            audio.currentTime = 0;
        };

        fadeOutSequence(emptinessAudio);
        fadeOutSequence(whisperAudio);
    };

    const playSwitchSound = () => {
        const sound = new Audio("static/switch-page-sfx.webm");
        sound.play().catch(() => {});
    };

    window.openPoem = (name) => {
        const index = poems.findIndex(p => p.title.toUpperCase() === name.toUpperCase());
        if (index !== -1) {
            currentPoemIndex = index;
            updatePoemDisplay();
            poemOverlay.classList.add("active");
            openSound.play().catch(() => {});
            startPoemAmbient();
        }
    };

    window.closePoem = () => {
        poemOverlay.classList.remove("active");
        stopPoemAmbient();
    };

    window.prevPoem = () => {
        currentPoemIndex = (currentPoemIndex - 1 + poems.length) % poems.length;
        updatePoemDisplay();
        playSwitchSound();
    };

    window.nextPoem = () => {
        currentPoemIndex = (currentPoemIndex + 1) % poems.length;
        updatePoemDisplay();
        playSwitchSound();
    };

    const updatePoemDisplay = () => {
        const poem = poems[currentPoemIndex];
        poemTitle.textContent = poem.title;
        poemBody.innerHTML = poem.body.split('\n').map(line => `<p>${line || '&nbsp;'}</p>`).join('');
    };

    // Close on overlay click
    poemOverlay.addEventListener("click", (e) => {
        if (e.target === poemOverlay) {
            window.closePoem();
        }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (!poemOverlay.classList.contains("active")) return;
        
        if (e.key === "ArrowLeft") {
            window.prevPoem();
        } else if (e.key === "ArrowRight") {
            window.nextPoem();
        } else if (e.key === "Escape") {
            window.closePoem();
        }
    });
});
