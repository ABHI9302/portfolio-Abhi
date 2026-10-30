(function () {
    'use strict';
    document.documentElement.classList.add('js');

    var header = document.getElementById('header');
    var navbar = document.getElementById('navbar');
    var menuBtn = document.getElementById('menuBtn');
    var toTop = document.getElementById('toTop');
    var navLinks = Array.prototype.slice.call(navbar.querySelectorAll('a'));

    /* ---- Mobile menu ---- */
    function setMenu(open) {
        navbar.classList.toggle('open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    }
    menuBtn.addEventListener('click', function () { setMenu(!navbar.classList.contains('open')); });
    navLinks.forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); closeLightbox(); } });

    /* ---- Header shadow + back to top ---- */
    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 10);
        toTop.classList.toggle('show', window.scrollY > 500);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    /* ---- Active nav link on scroll ---- */
    var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    if ('IntersectionObserver' in window) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    navLinks.forEach(function (a) {
                        a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
                    });
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(function (s) { if (s) spy.observe(s); });
    }

    /* ---- Scroll reveal (falls back to visible if observer unsupported) ---- */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
            });
        }, { threshold: 0.12 });
        reveals.forEach(function (el, i) {
            el.style.transitionDelay = (i % 4) * 70 + 'ms';
            io.observe(el);
        });
    } else {
        reveals.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---- Typing effect ---- */
    var typedEl = document.getElementById('typed');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typedEl && !reduce) {
        var words = ['Java Full Stack Developer', 'Spring Boot Developer', 'React.js Developer', 'Problem Solver'];
        var w = 0, c = 0, del = false;
        (function tick() {
            var word = words[w];
            typedEl.textContent = word.slice(0, c);
            if (!del && c < word.length) { c++; return setTimeout(tick, 85); }
            if (!del) { del = true; return setTimeout(tick, 1600); }
            if (c > 0) { c--; return setTimeout(tick, 40); }
            del = false; w = (w + 1) % words.length; setTimeout(tick, 300);
        })();
    }

    /* ---- Certificate lightbox ---- */
    var lb = document.getElementById('lightbox');
    var lbImg = document.getElementById('lbImg');
    var lbCap = document.getElementById('lbCap');
    var lastFocus = null;
    function openLightbox(src, title) {
        lastFocus = document.activeElement;
        lbImg.src = src; lbImg.alt = title + ' certificate'; lbCap.textContent = title;
        lb.hidden = false; document.body.style.overflow = 'hidden';
        document.getElementById('lbClose').focus();
    }
    function closeLightbox() {
        if (lb.hidden) return;
        lb.hidden = true; lbImg.src = ''; document.body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
    }
    document.querySelectorAll('.cert').forEach(function (btn) {
        btn.addEventListener('click', function () { openLightbox(btn.dataset.full, btn.dataset.title); });
    });
    document.getElementById('lbClose').addEventListener('click', closeLightbox);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });

    /* ---- Contact form: validates, then opens the visitor's email app ---- */
    var form = document.getElementById('contactForm');
    var note = document.getElementById('formNote');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = form.name.value.trim(), email = form.email.value.trim(), msg = form.message.value.trim();
        note.className = 'form-note';
        if (!name || !email || !msg) { note.textContent = 'Please fill in all fields.'; note.classList.add('err'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { note.textContent = 'Please enter a valid email address.'; note.classList.add('err'); return; }
        var subject = encodeURIComponent('Portfolio enquiry from ' + name);
        var body = encodeURIComponent(msg + '\n\n— ' + name + ' (' + email + ')');
        window.location.href = 'mailto:abhishek.yadav.ghaziabad@gmail.com?subject=' + subject + '&body=' + body;
        note.textContent = 'Opening your email app… thank you!'; note.classList.add('ok');
        form.reset();
    });

    /* ---- Footer year ---- */
    var yr = document.getElementById('year');
    if (yr) yr.textContent = new Date().getFullYear();
})();
