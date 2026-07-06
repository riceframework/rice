/* RICE site behaviour — vanilla JS, no dependencies */
(function () {
  'use strict';

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
