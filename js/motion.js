/* RICE motion layer — GSAP ScrollTrigger + Lenis smooth scrolling.
   Loaded after the vendor bundles; everything here is additive and
   degrades silently if a vendor script failed to load. Fully skipped
   under prefers-reduced-motion. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis smooth scrolling, driven by GSAP's ticker ---------- */
  if (window.Lenis) {
    var lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 1.25, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    window.__riceLenis = lenis;
  }

  /* ---------- hero parallax: panels drift apart as you scroll away ---------- */
  if (document.querySelector('.vhero')) {
    gsap.to('.vpanel-l', {
      yPercent: -7, ease: 'none',
      scrollTrigger: { trigger: '.vhero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.vpanel-r', {
      yPercent: -13, ease: 'none',
      scrollTrigger: { trigger: '.vhero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.vhero .orb', {
      yPercent: 18, ease: 'none',
      scrollTrigger: { trigger: '.vhero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- section headlines: per-word rise, masked ---------- */
  document.querySelectorAll('.sec-head h2').forEach(function (h2) {
    if (h2.dataset.split) return;
    h2.dataset.split = '1';
    var words = h2.textContent.split(/(\s+)/);
    h2.textContent = '';
    var targets = [];
    words.forEach(function (w) {
      if (/^\s+$/.test(w)) { h2.appendChild(document.createTextNode(' ')); return; }
      var mask = document.createElement('span');
      mask.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
      var inner = document.createElement('span');
      inner.style.cssText = 'display:inline-block;will-change:transform;';
      inner.textContent = w;
      mask.appendChild(inner);
      h2.appendChild(mask);
      targets.push(inner);
    });
    gsap.from(targets, {
      yPercent: 112, duration: 0.9, ease: 'power4.out', stagger: 0.055,
      scrollTrigger: { trigger: h2, start: 'top 86%', once: true }
    });
  });

  /* ---------- stats strip: settles into place with a soft scale ---------- */
  document.querySelectorAll('.strip, .stats').forEach(function (el) {
    gsap.from(el, {
      scale: 0.965, transformOrigin: '50% 100%', ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 55%', scrub: true }
    });
  });

  /* ---------- schematic: subtle depth scrub while in view ---------- */
  var schem = document.querySelector('.schematic');
  if (schem) {
    gsap.fromTo(schem, { y: 34 }, {
      y: -18, ease: 'none',
      scrollTrigger: { trigger: schem, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- Nine Pillars: full scroll choreography ---------- */
  (function pillarStoryMotion() {
    var story = document.querySelector('.story');
    if (!story) return;

    /* rows sweep in from the right as the section arrives */
    gsap.from('.story-row', {
      x: 44, opacity: 0, duration: 0.75, ease: 'power3.out', stagger: 0.07,
      scrollTrigger: { trigger: '.story-list', start: 'top 82%', once: true }
    });

    /* gentle counter-drift between the two columns while scrolling through */
    gsap.fromTo('.story-list', { y: 18 }, {
      y: -18, ease: 'none',
      scrollTrigger: { trigger: story, start: 'top bottom', end: 'bottom top', scrub: true }
    });

    /* card swap choreography: content rises in, pid decodes, active row pulses */
    var swapTargets = ['#storyTitle', '#storyDesc', '#storyTag'];
    document.addEventListener('rice:storychange', function (e) {
      gsap.fromTo(swapTargets,
        { y: 13, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', stagger: 0.055, overwrite: 'auto' }
      );
      var pidEl = document.getElementById('storyPid');
      if (pidEl && window.__riceScramble) window.__riceScramble(pidEl, pidEl.textContent, 420);
      gsap.fromTo(pidEl, { scale: 1.14 }, { scale: 1, duration: 0.5, ease: 'back.out(2.5)', transformOrigin: 'left bottom', overwrite: 'auto' });
      var rowPid = e.detail.row.querySelector('.pid');
      if (rowPid) gsap.fromTo(rowPid, { scale: 1.3 }, { scale: 1, duration: 0.55, ease: 'back.out(3)', transformOrigin: 'left center', overwrite: 'auto' });
      var card = document.querySelector('.story-card');
      if (card) gsap.fromTo(card, { scale: .988 }, { scale: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    });
  })();

  /* ---------- footer: rises in ---------- */
  var foot = document.querySelector('.foot');
  if (foot) {
    gsap.from(foot.children, {
      y: 26, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: foot, start: 'top bottom', once: true }
    });
  }

  /* ---------- keep trigger positions honest ----------
     Accordions, filters, and search change the page height dramatically;
     without a refresh, triggers computed against the old height leave
     late-page animations (like the footer) stranded invisible. */
  var refreshTimer = null;
  function queueRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () { ScrollTrigger.refresh(); }, 620);
  }
  document.addEventListener('toggle', queueRefresh, true);
  document.querySelectorAll('.fchip, #expandAll, #collapseAll').forEach(function (el) {
    el.addEventListener('click', queueRefresh);
  });
  var searchEl = document.getElementById('objSearch');
  if (searchEl) searchEl.addEventListener('input', queueRefresh);
})();
