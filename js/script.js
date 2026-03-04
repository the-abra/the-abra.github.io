/* 
    Celestial Background & Portfolio Logic
*/

document.addEventListener('DOMContentLoaded', () => {
  // 0. Audio Pre-caching & Logic
  const hoverSound = new Audio('static/hover.mp3');
  const clickSound = new Audio('static/click.mp3');
  
  // Pre-load sounds
  hoverSound.load();
  clickSound.load();

  const playHover = () => {
    const sound = hoverSound.cloneNode(true);
    sound.volume = 0.5; // Optional: slightly lower volume for hover
    sound.play().catch(() => {});
  };

  const playClick = () => {
    const sound = clickSound.cloneNode(true);
    sound.play().catch(() => {});
  };

  // Add listeners to all interactive elements
  const addAudioListeners = () => {
    // Buttons and links get both hover and click sounds
    document.querySelectorAll('button, a').forEach(el => {
      if (!el.dataset.audioBound) {
        el.addEventListener('mouseenter', playHover);
        el.addEventListener('click', playClick);
        el.dataset.audioBound = 'true';
      }
    });

    // Cards only get the hover sound
    document.querySelectorAll('.card').forEach(el => {
      if (!el.dataset.audioBound) {
        el.addEventListener('mouseenter', playHover);
        el.dataset.audioBound = 'true';
      }
    });
  };

  addAudioListeners();

  // 1. Particle System (Constellations)
  const canvas = document.getElementById('constellation-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 100;
    const maxDistance = 150;

    let width, height;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 2;
        this.baseOpacity = Math.random() * 0.5 + 0.2;
        this.opacity = this.baseOpacity;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        
        const colors = [
          'rgba(255, 201, 71, ', // Gold
          'rgba(224, 224, 224, ', // Silver
          'rgba(255, 255, 255, '  // White
        ];
        this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Twinkle effect
        this.opacity = this.baseOpacity + Math.sin(Date.now() * this.twinkleSpeed) * 0.2;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.colorBase + this.opacity + ')';
        ctx.fill();
        
        if (this.opacity > 0.5) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.colorBase + '0.5)';
        } else {
            ctx.shadowBlur = 0;
        }
      }
    }

    const init = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
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
            const lineOpacity = 0.15 * (1 - dist / maxDistance);
            ctx.strokeStyle = `rgba(255, 201, 71, ${lineOpacity})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };

    init();
    animate();
  }

  // 1.5 Scroll Progress Tracker
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (window.scrollY / totalHeight) * 100;
    if (progressBar) {
      progressBar.style.width = scrollPercent + '%';
    }
  });

  // 2. Navigation Scroll Effect
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.padding = '1rem 0';
      nav.style.background = 'rgba(10, 25, 49, 0.6)';
      nav.style.backdropFilter = 'blur(25px) saturate(180%)';
      nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
    } else {
      nav.style.padding = '1.5rem 0';
      nav.style.background = 'rgba(10, 25, 49, 0.4)';
      nav.style.backdropFilter = 'blur(25px) saturate(180%)';
      nav.style.boxShadow = 'none';
    }
  });

  // 3. Lucide Icons Logic
  if (window.lucide) {
    lucide.createIcons();
    // After icons are created, some links/buttons might be added, update listeners
    addAudioListeners();
  }
});