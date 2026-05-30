/* ============================================================
   Square Root Solutions — Shared site behaviour
   Nav (mobile + active state), scroll-reveal, smooth scroll,
   FAQ, and demo lead-form handling. Loaded by every page.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Mark active nav item by current file ---------- */
  function markActiveNav() {
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav.links a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      var file = href.split('#')[0].split('/').pop();
      if (file === path) {
        a.classList.add('active');
        var item = a.closest('.nav-item');
        if (item) {
          var top = item.querySelector(':scope > a');
          if (top && top !== a) top.classList.add('active');
        }
      }
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  function initMobileNav() {
    var header = document.querySelector('header.site .nav');
    var links = document.querySelector('header.site nav.links');
    if (!header || !links) return;
    if (header.querySelector('.menu-toggle')) return;

    var btn = document.createElement('button');
    btn.className = 'menu-toggle';
    btn.setAttribute('aria-label', 'Toggle menu');
    btn.innerHTML = '<span></span><span></span><span></span>';
    header.appendChild(btn);

    btn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      btn.classList.toggle('open', open);
      document.body.classList.toggle('nav-open', open);
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        btn.classList.remove('open');
        document.body.classList.remove('nav-open');
      });
    });
    // On mobile, tapping a top-level dropdown label expands it instead of navigating
    links.querySelectorAll('.nav-item > a .caret').forEach(function (caret) {
      var a = caret.closest('a');
      a.addEventListener('click', function (e) {
        if (window.matchMedia('(max-width: 980px)').matches) {
          var dd = a.parentElement.querySelector('.dropdown');
          if (dd) { e.preventDefault(); a.parentElement.classList.toggle('expanded'); }
        }
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var revealSelectors = [
      '.section-head > *', '.q-card', '.who-card', '.industry', '.why-row',
      '.step', '.ready-cta', '.faq-item', '.price-card', '.blog-card',
      '.case-card', '.tech-tile', '.stat-strip', '.split > *', '.logo-strip'
    ];
    revealSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        if (el.classList.contains('reveal')) return;
        el.classList.add('reveal');
        var d = (i % 4) + 1;
        if (d > 1) el.classList.add('delay-' + d);
      });
    });

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }

  /* ---------- Smooth scroll for in-page anchors ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        if (!id) return;
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ---------- Demo lead form (no backend) ---------- */
  function initForms() {
    document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        form.querySelectorAll('[required]').forEach(function (el) {
          if (!el.value.trim()) { el.style.borderColor = '#ff7a7a'; ok = false; }
          else { el.style.borderColor = ''; }
        });
        if (!ok) return;
        var success = form.querySelector('.form-success');
        if (success) {
          Array.prototype.forEach.call(form.children, function (c) {
            if (c !== success) c.style.display = 'none';
          });
          success.classList.add('show');
          success.style.display = '';
        } else {
          form.innerHTML = '<div class="form-success show" style="display:block"><h3>Thanks — message received.</h3><p>We\u2019ll be in touch within one business day to arrange your discovery call.</p></div>';
        }
      });
    });
  }

  /* ---------- Year stamp ---------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- Global ambient aurora background ---------- */
  function initAurora() {
    if (document.querySelector('.site-aurora')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var a = document.createElement('div');
    a.className = 'site-aurora';
    a.setAttribute('aria-hidden', 'true');
    a.innerHTML = '<b></b><b></b><b></b><b></b>';
    document.body.insertBefore(a, document.body.firstChild);
  }

  /* ---------- Per-section drifting colour glow ---------- */
  function initSecGlow() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var pairs = [
      ['rgba(34,86,255,.30)',  'rgba(124,58,237,.24)'],
      ['rgba(6,182,212,.26)',  'rgba(34,86,255,.24)'],
      ['rgba(124,58,237,.26)', 'rgba(192,38,211,.20)'],
      ['rgba(13,148,136,.24)', 'rgba(6,182,212,.22)'],
      ['rgba(245,158,11,.22)', 'rgba(225,29,72,.18)'],
      ['rgba(225,29,72,.20)',  'rgba(124,58,237,.22)']
    ];
    document.querySelectorAll('section.s:not(.dark)').forEach(function (sec, i) {
      if (sec.querySelector('.sec-glow')) return;
      var g = document.createElement('div');
      g.className = 'sec-glow';
      g.setAttribute('aria-hidden', 'true');
      var pair = pairs[i % pairs.length];
      var alt = i % 2 === 1;
      g.style.setProperty('--gc', pair[0]);
      g.style.setProperty('--gc2', pair[1]);
      g.style.setProperty('--gx', (alt ? '60%' : '-12%'));
      g.style.setProperty('--gy', (alt ? '-30%' : '-20%'));
      g.style.setProperty('--gx2', (alt ? '-8%' : '-10%'));
      g.style.setProperty('--gy2', (alt ? '-15%' : '-22%'));
      g.style.setProperty('--gd', (24 + (i % 4) * 4) + 's');
      g.style.setProperty('--gd2', (30 + (i % 3) * 5) + 's');
      sec.insertBefore(g, sec.firstChild);
    });
  }

  /* ---------- Constellation particle network ---------- */
  function initParticles() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (document.querySelector('.site-particles')) return;
    var canvas = document.createElement('canvas');
    canvas.className = 'site-particles';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(canvas, document.body.firstChild);
    var ctx = canvas.getContext('2d');

    var palette = [
      [34, 86, 255], [124, 58, 237], [13, 148, 136],
      [225, 29, 72], [245, 158, 11], [6, 182, 212]
    ];
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, particles = [], linkDist = 150;
    var mouse = { x: -9999, y: -9999, active: false };

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var target = Math.round(Math.min(110, (W * H) / 15000));
      particles = [];
      for (var i = 0; i < target; i++) {
        var c = palette[i % palette.length];
        particles.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: 1.3 + Math.random() * 2.0, c: c
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
        // node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.c[0] + ',' + p.c[1] + ',' + p.c[2] + ',0.72)';
        ctx.fill();
      }
      // links
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var pa = particles[a], pb = particles[b];
          var dx = pa.x - pb.x, dy = pa.y - pb.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            var d = Math.sqrt(d2);
            var alpha = (1 - d / linkDist) * 0.62;
            ctx.strokeStyle = 'rgba(' + pa.c[0] + ',' + pa.c[1] + ',' + pa.c[2] + ',' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
          }
        }
      }
      // mouse links + gentle attraction
      if (mouse.active) {
        for (var m = 0; m < particles.length; m++) {
          var pm = particles[m];
          var mdx = pm.x - mouse.x, mdy = pm.y - mouse.y;
          var md2 = mdx * mdx + mdy * mdy;
          var mr = 190;
          if (md2 < mr * mr) {
            var mdv = Math.sqrt(md2) || 1;
            var ma = (1 - mdv / mr) * 0.6;
            ctx.strokeStyle = 'rgba(' + pm.c[0] + ',' + pm.c[1] + ',' + pm.c[2] + ',' + ma.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(pm.x, pm.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
            // subtle drift toward cursor
            pm.vx += (-mdx / mdv) * 0.006;
            pm.vy += (-mdy / mdv) * 0.006;
          }
          // damp velocity so it never runs away
          pm.vx *= 0.995; pm.vy *= 0.995;
          if (Math.abs(pm.vx) < 0.05) pm.vx += (Math.random() - 0.5) * 0.02;
          if (Math.abs(pm.vy) < 0.05) pm.vy += (Math.random() - 0.5) * 0.02;
        }
      }
      raf = requestAnimationFrame(step);
    }

    var raf = 0;
    function start() { if (!raf) raf = requestAnimationFrame(step); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; }, { passive: true });
    window.addEventListener('mouseout', function () { mouse.active = false; mouse.x = mouse.y = -9999; });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });

    resize();
    start();
  }

  function init() {
    initAurora();
    initParticles();
    initSecGlow();
    markActiveNav();
    initMobileNav();
    initReveal();
    initSmoothScroll();
    initForms();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
