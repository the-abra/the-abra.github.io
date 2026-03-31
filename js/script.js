// Register Service Worker for offline support and performance
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed: ', err));
    });
}

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
            body: "Inanis est vertex, et nubila vacua sunt, \nSed in mendacio magno, portum inveni. \nAngeli pugnant ubi nihil est nisi ventus,\nEt dæmones rident in silentio noctis.\n\nHoc bellum fictum mihi finem donat, \nEt fabula vana cor meum erigit. \nO Deus qui non es, \nsub umbra tua quiesco, \nQuia lux veritatis nimis frigida est.\n\nNon est caelum, sed est pax; \nIn sancto mendacio, beatus et fortis ero."
        },
        {
            title: "FIAT",
            body: "Fiat mundus ex lacrimis et somniis,\nUbi nihil erat, nunc exercitus stat.\nMento mihi ut mens non frangatur, \nEt in hac visione, timor perit.\n\nManus mea caelum sculpsit in vacuo, \nEt cor meum daemonem genuit ut pugnet. \nHic est labor meus: vitam fingere, \nUbi mors sola et nuda regnat.\n\nFiat lux ficta, quia vera nox saeva est; \nEgo sum creator dei qui me servat."
        },
        {
            title: "JUSTITIA",
            body: "Non est lex in caelo vacuo, \nSed in mente mea, justitia regnat.\nLibra non peccata, sed somnia ponderat,\nEt praemium est pax in mendacio.\n\nQuid est justum in orbe frigido? \nJustum est ridere ubi mors clamat.\nJustum est fingere regnum ubi desertum est,\nEt amare deum qui non est.\n\nHaec est lex mea, hoc est ius fati: \nMendacium sanctum pro animae salute.\nFiat justitia mea, etiamsi mundus inanis est."
        },
        {
            title: "RUAT",
            body: "Caelum ruit, sed ego non peribo, \nQuia mundus meus in ruderibus vivit. \nVeritas est lapis frigidus et gravis, \nQui omnia somnia conterere vult.\n\nRuat caelum, ruat pax mundi, \nSed fides mea in nihilo me tenet. \nDum omnia cadunt, ego rideo, \nIn asylo mentis, ubi mendacium vincit.\n\nO Deus qui non es, si ruit sedes tua, \nEgo te iterum e pulvere fingam. \nNam sine te, abyssus me devorat; \nCum te, mors sola est fabula parva."
        },
        {
            title: "CAELUM",
            body: "Caelum inane est, sed oculos meos fallit;\nIbi stellas pingo, ne nox sola sit. \nIn altis, angeli et daemones perpetuo certant, \nEt sanguis eorum fictus est vita mea.\n\nO Caelum mendax, o arca mentis meae, \nTu es tegmen contra infinitum frigus. \nNon est numen supra nubila, sed amor fati,\nQui hanc fabulam texit pro me.\n\nHoc est caelum meum: non locus spirituum, \nSed murus contra veritatem saevam. \nIn hoc mendacio, denique respire."
        }
    ];

    let currentPoemIndex = 0;
    const poemOverlay = document.getElementById("poem-overlay");
    const poemTitle = document.getElementById("poem-title");
    const poemBody = document.getElementById("poem-body");
    const openSound = new Audio("static/open-page-sfx.webm");
    const switchSound = new Audio("static/switch-page-sfx.webm");

    window.openPoem = (name) => {
        const index = poems.findIndex(p => p.title.toUpperCase() === name.toUpperCase());
        if (index !== -1) {
            currentPoemIndex = index;
            updatePoemDisplay();
            poemOverlay.classList.add("active");
            openSound.play().catch(() => {});
        }
    };

    window.closePoem = () => {
        poemOverlay.classList.remove("active");
    };

    window.prevPoem = () => {
        currentPoemIndex = (currentPoemIndex - 1 + poems.length) % poems.length;
        updatePoemDisplay();
        switchSound.currentTime = 0;
        switchSound.play().catch(() => {});
    };

    window.nextPoem = () => {
        currentPoemIndex = (currentPoemIndex + 1) % poems.length;
        updatePoemDisplay();
        switchSound.currentTime = 0;
        switchSound.play().catch(() => {});
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
