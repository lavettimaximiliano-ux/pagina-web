/* ===================================================
   BITÁCORA DE LABORATORIO 2026 — JS REDISEÑO
   =================================================== */

/* === CUSTOM CURSOR === */
const follower = document.getElementById('cursor-follower');
const dot      = document.getElementById('cursor-dot');

let mx = -100, my = -100, fx = -100, fy = -100;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
});

(function animateCursor() {
    fx += (mx - fx) * 0.14;
    fy += (my - fy) * 0.14;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button, .tarjeta').forEach(el => {
    el.addEventListener('mouseenter', () => {
        follower.style.width  = '36px';
        follower.style.height = '36px';
        follower.style.borderColor = 'var(--amber)';
    });
    el.addEventListener('mouseleave', () => {
        follower.style.width  = '20px';
        follower.style.height = '20px';
        follower.style.borderColor = 'var(--cyan)';
    });
});

/* === HERO PARTICLE CANVAS === */
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.r  = Math.random() * 1.2 + 0.3;
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 229, 255, ${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle());

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 90) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 229, 255, ${0.07 * (1 - dist / 90)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    (function animateParticles() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animateParticles);
    })();
}

/* === TERMINAL TYPING EFFECT === */
const terminalLines = [
    { prefix: '$ ', text: 'init --bitacora "Lavetti_2026"', cls: 'cmd', delay: 40 },
    { prefix: '',   text: 'Cargando módulos de hardware...', cls: 'dim', delay: 25 },
    { prefix: '',   text: '[OK] CPU: AMD Ryzen 5 5600 @ 3.5GHz', cls: 'ok', delay: 20 },
    { prefix: '',   text: '[OK] GPU: NVIDIA RTX 4060 — 8GB GDDR6', cls: 'ok', delay: 20 },
    { prefix: '',   text: '[OK] RAM: 16GB DDR4 Dual Channel', cls: 'ok', delay: 20 },
    { prefix: '',   text: '[OK] SSD: Kingston NV2 M.2 NVMe', cls: 'ok', delay: 20 },
    { prefix: '$ ', text: 'ready_', cls: 'cmd', delay: 60 },
];

const terminalEl = document.getElementById('terminal-output');
if (terminalEl) {
    let lineIndex = 0, charIndex = 0;

    function typeLine() {
        if (lineIndex >= terminalLines.length) return;
        const line = terminalLines[lineIndex];
        const full = line.prefix + line.text;

        if (charIndex === 0) {
            const el = document.createElement('div');
            el.className = 'terminal-line';
            el.id = 'tl-' + lineIndex;
            terminalEl.appendChild(el);
        }

        const el = document.getElementById('tl-' + lineIndex);
        const current = full.slice(0, charIndex + 1);
        el.innerHTML = `<span class="${line.cls}">${current}</span>`;

        charIndex++;
        if (charIndex < full.length) {
            setTimeout(typeLine, line.delay);
        } else {
            lineIndex++;
            charIndex = 0;
            setTimeout(typeLine, 120);
        }
    }

    setTimeout(typeLine, 600);
}

/* === 3D TILT CARDS === */
document.querySelectorAll('.tarjeta').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width  / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `perspective(600px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

/* === SCROLL REVEAL === */
const revealEls = document.querySelectorAll('.tarjeta, .informe-bloque, .caja-destacada, .section-divider');
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = entry.target.style.transform.replace('translateY(24px)', 'translateY(0)');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = (el.style.transform || '') + ' translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    io.observe(el);
});

/* === MODAL SYSTEM === */
const botonAbrir = document.getElementById('btn-diagnostico');
if (botonAbrir) {
    botonAbrir.addEventListener('click', () => {
        document.getElementById('modal-info').showModal();
    });
}

document.querySelectorAll('.btn-abrir-informe').forEach(btn => {
    btn.addEventListener('click', function() {
        const id = this.getAttribute('data-modal');
        const modal = document.getElementById(id);
        if (modal) modal.showModal();
    });
});

document.querySelectorAll('.btn-cerrar-modal').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('dialog').close();
    });
});

document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', e => {
        if (e.target === dialog) dialog.close();
    });
});

/* === THEME TOGGLE === */
const botonTema = document.getElementById('btn-tema');
if (botonTema) {
    botonTema.addEventListener('click', () => {
        document.body.classList.toggle('modo-claro');
        botonTema.textContent = document.body.classList.contains('modo-claro') ? '☾' : '☀';
    });
}

/* === GLITCH DATA-TEXT ATTR === */
document.querySelectorAll('h2').forEach(h => {
    h.setAttribute('data-text', h.textContent);
});

/* === ACTIVE NAV HIGHLIGHT === */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
    });
    navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + current
            ? 'var(--cyan)'
            : '';
    });
}, { passive: true });