// Kungfu.js client-side hydration script.
//
// This script is injected into every SSR page when hydration is enabled.
// It picks up the __KUNGFU_DATA__ global and re-renders the template
// client-side, making the page interactive.
//
// V1: simple re-render on load. V2: reactive updates via WebSocket.

(function() {
  'use strict';

  const data = window.__KUNGFU_DATA__ || {};
  const livereload = window.__KUNGFU_LIVERELOAD__ || false;

  // ─── Hydration ─────────────────────────────────────────────────────────────
  // V1: we just mark the page as hydrated. V2 will re-execute template()
  // client-side and diff with the SSR output.
  if (data) {
    document.documentElement.setAttribute('data-kungfu-hydrated', 'true');
    console.log('[kungfu] Page hydrated with', Object.keys(data).length, 'keys');
  }

  // ─── Live Reload ────────────────────────────────────────────────────────────
  if (livereload) {
    let ws;
    let reconnectAttempts = 0;
    const maxReconnect = 10;

    function connect() {
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
      const url = `${protocol}//${location.host}/__kungfu_livereload`;
      ws = new WebSocket(url);

      ws.onopen = () => {
        reconnectAttempts = 0;
        console.log('[kungfu] Live reload connected');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'reload' || msg === 'reload') {
            console.log('[kungfu] File change detected — reloading');
            window.location.reload();
          }
        } catch (e) {
          // Plain text "reload" message
          if (event.data === 'reload') {
            window.location.reload();
          }
        }
      };

      ws.onclose = () => {
        reconnectAttempts++;
        if (reconnectAttempts < maxReconnect) {
          console.log(`[kungfu] Live reload disconnected — reconnecting (${reconnectAttempts}/${maxReconnect})`);
          setTimeout(connect, 1000 * reconnectAttempts);
        } else {
          console.log('[kungfu] Live reload giving up after', maxReconnect, 'attempts');
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();
  }

  // ─── Client-side router (V2) ─────────────────────────────────────────────────
  // V2 will add client-side navigation that fetches .kungfu pages
  // via the server API and swaps content without full page reload.

  // ─── Form submission helper ─────────────────────────────────────────────────
  // Auto-serialize forms with data-kungfu-submit attribute
  document.addEventListener('submit', async (e) => {
    const form = e.target;
    if (!form.hasAttribute('data-kungfu-submit')) return;

    e.preventDefault();
    const action = form.action || location.pathname;
    const method = (form.method || 'POST').toUpperCase();
    const formData = new FormData(form);
    const body = JSON.stringify(Object.fromEntries(formData));

    try {
      const resp = await fetch(action, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const result = await resp.json();
      const event = new CustomEvent('kungfu:submit', { detail: { result, form } });
      form.dispatchEvent(event);
    } catch (err) {
      console.error('[kungfu] Form submission error:', err);
    }
  });
})();
