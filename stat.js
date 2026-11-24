/* Měření návštěvnosti ukázky (GoatCounter, bez cookies).
   Přehled: https://dvorak-navrh.goatcounter.com
   Vlastní návštěvy nepočítat: otevřít stránku s #toggle-goatcounter na konci adresy. */
(function () {
  var CODE = 'dvorak-navrh';
  var q = [], ready = false, seen = {};

  window.goatcounter = { no_onload: true };
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://' + CODE + '.goatcounter.com/count');
  s.onload = function () { ready = true; q.forEach(send); q = []; };
  document.head.appendChild(s);

  function send(o) {
    try { window.goatcounter.count(o); } catch (e) {}
  }
  function hit(o) { ready && window.goatcounter.count ? send(o) : q.push(o); }

  var last = null;
  window.stat = {
    /* zobrazení stránky / pohledu; stejný pohled dvakrát po sobě se nepočítá */
    view: function (path, title) {
      if (path === last) return;
      last = path;
      hit({ path: path, title: title || document.title });
    },
    /* událost (klik, odeslání formuláře…); once = jen jednou za načtení */
    event: function (name, once) {
      if (once) { if (seen[name]) return; seen[name] = 1; }
      hit({ path: name, title: name, event: true });
    },
    /* kliky na tlačítka a odkazy v dané části stránky */
    clicks: function (prefix) {
      document.addEventListener('click', function (e) {
        var el = e.target.closest && e.target.closest('button, a, .nav, [onclick]');
        if (!el) return;
        var oc = el.getAttribute('onclick') || '';
        if (/openDetail/.test(oc)) return; /* detail nemovitosti se počítá jako zobrazení */
        var t = (el.classList.contains('nav') && el.dataset.v) ||
          (el.getAttribute('aria-label') || el.title || el.textContent || '')
          .replace(/\s+/g, ' ').trim().slice(0, 50);
        if (t) window.stat.event(prefix + ' – ' + t);
      }, true);
    }
  };
})();
