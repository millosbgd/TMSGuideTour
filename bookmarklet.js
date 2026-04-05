// Noto TMS Product Tour — bookmarklet.js
// Hostovan na Azure Static Web App, injektuje se u Noto TMS stranicu

(function () {
  // Ako je već aktivan — ugasi ga
  if (document.getElementById('__noto_tour__')) {
    document.getElementById('__noto_tour__').remove();
    document.getElementById('__noto_overlay__')?.remove();
    return;
  }

  // ⚠️ PODESI: raw GitHub URL do steps.json
  const STEPS_URL = 'https://raw.githubusercontent.com/millosbgd/TMSGuideTour/main/steps.json';

  // UI boje usklađene sa Noto TMS
  const COLOR_PRIMARY = '#1D9E75';
  const COLOR_DARK = '#1a2332';
  const COLOR_BG = '#fff';

  function buildUI(steps) {
    let current = 0;
    const total = steps.length;

    // Overlay (zatamnjenje)
    const overlay = document.createElement('div');
    overlay.id = '__noto_overlay__';
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0',
      background: 'rgba(10,20,30,0.68)',
      zIndex: '2147483640',
      pointerEvents: 'none',
      transition: 'opacity 0.3s'
    });
    document.body.appendChild(overlay);

    // Panel
    const panel = document.createElement('div');
    panel.id = '__noto_tour__';
    Object.assign(panel.style, {
      position: 'fixed',
      bottom: '28px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '500px',
      maxWidth: 'calc(100vw - 32px)',
      background: COLOR_BG,
      borderRadius: '16px',
      boxShadow: '0 12px 48px rgba(0,0,0,0.24)',
      zIndex: '2147483647',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflow: 'hidden',
      pointerEvents: 'all'
    });

    panel.innerHTML = `
      <div id="__nt_header__" style="background:${COLOR_DARK};padding:13px 18px;display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:8px;height:8px;border-radius:50%;background:${COLOR_PRIMARY};"></div>
          <span style="color:#fff;font-size:13px;font-weight:600;letter-spacing:0.02em;">NOTO TMS — Uputstvo</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span id="__nt_counter__" style="font-size:12px;color:rgba(255,255,255,0.45);"></span>
          <button id="__nt_close__" style="background:none;border:none;color:rgba(255,255,255,0.4);font-size:22px;cursor:pointer;padding:0;line-height:1;transition:color 0.15s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.4)'">&times;</button>
        </div>
      </div>

      <div style="padding:20px 22px 8px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span id="__nt_module__" style="font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px;background:#E1F5EE;color:#0F6E56;"></span>
          <span id="__nt_title__" style="font-size:16px;font-weight:600;color:${COLOR_DARK};"></span>
        </div>
        <p id="__nt_text__" style="font-size:14px;color:#4a5568;line-height:1.75;margin:0 0 18px;"></p>

        <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:18px;">
          <div style="display:flex;gap:5px;" id="__nt_dots__"></div>
          <div style="display:flex;gap:8px;">
            <button id="__nt_prev__" style="padding:8px 16px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;color:#4a5568;font-size:13px;cursor:pointer;font-weight:500;transition:background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='#fff'">← Nazad</button>
            <button id="__nt_next__" style="padding:8px 20px;border-radius:8px;border:none;background:${COLOR_PRIMARY};color:#fff;font-size:13px;cursor:pointer;font-weight:600;transition:background 0.15s;">Sledeće →</button>
          </div>
        </div>
      </div>

      <div style="height:4px;background:#f0f4f8;">
        <div id="__nt_bar__" style="height:100%;background:${COLOR_PRIMARY};transition:width 0.35s ease;border-radius:0 4px 4px 0;"></div>
      </div>
    `;

    document.body.appendChild(panel);

    function render() {
      const s = steps[current];
      panel.querySelector('#__nt_counter__').textContent = `${current + 1} / ${total}`;
      panel.querySelector('#__nt_module__').textContent = s.module || '';
      panel.querySelector('#__nt_title__').textContent = s.title;
      panel.querySelector('#__nt_text__').textContent = s.text;
      panel.querySelector('#__nt_bar__').style.width = ((current + 1) / total * 100) + '%';

      const prev = panel.querySelector('#__nt_prev__');
      prev.style.opacity = current === 0 ? '0.3' : '1';
      prev.style.pointerEvents = current === 0 ? 'none' : 'all';

      const next = panel.querySelector('#__nt_next__');
      if (current === total - 1) {
        next.textContent = 'Završi ✓';
        next.style.background = '#0F6E56';
      } else {
        next.textContent = 'Sledeće →';
        next.style.background = COLOR_PRIMARY;
      }

      // Dots
      const dotsEl = panel.querySelector('#__nt_dots__');
      dotsEl.innerHTML = '';
      const maxDots = Math.min(total, 12);
      for (let i = 0; i < maxDots; i++) {
        const d = document.createElement('div');
        Object.assign(d.style, {
          width: i === current ? '20px' : '7px',
          height: '7px',
          borderRadius: '4px',
          background: i === current ? COLOR_PRIMARY : '#cbd5e0',
          transition: 'all 0.25s',
          cursor: 'pointer'
        });
        const idx = i;
        d.addEventListener('click', () => { current = idx; render(); });
        dotsEl.appendChild(d);
      }
    }

    function destroy() {
      panel.remove();
      overlay.remove();
      document.removeEventListener('keydown', onKey);
    }

    function onKey(e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (current < total - 1) { current++; render(); } else destroy();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (current > 0) { current--; render(); }
      }
      if (e.key === 'Escape') destroy();
    }

    panel.querySelector('#__nt_close__').addEventListener('click', destroy);
    panel.querySelector('#__nt_next__').addEventListener('click', () => {
      if (current < total - 1) { current++; render(); } else destroy();
    });
    panel.querySelector('#__nt_prev__').addEventListener('click', () => {
      if (current > 0) { current--; render(); }
    });
    document.addEventListener('keydown', onKey);

    render();
  }

  // Loading indikator
  const loader = document.createElement('div');
  loader.id = '__noto_tour__';
  Object.assign(loader.style, {
    position: 'fixed', bottom: '28px', left: '50%',
    transform: 'translateX(-50%)',
    background: '#1a2332', color: '#fff',
    padding: '12px 22px', borderRadius: '10px',
    fontSize: '13px', fontFamily: 'sans-serif',
    zIndex: '2147483647'
  });
  loader.textContent = 'Učitavam uputstvo...';
  document.body.appendChild(loader);

  // Fetch koraka sa GitHub raw
  fetch(STEPS_URL + '?v=' + Date.now())
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(steps => {
      loader.remove();
      if (!steps || !steps.length) throw new Error('Nema koraka');
      buildUI(steps);
    })
    .catch(err => {
      loader.textContent = '⚠ Greška pri učitavanju uputstva. Pokušajte ponovo.';
      loader.style.background = '#A32D2D';
      setTimeout(() => loader.remove(), 3500);
      console.error('[Noto Tour]', err);
    });
})();
