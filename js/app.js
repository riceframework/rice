/* RICE site behaviour — vanilla JS, no dependencies */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- hero entrance ---------- */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('loaded'); });
  });

  /* ---------- site background: HLS video with particle-network fallback ----------
     THE STREAM — swap the playback URL here to audition each option:
       1. https://stream.mux.com/Si6ej2ZRrxRCnTYBXSScDRCdd7CGnyTqiPszZcw3z4I.m3u8
       2. https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8
       3. https://stream.mux.com/01yW6GoUz01OTXk5w1Rt1MHkJWlCGIwj46SUONJZ4DJUE.m3u8
       4. https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8
       5. https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8 */
  var STREAM_URL = 'https://stream.mux.com/Si6ej2ZRrxRCnTYBXSScDRCdd7CGnyTqiPszZcw3z4I.m3u8';
  var HLS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.13/hls.min.js';

  function startParticles() {
    var canvas = document.getElementById('netbg');
    if (!canvas || canvas.dataset.running) return;
    canvas.dataset.running = '1';
    var stage = canvas.closest('.sitebg');
    if (stage) stage.classList.add('fallback');
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, nodes = [], running = true, raf = null, last = 0;
    var mobile = window.matchMedia('(max-width:1023px)').matches;
    var COUNT = mobile ? 34 : 64;
    var LINK = mobile ? 110 : 150;

    function size() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() {
      nodes = [];
      for (var i = 0; i < COUNT; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
          r: 1 + Math.random() * 1.4
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            var alpha = (1 - d / LINK) * 0.16;
            ctx.strokeStyle = 'rgba(201,168,76,' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        ctx.fillStyle = 'rgba(220,200,140,0.5)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    function step(now) {
      if (!running) return;
      raf = requestAnimationFrame(step);
      if (now - last < 33) return;
      last = now;
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < -10) n.x = W + 10; if (n.x > W + 10) n.x = -10;
        if (n.y < -10) n.y = H + 10; if (n.y > H + 10) n.y = -10;
      }
      draw();
    }
    size(); seed();
    if (reduced) { draw(); return; }
    raf = requestAnimationFrame(step);
    window.addEventListener('resize', function () { size(); seed(); if (reduced) draw(); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { running = false; if (raf) cancelAnimationFrame(raf); }
      else { running = true; last = 0; raf = requestAnimationFrame(step); }
    });
  }

  (function initSiteBg() {
    var video = document.getElementById('bgvid');
    if (!video) return;
    if (reduced) { video.remove(); startParticles(); return; }

    var settled = false;
    function fallback() {
      if (settled) return; settled = true;
      try { video.remove(); } catch (e) {}
      /* fallback chain: 3D constellation (three.js) → 2D canvas particles */
      var ok = false;
      try { ok = !!(window.RICE3D && window.RICE3D.start()); } catch (e) { ok = false; }
      if (!ok) {
        if (window.RICE3D) { startParticles(); }
        else {
          var timer = setTimeout(function () { startParticles(); }, 1200);
          document.addEventListener('rice:3dready', function () {
            clearTimeout(timer);
            var ok2 = false;
            try { ok2 = !!window.RICE3D.start(); } catch (e) { ok2 = false; }
            if (!ok2) startParticles();
          }, { once: true });
        }
      }
    }
    function live() {
      if (settled) return; settled = true;
      video.classList.add('live');
    }
    video.addEventListener('playing', live);
    video.addEventListener('error', fallback);
    setTimeout(function () { if (!settled) fallback(); }, 6000); // network hang guard

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = STREAM_URL;
      video.play().catch(function () { /* playing/error events decide */ });
    } else {
      var s = document.createElement('script');
      s.src = HLS_CDN;
      s.onload = function () {
        try {
          if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ capLevelToPlayerSize: true, autoStartLoad: true });
            hls.loadSource(STREAM_URL);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.ERROR, function (ev, data) {
              if (data && data.fatal) fallback();
            });
            video.play().catch(function () {});
          } else { fallback(); }
        } catch (e) { fallback(); }
      };
      s.onerror = fallback;
      document.head.appendChild(s);
    }
  })();

  /* ---------- glass menu popover ---------- */
  (function initGlassMenu() {
    var openBtn = document.getElementById('vmenuOpen');
    var overlay = document.getElementById('vmenuOverlay');
    if (!openBtn || !overlay) return;
    function setOpen(open) {
      document.body.classList.toggle('vmenu-open', open);
      openBtn.setAttribute('aria-expanded', String(open));
      overlay.setAttribute('aria-hidden', String(!open));
    }
    function isOpen() { return document.body.classList.contains('vmenu-open'); }
    openBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!isOpen());
    });
    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('click', function (e) {
      if (isOpen() && !overlay.contains(e.target) && e.target !== openBtn && !openBtn.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  })();

  /* ---------- nav: intensify on scroll ---------- */
  var navEl = document.querySelector('.nav');
  if (navEl) {
    var onScroll = function () { navEl.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- mobile nav ---------- */
  var burger = document.querySelector('.nav-burger');
  if (burger) {
    burger.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', document.body.classList.contains('nav-open'));
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    });
  }

  /* ---------- number count-up ---------- */
  function animateCount(el) {
    var raw = el.textContent.trim();
    var m = raw.match(/^([$#]?)([\d,.]+)(.*)$/);
    if (!m || reduced) return;
    var prefix = m[1], numStr = m[2].replace(/,/g, ''), suffix = m[3];
    var decimals = numStr.indexOf('.') !== -1 ? numStr.split('.')[1].length : 0;
    var end = parseFloat(numStr);
    if (isNaN(end)) return;
    var dur = 1500, start = null;
    function tick(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = end * eased;
      el.textContent = prefix + (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString()) + suffix;
      if (p < 1) requestAnimationFrame(tick); else el.textContent = raw;
    }
    requestAnimationFrame(tick);
  }

  /* ---------- scramble/decode text effect (used for control IDs + schematic labels) ---------- */
  var SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  window.__riceScramble = scrambleText;
  function scrambleText(el, finalText, duration) {
    if (reduced) { el.textContent = finalText; return; }
    duration = duration || 480;
    var start = null, len = finalText.length;
    function frame(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      var revealCount = Math.floor(p * len);
      var out = '';
      for (var i = 0; i < len; i++) {
        var ch = finalText[i];
        if (i < revealCount || ch === ' ' || ch === '.' || ch === '&') out += ch;
        else out += SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(frame); else el.textContent = finalText;
    }
    requestAnimationFrame(frame);
  }

  /* ---------- scroll progress indicator ---------- */
  (function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'scrollbar';
    document.body.appendChild(bar);
    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(window.scrollY / h, 1) : 0;
      bar.style.transform = 'scaleX(' + p + ')';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ---------- card tilt: desktop, fine-pointer only ---------- */
  (function initTilt() {
    if (reduced || !window.matchMedia('(pointer:fine)').matches) return;
    var els = document.querySelectorAll('.acr>div, .story-card, .stats>div, .tl>div');
    els.forEach(function (el) {
      var rect = null;
      el.addEventListener('mouseenter', function () {
        rect = el.getBoundingClientRect();
        el.classList.remove('tilt-reset');
      });
      el.addEventListener('mousemove', function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rx = (0.5 - py) * 6;
        var ry = (px - 0.5) * 8;
        el.style.transform = 'perspective(700px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      });
      el.addEventListener('mouseleave', function () {
        el.classList.add('tilt-reset');
        el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)';
        rect = null;
      });
    });
  })();

  /* ---------- magnetic buttons (subtle) ---------- */
  (function initMagnetic() {
    if (reduced || !window.matchMedia('(pointer:fine)').matches) return;
    var MAX = 9; // px, hard cap so it stays a nudge, not a lurch
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        btn.classList.remove('mag-reset');
        var r = btn.getBoundingClientRect();
        var x = Math.max(-MAX, Math.min(MAX, (e.clientX - r.left - r.width / 2) * 0.06));
        var y = Math.max(-MAX, Math.min(MAX, (e.clientY - r.top - r.height / 2) * 0.09));
        btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.classList.add('mag-reset');
        btn.style.transform = 'translate(0,0)';
      });
    });
  })();

  /* ---------- custom cursor: fine-pointer desktop only ---------- */
  (function initCursor() {
    if (reduced || !window.matchMedia('(pointer:fine)').matches) return;
    var dot = document.createElement('div'); dot.className = 'cursor-dot';
    /* wrapper carries the lerped position transform; the lens inside carries
       size/scale transitions so the two never fight over `transform` */
    var ring = document.createElement('div'); ring.className = 'cursor-ring';
    var lens = document.createElement('div'); lens.className = 'cursor-lens';
    ring.appendChild(lens);
    document.body.appendChild(dot); document.body.appendChild(ring);
    document.body.classList.add('custom-cursor');
    var rx = -100, ry = -100, dx = -100, dy = -100, active = false;
    window.addEventListener('mousemove', function (e) {
      rx = e.clientX; ry = e.clientY;
      dot.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      if (!active) { active = true; requestAnimationFrame(loop); }
    });
    window.addEventListener('mousedown', function () { lens.classList.add('press'); });
    window.addEventListener('mouseup', function () { lens.classList.remove('press'); });
    function loop() {
      dx += (rx - dx) * 0.18; dy += (ry - dy) * 0.18;
      ring.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
      if (Math.abs(rx - dx) > 0.1 || Math.abs(ry - dy) > 0.1) requestAnimationFrame(loop);
      else active = false;
    }
    function bindHoverTargets() {
      document.querySelectorAll('a, button, .story-row, .fchip, input').forEach(function (el) {
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = '1';
        el.addEventListener('mouseenter', function () { lens.classList.add('big'); });
        el.addEventListener('mouseleave', function () { lens.classList.remove('big'); });
      });
    }
    bindHoverTargets();
    document.addEventListener('toggle', bindHoverTargets, true);
  })();

  /* ---------- keyboard shortcut: "/" focuses the framework search ---------- */
  (function initSearchShortcut() {
    var input = document.getElementById('objSearch');
    if (!input) return;
    document.addEventListener('keydown', function (e) {
      if (e.key !== '/' || e.metaKey || e.ctrlKey) return;
      var tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      input.focus();
    });
  })();

  /* ---------- scroll cue: fade out once the person actually scrolls ---------- */
  (function initScrollCue() {
    var cue = document.querySelector('.scroll-cue');
    if (!cue) return;
    window.addEventListener('scroll', function () {
      cue.style.opacity = window.scrollY > 60 ? '0' : '';
    }, { passive: true });
  })();

  /* ---------- smooth accordion open/close (native <details> just snaps) ---------- */
  (function initSmoothDetails() {
    if (reduced) return;
    var items = document.querySelectorAll('details.pillar, .fws > details');
    items.forEach(function (det) {
      var body = det.querySelector('.pillar-body, .fbody');
      var summary = det.querySelector('summary');
      if (!body || !summary) return;
      summary.addEventListener('click', function (e) {
        e.preventDefault();
        if (det.open) {
          var h = body.scrollHeight;
          body.style.maxHeight = h + 'px';
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { body.style.maxHeight = '0px'; });
          });
          body.addEventListener('transitionend', function te() {
            det.open = false; body.style.maxHeight = '';
            det.dispatchEvent(new Event('toggle'));
            body.removeEventListener('transitionend', te);
          });
        } else {
          det.open = true;
          det.dispatchEvent(new Event('toggle'));
          var h2 = body.scrollHeight;
          body.style.maxHeight = '0px';
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { body.style.maxHeight = h2 + 'px'; });
          });
          body.addEventListener('transitionend', function te2() {
            body.style.maxHeight = '';
            body.removeEventListener('transitionend', te2);
          });
        }
      });
    });
  })();

  (function initReveals() {
    var groupSelectors = ['.acr', '.pidx', '.mat', '.stats', '.tl', '.ledger', '.phases', '.duo', '.why', '.local', '.cv', '.strip'];
    groupSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (group) {
        Array.prototype.forEach.call(group.children, function (el, i) {
          el.classList.add('reveal');
          el.style.setProperty('--rd', Math.min(i, 8) * 110 + 'ms');
        });
      });
    });
    var targets = document.querySelectorAll('.reveal, .sec-head');
    if (!targets.length) return;
    if (reduced) { targets.forEach(function (t) { t.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        var num = e.target.querySelector && e.target.querySelector('.v');
        if (num && !num.dataset.counted) { num.dataset.counted = '1'; animateCount(num); }
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  })();

  /* ---------- hero schematic: draw-in assembly (homepage signature moment) ---------- */
  (function initSchematicDraw() {
    var svg = document.querySelector('.schematic svg');
    if (!svg) return;
    try {
      if (reduced) return; // leave as authored — fully visible, no animation
      var traces = svg.querySelectorAll('path.trace');
      var jdots = svg.querySelectorAll('.jdot');
      var nodes = svg.querySelectorAll('.node');
      var pidLabels = svg.querySelectorAll('.node .pid');
      var pidFinals = [];
      pidLabels.forEach(function (t, i) { pidFinals[i] = t.textContent; t.textContent = ''; });

      traces.forEach(function (p) {
        var len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
      });
      jdots.forEach(function (j) { j.style.opacity = 0; });
      nodes.forEach(function (n) {
        n.style.opacity = 0;
        n.style.transformBox = 'fill-box';
        n.style.transformOrigin = 'center';
        n.style.transform = 'scale(.94)';
      });

      // the schematic lives below the fold — assemble when it scrolls
      // into view, so the draw-in is actually witnessed rather than wasted.
      var fired = false;
      function assemble() {
        if (fired) return; fired = true;
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            traces.forEach(function (p, i) {
              p.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.65,0,.35,1)';
              p.style.transitionDelay = (i * 260) + 'ms';
              p.style.strokeDashoffset = 0;
            });
            jdots.forEach(function (j, i) {
              j.style.transition = 'opacity .5s ease';
              j.style.transitionDelay = (700 + i * 60) + 'ms';
              j.style.opacity = 1;
            });
            nodes.forEach(function (n, i) {
              n.style.transition = 'opacity .85s ease, transform .85s cubic-bezier(.34,1.56,.64,1)';
              n.style.transitionDelay = (420 + i * 170) + 'ms';
              n.style.opacity = 1;
              n.style.transform = 'scale(1)';
              var pidEl = n.querySelector('.pid');
              if (pidEl && pidFinals[i] !== undefined) {
                setTimeout(function () { scrambleText(pidEl, pidFinals[i], 680); }, 420 + i * 170 + 160);
              }
            });
            // release the data packets once the network is built
            var wrap = svg.closest('.schematic');
            if (wrap) setTimeout(function () { wrap.classList.add('assembled'); }, 2400);
          });
        });
      }
      var schemIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { assemble(); schemIO.disconnect(); }
        });
      }, { threshold: 0.35 });
      schemIO.observe(svg);
      /* insurance: if the observer is ever starved (heavy main thread,
         smooth-scroll races), a cheap throttled scroll check backstops it */
      var lastCheck = 0;
      function scrollGuard() {
        if (fired) { window.removeEventListener('scroll', scrollGuard); return; }
        var now = Date.now();
        if (now - lastCheck < 250) return;
        lastCheck = now;
        var r = svg.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        if (visible > r.height * 0.35) { assemble(); schemIO.disconnect(); window.removeEventListener('scroll', scrollGuard); }
      }
      window.addEventListener('scroll', scrollGuard, { passive: true });
    } catch (err) {
      /* fail safe: guarantee visibility even if something above throws */
      svg.querySelectorAll('.node, path.trace').forEach(function (el) {
        el.style.opacity = ''; el.style.transform = ''; el.style.strokeDashoffset = '';
      });
      svg.querySelectorAll('.node .pid').forEach(function (t, i) {
        if (typeof pidFinals !== 'undefined' && pidFinals[i]) t.textContent = pidFinals[i];
      });
    }

    /* hovering any pillar node lights the whole connective network — the
       "integrated ecosystem" thesis, made literal */
    var schematicEl = svg.closest('.schematic');
    if (schematicEl) {
      svg.querySelectorAll('.node').forEach(function (n) {
        n.addEventListener('mouseenter', function () { schematicEl.classList.add('ecosystem-active'); });
        n.addEventListener('mouseleave', function () { schematicEl.classList.remove('ecosystem-active'); });
      });
    }
  })();

  /* ---------- pillar pinned scroll-story (homepage signature moment) ---------- */
  (function initPillarStory() {
    var rows = document.querySelectorAll('.story-row');
    if (!rows.length) return;
    var pid = document.getElementById('storyPid');
    var title = document.getElementById('storyTitle');
    var desc = document.getElementById('storyDesc');
    var tag = document.getElementById('storyTag');
    var link = document.getElementById('storyLink');
    var dots = document.querySelectorAll('.story-progress span');

    var current = null;
    function setActive(row) {
      if (row === current) return;
      current = row;
      rows.forEach(function (r) { r.classList.remove('active'); });
      row.classList.add('active');
      var i = Array.prototype.indexOf.call(rows, row);
      dots.forEach(function (d, di) { d.classList.toggle('active', di === i); });
      if (pid) pid.textContent = row.dataset.pid;
      if (title) title.textContent = row.dataset.title;
      if (desc) desc.textContent = row.dataset.desc;
      if (tag) tag.textContent = row.dataset.tag;
      if (link) link.setAttribute('href', row.getAttribute('href'));
      document.dispatchEvent(new CustomEvent('rice:storychange', { detail: { row: row, index: i } }));
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target); });
    }, { threshold: 0.5, rootMargin: '-42% 0px -42% 0px' });
    rows.forEach(function (r) { io.observe(r); });
  })();

  /* ---------- framework page: filter + search + expand/collapse ---------- */
  var objs = Array.prototype.slice.call(document.querySelectorAll('.obj'));
  if (objs.length) {
    var chips = document.querySelectorAll('.fchip');
    var input = document.getElementById('objSearch');
    var note = document.getElementById('resultNote');
    var pillars = document.querySelectorAll('details.pillar');
    var activeFilter = 'all';

    function apply() {
      var q = (input && input.value || '').trim().toLowerCase();
      var shown = 0;
      objs.forEach(function (o) {
        var maps = o.getAttribute('data-maps') || '';
        var passFilter = activeFilter === 'all' || maps.indexOf(activeFilter) !== -1;
        var passText = !q || o.textContent.toLowerCase().indexOf(q) !== -1;
        var show = passFilter && passText;
        o.classList.toggle('hide', !show);
        if (show) shown++;
      });
      // hide pillars with zero visible objectives while filtering
      var filtering = activeFilter !== 'all' || q;
      pillars.forEach(function (p) {
        var visible = p.querySelectorAll('.obj:not(.hide)').length;
        p.style.display = (filtering && !visible) ? 'none' : '';
        if (filtering && visible) p.open = true;
      });
      if (note) {
        note.innerHTML = filtering
          ? 'Showing <b>' + shown + '</b> of ' + objs.length + ' objectives'
          : String(objs.length) + ' objectives across 9 pillars \u2014 expand a pillar or filter above';
      }
    }

    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        chips.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        c.setAttribute('aria-pressed', 'true');
        activeFilter = c.getAttribute('data-f');
        apply();
      });
    });
    if (input) input.addEventListener('input', apply);
    apply();

    var exAll = document.getElementById('expandAll');
    var coAll = document.getElementById('collapseAll');
    if (exAll) exAll.addEventListener('click', function () { pillars.forEach(function (p) { p.open = true; }); });
    if (coAll) coAll.addEventListener('click', function () { pillars.forEach(function (p) { p.open = false; }); });

    /* decode effect: control IDs scramble into place each time a pillar opens */
    pillars.forEach(function (det) {
      det.addEventListener('toggle', function () {
        if (!det.open || reduced) return;
        var ids = Array.prototype.filter.call(det.querySelectorAll('.oid'), function (btn) {
          var obj = btn.closest('.obj');
          return !obj || !obj.classList.contains('hide');
        });
        ids.forEach(function (btn, i) {
          if (btn.dataset.scrambling) return;
          var final = btn.textContent.trim();
          btn.dataset.scrambling = '1';
          setTimeout(function () {
            scrambleText(btn, final, 400);
            setTimeout(function () { btn.dataset.scrambling = ''; }, 420);
          }, Math.min(i, 10) * 22);
        });
      });
    });

    /* copy control ID on click */
    var toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
    var toastTimer;
    document.querySelectorAll('.obj .oid').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = 'RICE ' + btn.textContent.trim();
        function done() {
          toast.textContent = id + ' copied';
          toast.classList.add('show');
          clearTimeout(toastTimer);
          toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1600);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(id).then(done, done);
        } else { done(); }
      });
    });

    /* deep link: framework.html#p3 opens that pillar */
    function openFromHash() {
      var h = location.hash.replace('#', '');
      if (!h) return;
      var el = document.getElementById(h);
      if (el && el.tagName === 'DETAILS') { el.open = true; }
    }
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
  }
})();
