/* PDC Builders — interactions */
(function () {
  'use strict';

  // year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // sticky header
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // fullscreen drop-down menu
  var menuBtn = document.getElementById('menu-btn');
  var menuPanel = document.getElementById('menu-panel');
  function closeMenu() {
    document.body.classList.remove('menu-open');
    document.documentElement.style.overflow = '';
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    if (menuPanel) menuPanel.setAttribute('aria-hidden', 'true');
  }
  function openMenu() {
    document.body.classList.add('menu-open');
    document.documentElement.style.overflow = 'hidden';
    menuBtn.setAttribute('aria-expanded', 'true');
    menuPanel.setAttribute('aria-hidden', 'false');
  }
  if (menuBtn && menuPanel) {
    menuBtn.addEventListener('click', function () {
      document.body.classList.contains('menu-open') ? closeMenu() : openMenu();
    });
    menuPanel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  // hero slider (crossfade) with dots, arrows, caption, autoplay
  var slides = Array.prototype.slice.call(document.querySelectorAll('#hero-slides .slide'));
  if (slides.length > 1) {
    var dots = Array.prototype.slice.call(document.querySelectorAll('#hero-dots button'));
    var caption = document.getElementById('hero-caption');
    var s = 0, timer;
    function go(n) {
      slides[s].classList.remove('active');
      if (dots[s]) dots[s].classList.remove('on');
      s = (n + slides.length) % slides.length;
      slides[s].classList.add('active');
      if (dots[s]) dots[s].classList.add('on');
      if (caption) caption.textContent = slides[s].getAttribute('data-caption') || '';
    }
    function reset() { clearInterval(timer); timer = setInterval(function () { go(s + 1); }, 5500); }
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); reset(); }); });
    var prev = document.querySelector('.hero-prev');
    var next = document.querySelector('.hero-next');
    if (prev) prev.addEventListener('click', function () { go(s - 1); reset(); });
    if (next) next.addEventListener('click', function () { go(s + 1); reset(); });
    reset();
  }

  // parallax (Rellax-style) — maps to Webflow "while scrolling in view → move"
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var parEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (parEls.length && !reduceMotion) {
    var ticking = false;
    var updatePar = function () {
      var vh = window.innerHeight;
      parEls.forEach(function (el) {
        var box = el.parentElement.getBoundingClientRect();
        if (box.bottom < -120 || box.top > vh + 120) return;
        var center = box.top + box.height / 2;
        var prog = Math.max(-1.2, Math.min(1.2, (center - vh / 2) / vh));
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        el.style.transform = 'translate3d(0,' + (-prog * speed * 100).toFixed(2) + 'px,0)';
      });
      ticking = false;
    };
    var onPar = function () { if (!ticking) { requestAnimationFrame(updatePar); ticking = true; } };
    window.addEventListener('scroll', onPar, { passive: true });
    window.addEventListener('resize', onPar);
    updatePar();
  }

  // scroll reveal
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal, .stagger').forEach(function (el) { io.observe(el); });

  // featured residence scroller
  var scroller = document.getElementById('scroller');
  if (scroller) {
    var step = function () {
      var card = scroller.querySelector('.card');
      return card ? card.getBoundingClientRect().width + 22 : 340;
    };
    var prev = document.getElementById('feat-prev');
    var next = document.getElementById('feat-next');
    if (next) next.addEventListener('click', function () { scroller.scrollBy({ left: step(), behavior: 'smooth' }); });
    if (prev) prev.addEventListener('click', function () { scroller.scrollBy({ left: -step(), behavior: 'smooth' }); });
  }

  // ---------- lightbox ----------
  var figures = Array.prototype.slice.call(document.querySelectorAll('.card'));
  var items = figures.map(function (f) {
    return { full: f.getAttribute('data-full'), alt: f.querySelector('img').alt };
  });
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  var lbCount = lb.querySelector('.lb-count');
  var idx = 0;

  function show(i) {
    idx = (i + items.length) % items.length;
    lbImg.src = items[idx].full;
    lbImg.alt = items[idx].alt;
    lbCount.textContent = (idx + 1) + ' / ' + items.length;
  }
  function openLb(i) { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }

  figures.forEach(function (f, i) { f.addEventListener('click', function () { openLb(i); }); });
  lb.querySelector('.lb-close').addEventListener('click', closeLb);
  lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
  });

  // ---------- demo contact form ----------
  var form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = form.querySelector('.form-ok');
      ok.classList.add('show');
      form.querySelectorAll('input,select,textarea,button').forEach(function (el) { el.disabled = true; });
      ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
})();
