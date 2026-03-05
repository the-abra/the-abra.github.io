document.addEventListener("DOMContentLoaded", () => {
    const hoverSound = new Audio("static/hover.webm");
    const clickSound = new Audio("static/click.webm");
    hoverSound.load();
    clickSound.load();

    const unlockAudio = () => {
        hoverSound.volume = 0;
        hoverSound.play().then(() => {
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("touchstart", unlockAudio);
            document.removeEventListener("keydown", unlockAudio);

            const overlay = document.getElementById("privilege-overlay");
            if (overlay) {
                overlay.classList.add("hidden");
                setTimeout(() => overlay.remove(), 800);
            }
        }).catch(() => { });
    };

    document.addEventListener("click", unlockAudio, { passive: true });
    document.addEventListener("touchstart", unlockAudio, { passive: true });
    document.addEventListener("keydown", unlockAudio, { passive: true });

    const playHover = () => {
        hoverSound.currentTime = 0;
        hoverSound.volume = .25;
        hoverSound.play().catch(() => { })
    };

    const playClick = () => {
        clickSound.currentTime = 0;
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

    if (window.lucide) {
        lucide.createIcons();
    }
    addAudioListeners();
});
