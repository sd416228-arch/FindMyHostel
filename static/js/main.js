function getCSRFToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue || document.querySelector('[name=csrfmiddlewaretoken]')?.value;
}

const csrftoken = getCSRFToken();

function ajaxRequest(url, method = 'GET', data = null) {
    const options = { method, headers: { 'X-CSRFToken': csrftoken } };
    if (method !== 'GET' && data) {
        if (data instanceof FormData) {
            options.body = data;
        } else {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }
    }
    return fetch(url, options);
}

function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show rounded-3 border-0 shadow-sm`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' || type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        setTimeout(() => alertDiv.remove(), 5000);
    }
}

function formatCurrency(amount) {
    return 'Rs. ' + Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function daysBetween(date1, date2) {
    return Math.ceil(Math.abs(new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24));
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s\-\+\(\)]{10,}$/.test(phone.replace(/\s/g, ''));
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// ===== 1. MOUSE FOLLOWER GLOW =====
function initMouseGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;
        requestAnimationFrame(animate);
    }
    animate();
}

// ===== 2. NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    const navbar = document.querySelector('.fm-navbar');
    if (!navbar) return;

    gsap.to(navbar, {
        boxShadow: '0 4px 30px rgba(26, 86, 219, 0.25)',
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: '80px scroll',
            end: '100px scroll',
            scrub: 0.3,
            toggleActions: 'play reverse play reverse'
        }
    });
}

// ===== 3. HERO TEXT SPLIT ANIMATION =====
function initHeroReveal() {
    const hero = document.querySelector('.fm-hero');
    if (!hero) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(hero.querySelector('.rounded-pill'),
        { opacity: 0, y: -15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 }
    )
    .fromTo(hero.querySelector('h1'),
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.3'
    )
    .fromTo(hero.querySelector('h1 strong'),
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.5 },
        '-=0.4'
    )
    .fromTo(hero.querySelector('p'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
    )
    .fromTo(hero.querySelector('.fm-search-bar'),
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 },
        '-=0.3'
    );
}

// ===== 4. PREMIUM SCROLL REVEALS =====
function initScrollReveals() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    elements.forEach(el => {
        const dir = el.dataset.reveal || 'up';
        const vars = {
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        };
        if (dir === 'left') vars.x = -50;
        else if (dir === 'right') vars.x = 50;
        else if (dir === 'scale') { vars.scale = 0.9; vars.y = 20; }
        else vars.y = 40;

        gsap.fromTo(el, vars, {
            opacity: 1,
            x: 0, y: 0, scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 82%',
                toggleActions: 'play none none none',
                once: true
            }
        });
    });
}

// ===== 5. STAGGER CARDS WITH SKEW =====
function initCardStagger() {
    const cards = gsap.utils.toArray('.fm-hostel-card');
    if (!cards.length) return;

    cards.forEach((card, i) => {
        gsap.fromTo(card, {
            opacity: 0, y: 50, skewY: 2
        }, {
            opacity: 1, y: 0, skewY: 0,
            duration: 0.7, delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card.closest('.row') || card,
                start: 'top 78%',
                toggleActions: 'play none none none',
                once: true
            }
        });
    });
}

// ===== 6. STAGGER FEATURES =====
function animateFeatures() {
    const features = gsap.utils.toArray('#why-choose .col-md-6');
    if (!features.length) return;

    features.forEach((f, i) => {
        gsap.fromTo(f, {
            opacity: 0, x: i % 2 === 0 ? -30 : 30, y: 20
        }, {
            opacity: 1, x: 0, y: 0,
            duration: 0.6, delay: i * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: f.closest('#why-choose'),
                start: 'top 65%',
                toggleActions: 'play none none none',
                once: true
            }
        });
    });
}

// ===== 7. STEPS CONNECTED ANIMATION =====
function animateSteps() {
    const steps = gsap.utils.toArray('#how-it-works .col-md-4');
    if (!steps.length) return;

    steps.forEach((step, i) => {
        gsap.fromTo(step, {
            opacity: 0, y: 40, scale: 0.95
        }, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6, delay: i * 0.18,
            ease: 'back.out(1.4)',
            scrollTrigger: {
                trigger: step.closest('#how-it-works'),
                start: 'top 68%',
                toggleActions: 'play none none none',
                once: true
            }
        });
    });
}

// ===== 8. TESTIMONIAL WITH ROTATION =====
function animateTestimonial() {
    const note = document.querySelector('.sticky-note-container');
    if (!note) return;

    gsap.fromTo(note, {
        opacity: 0, scale: 0.85, rotation: -3
    }, {
        opacity: 1, scale: 1, rotation: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: note.closest('#reviews'),
            start: 'top 72%',
            toggleActions: 'play none none none',
            once: true
        }
    });
}

// ===== 9. PARALLAX HERO =====
function initHeroParallax() {
    const hero = document.querySelector('.fm-hero');
    if (!hero) return;

    gsap.to(hero, {
        backgroundPosition: '50% 25%',
        ease: 'none',
        scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2
        }
    });
}

// ===== 10. COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        if (isNaN(target)) return;
        const obj = { val: 0 };
        gsap.to(obj, {
            val: target, duration: 2.5, ease: 'power3.out',
            scrollTrigger: {
                trigger: counter,
                start: 'top 85%',
                toggleActions: 'play none none none',
                once: true
            },
            onUpdate: () => { counter.textContent = Math.round(obj.val); }
        });
    });
}

// ===== 11. BACKGROUND PARTICLE EFFECT (FULL PAGE) =====
function initParticles() {
    if (window.innerWidth < 768) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'fm-particle-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.4 + 0.1
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===== 12. MAGNETIC BUTTONS =====
function initMagneticButtons() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// ===== 13. SMOOTH SECTION LINK SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== 14. IMAGE LAZY LOAD WITH BLUR =====
function initLazyImages() {
    document.querySelectorAll('img[data-src]').forEach(img => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                img.src = img.dataset.src;
                img.style.filter = 'blur(10px)';
                img.style.transition = 'filter 0.5s ease';
                img.onload = () => img.style.filter = 'blur(0)';
                observer.unobserve(img);
            }
        }, { rootMargin: '200px' });
        observer.observe(img);
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function () {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));

    initSmoothScroll();

    if (typeof gsap !== 'undefined') {
        initHeroReveal();
        initScrollReveals();
        initCardStagger();
        animateFeatures();
        animateSteps();
        animateTestimonial();
        animateCounters();
        initHeroParallax();
        initNavbarScroll();
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        initParticles();
        initMagneticButtons();
    }
});

console.log('FindMy Hostel JavaScript loaded');