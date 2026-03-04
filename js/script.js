document.addEventListener("DOMContentLoaded", () => {
    const hoverSound = new Audio("static/hover.webm");
    const clickSound = new Audio("static/click.webm");
    hoverSound.load();
    clickSound.load();

    const unlockAudio = () => {
        const sound = hoverSound.cloneNode(true);
        sound.volume = 0; // Silent playback to satisfy policy
        sound.play().then(() => {
            // Success! Remove the unlock listeners
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("touchstart", unlockAudio);
            document.removeEventListener("keydown", unlockAudio);

            // Hide and remove the overlay
            const overlay = document.getElementById("privilege-overlay");
            if (overlay) {
                overlay.classList.add("hidden");
                setTimeout(() => overlay.remove(), 800);
            }
        }).catch(() => { });
    };

    document.addEventListener("click", unlockAudio);
    document.addEventListener("touchstart", unlockAudio);
    document.addEventListener("keydown", unlockAudio);

    const playHover = () => {
        const sound = hoverSound.cloneNode(true);
        sound.volume = .5;
        sound.play().catch(() => { })
    };

    const playClick = () => {
        const sound = clickSound.cloneNode(true);
        sound.play().catch(() => { })
    };

    const addAudioListeners = () => {
        document.querySelectorAll("button, a").forEach(el => {
            if (!el.dataset.audioBound) {
                el.addEventListener("mouseenter", playHover);
                el.addEventListener("click", playClick);
                el.dataset.audioBound = "true"
            }
        });
        document.querySelectorAll(".card").forEach(el => {
            if (!el.dataset.audioBound) {
                el.addEventListener("mouseenter", playHover);
                el.dataset.audioBound = "true"
            }
        })
    };

    addAudioListeners();

    const canvas = document.getElementById("constellation-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        const particleCount = 100;
        const maxDistance = 150;
        let width, height;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight
        };
        window.addEventListener("resize", resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - .5) * .3;
                this.vy = (Math.random() - .5) * .3;
                this.radius = Math.random() * 2;
                this.baseOpacity = Math.random() * .5 + .2;
                this.opacity = this.baseOpacity;
                this.twinkleSpeed = Math.random() * .02 + .005;
                const colors = ["rgba(255, 201, 71, ", "rgba(224, 224, 224, ", "rgba(255, 255, 255, "];
                this.colorBase = colors[Math.floor(Math.random() * colors.length)]
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
                this.opacity = this.baseOpacity + Math.sin(Date.now() * this.twinkleSpeed) * .2
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.colorBase + this.opacity + ")";
                ctx.fill();
                if (this.opacity > .5) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = this.colorBase + "0.5)"
                } else {
                    ctx.shadowBlur = 0
                }
            }
        }

        const init = () => {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle)
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p, i) => {
                p.update();
                p.draw();
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDistance) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        const lineOpacity = .15 * (1 - dist / maxDistance);
                        ctx.strokeStyle = `rgba(255, 201, 71, ${lineOpacity})`;
                        ctx.lineWidth = .4;
                        ctx.stroke()
                    }
                }
            });
            requestAnimationFrame(animate)
        };

        init();
        animate()
    }

    const progressBar = document.getElementById("scroll-progress");
    window.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = window.scrollY / totalHeight * 100;
        if (progressBar) {
            progressBar.style.width = scrollPercent + "%" }
    });

    const nav = document.querySelector(".nav");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            nav.style.padding = "1rem 0";
            nav.style.background = "rgba(10, 25, 49, 0.6)";
            nav.style.backdropFilter = "blur(25px) saturate(180%)";
            nav.style.boxShadow = "0 5px 20px rgba(0,0,0,0.3)"
        } else {
            nav.style.padding = "1.5rem 0";
            nav.style.background = "rgba(10, 25, 49, 0.4)";
            nav.style.backdropFilter = "blur(25px) saturate(180%)";
            nav.style.boxShadow = "none"
        }
    });

    if (window.lucide) {
        lucide.createIcons();
        addAudioListeners()
    }
});
