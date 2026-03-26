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
});
