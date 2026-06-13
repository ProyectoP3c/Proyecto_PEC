const menuIcon = document.querySelector('.menu-icon');
const nav      = document.querySelector('nav');

menuIcon.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuIcon.textContent = nav.classList.contains('active') ? '✖' : '☰';
});

nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuIcon.textContent = '☰';
    });
});

const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav a');

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

document.querySelectorAll('.Inicio-img').forEach(el => {
    el.classList.add('reveal-left');
});
document.querySelectorAll('.Inicio-content').forEach((el, i) => {
    el.classList.add('reveal-right');
});
document.querySelectorAll('.Inicio-content h1').forEach(el => el.classList.add('reveal', 'reveal-delay-1'));
document.querySelectorAll('.Inicio-content h3').forEach(el => el.classList.add('reveal-delay-2'));
document.querySelectorAll('.Inicio-content p').forEach(el => el.classList.add('reveal-delay-3'));

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
});

document.querySelectorAll('#inicio .reveal, #inicio .reveal-left, #inicio .reveal-right').forEach(el => {
    el.classList.add('visible');
});

(function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let W, H, particles = [];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function Particle() {
        this.reset();
    }

    Particle.prototype.reset = function() {
        this.x     = Math.random() * W;
        this.y     = Math.random() * H;
        this.r     = Math.random() * 1.4 + 0.3;
        this.speed = Math.random() * 0.3 + 0.05;
        this.angle = Math.random() * Math.PI * 2;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.drift = (Math.random() - 0.5) * 0.008;
    };

    Particle.prototype.update = function() {
        this.angle += this.drift;
        this.x += Math.cos(this.angle) * this.speed;
        this.y -= this.speed * 0.6;
        if (this.y < -5 || this.x < -5 || this.x > W + 5) this.reset();
    };

    function init() {
        resize();
        particles = Array.from({ length: 80 }, () => new Particle());
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.update();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(41,145,41,${p.alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    init();
    draw();
})();

const heroImg = document.querySelector('#inicio .Inicio-img img');
if (heroImg) {
    document.addEventListener('mousemove', e => {
        const cx = window.innerWidth  / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        heroImg.style.transform = `scale(1) translate(${dx * 8}px, ${dy * 6}px)`;
    });

    document.addEventListener('mouseleave', () => {
        heroImg.style.transform = '';
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', function () {
        navLinks.forEach(a => a.classList.remove('active'));
        this.classList.add('active');
    });
});

(function initCarrusel() {
    const stage  = document.getElementById('carrusel-stage');
    const slides = stage ? Array.from(stage.querySelectorAll('.carrusel-slide')) : [];
    if (!slides.length) return;

    const dotsContainer = document.getElementById('carrusel-dots');
    const btnPrev = document.getElementById('carrusel-prev');
    const btnNext = document.getElementById('carrusel-next');
    const total   = slides.length;
    let current   = 0;
    let timer     = null;
    const INTERVAL = 3800;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carrusel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
        dot.addEventListener('click', () => { goTo(i); resetTimer(); });
        dotsContainer.appendChild(dot);
    });

    slides.forEach((slide, i) => {
        slide.addEventListener('click', () => {
            const pos = getPos(i);
            if (pos === 1)  { goTo(current + 1); resetTimer(); }
            if (pos === -1) { goTo(current - 1); resetTimer(); }
        });
    });

    function getPos(slideIndex) {
        let d = slideIndex - current;
        if (d >  total / 2) d -= total;
        if (d < -total / 2) d += total;
        return d;
    }

    function render() {
        slides.forEach((slide, i) => {
            let pos = getPos(i);
            if (pos >  3) pos =  3;
            if (pos < -3) pos = -3;
            slide.setAttribute('data-pos', pos);
        });
        Array.from(dotsContainer.children).forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });
    }

    function goTo(index) {
        current = ((index % total) + total) % total;
        render();
    }

    function resetTimer() {
        clearInterval(timer);
        autoPlay();
    }

    function autoPlay() {
        timer = setInterval(() => goTo(current + 1), INTERVAL);
    }

    stage.addEventListener('mouseenter', () => clearInterval(timer));
    stage.addEventListener('mouseleave', autoPlay);

    btnPrev.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
    btnNext.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft')  { goTo(current - 1); resetTimer(); }
        if (e.key === 'ArrowRight') { goTo(current + 1); resetTimer(); }
    });

    let touchStartX = 0;
    stage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            diff > 0 ? goTo(current + 1) : goTo(current - 1);
            resetTimer();
        }
    });

    goTo(0);
    autoPlay();
})();