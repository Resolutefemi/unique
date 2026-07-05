// Kungfu.js client-side hydration + reactive framework.
//
// V1: provides:
//   - Hydration marker (data-kungfu-hydrated)
//   - WebSocket livereload with auto-reconnect
//   - Reactive data binding via data-kungfu-bind attribute
//   - Form submission helper (data-kungfu-submit)
//   - Client-side fetch wrapper (kungfu.fetch)
//   - Simple state management (kungfu.state)
//
// Usage in .kng files:
//   <div data-kungfu-bind="user.name">Loading...</div>
//   <button data-kungfu-click="refresh">Refresh</button>
//   <form data-kungfu-submit="/api/users" data-kungfu-method="POST">...</form>

(function() {
  'use strict';

  const data = window.__KUNGFU_DATA__ || {};
  const livereload = window.__KUNGFU_LIVERELOAD__ || false;

  // ─── State Management ─────────────────────────────────────────────────────
  const state = typeof Proxy !== 'undefined' ? new Proxy({...data}, {
    set(target, key, value) {
      target[key] = value;
      updateBindings(key, value);
      return true;
    }
  }) : {...data};

  // ─── Reactive Data Binding ─────────────────────────────────────────────────
  function updateBindings(key, value) {
    const elements = document.querySelectorAll(`[data-kungfu-bind="${key}"]`);
    elements.forEach(el => {
      if (typeof value === 'object') {
        el.textContent = JSON.stringify(value, null, 2);
      } else {
        el.textContent = value;
      }
    });
  }

  function initBindings() {
    Object.keys(state).forEach(key => updateBindings(key, state[key]));
  }

  // ─── Click Handlers ────────────────────────────────────────────────────────
  function initClickHandlers() {
    document.querySelectorAll('[data-kungfu-click]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const action = el.getAttribute('data-kungfu-click');
        if (typeof window.kngActions?.[action] === 'function') {
          window.kngActions[action](state);
        }
      });
    });
  }

  // ─── Form Submission ───────────────────────────────────────────────────────
  function initForms() {
    document.addEventListener('submit', async (e) => {
      const form = e.target;
      if (!form.hasAttribute('data-kungfu-submit')) return;
      e.preventDefault();

      const action = form.getAttribute('data-kungfu-submit');
      const method = (form.getAttribute('data-kungfu-method') || 'POST').toUpperCase();
      const formData = new FormData(form);
      const body = JSON.stringify(Object.fromEntries(formData));

      try {
        const resp = await fetch(action, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body,
        });
        const result = await resp.json();
        form.dispatchEvent(new CustomEvent('kungfu:submit', { detail: { result, form } }));
        if (result.error) {
          form.dispatchEvent(new CustomEvent('kungfu:error', { detail: result.error }));
        } else {
          form.dispatchEvent(new CustomEvent('kungfu:success', { detail: result }));
        }
      } catch (err) {
        form.dispatchEvent(new CustomEvent('kungfu:error', { detail: { message: err.message } }));
      }
    });
  }

  // ─── Fetch Wrapper ─────────────────────────────────────────────────────────
  async function kungfuFetch(url, options = {}) {
    const resp = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    const text = await resp.text();
    try { return JSON.parse(text); } catch { return text; }
  }

  // ─── Live Reload ───────────────────────────────────────────────────────────
  function initLiveReload() {
    if (!livereload) return;
    let ws;
    let attempts = 0;
    const maxAttempts = 10;

    function connect() {
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
      ws = new WebSocket(`${protocol}//${location.host}/__kungfu_livereload`);

      ws.onopen = () => { attempts = 0; console.log('[kungfu] Live reload connected'); };
      ws.onmessage = (event) => {
        if (event.data === 'reload' || (typeof event.data === 'string' && event.data.includes('reload'))) {
          console.log('[kungfu] File change — reloading');
          window.location.reload();
        }
      };
      ws.onclose = () => {
        if (attempts++ < maxAttempts) {
          setTimeout(connect, 1000 * attempts);
        }
      };
      ws.onerror = () => ws.close();
    }
    connect();
  }

  // ─── Init ──────────────────────────────────────────────────────────────────
  function init() {
    document.documentElement.setAttribute('data-kungfu-hydrated', 'true');
    initBindings();
    initClickHandlers();
    initForms();
    initLiveReload();
    console.log('[kungfu] Page hydrated with', Object.keys(state).length, 'keys');
  }

  // Expose the Kungfu client API.
  window.kng = {
    state,
    fetch: kungfuFetch,
    actions: window.kngActions || {},
    updateBindings,
  };

  // Initialize on DOM ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
