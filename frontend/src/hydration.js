// Unique.js client-side hydration + reactive framework.
//
// V1: provides:
//   - Hydration marker (data-unique-hydrated)
//   - WebSocket livereload with auto-reconnect
//   - Reactive data binding via data-unique-bind attribute
//   - Form submission helper (data-unique-submit)
//   - Client-side fetch wrapper (unique.fetch)
//   - Simple state management (unique.state)
//
// Usage in .kng files:
//   <div data-unique-bind="user.name">Loading...</div>
//   <button data-unique-click="refresh">Refresh</button>
//   <form data-unique-submit="/api/users" data-unique-method="POST">...</form>

(function() {
  'use strict';

  const data = window.__UNIQUE_DATA__ || {};
  const livereload = window.__UNIQUE_LIVERELOAD__ || false;

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
    const elements = document.querySelectorAll(`[data-unique-bind="${key}"]`);
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
    document.querySelectorAll('[data-unique-click]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const action = el.getAttribute('data-unique-click');
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
      if (!form.hasAttribute('data-unique-submit')) return;
      e.preventDefault();

      const action = form.getAttribute('data-unique-submit');
      const method = (form.getAttribute('data-unique-method') || 'POST').toUpperCase();
      const formData = new FormData(form);
      const body = JSON.stringify(Object.fromEntries(formData));

      try {
        const resp = await fetch(action, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body,
        });
        const result = await resp.json();
        form.dispatchEvent(new CustomEvent('unique:submit', { detail: { result, form } }));
        if (result.error) {
          form.dispatchEvent(new CustomEvent('unique:error', { detail: result.error }));
        } else {
          form.dispatchEvent(new CustomEvent('unique:success', { detail: result }));
        }
      } catch (err) {
        form.dispatchEvent(new CustomEvent('unique:error', { detail: { message: err.message } }));
      }
    });
  }

  // ─── Fetch Wrapper ─────────────────────────────────────────────────────────
  async function uniqueFetch(url, options = {}) {
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
      ws = new WebSocket(`${protocol}//${location.host}/__unique_livereload`);

      ws.onopen = () => { attempts = 0; console.log('[unique] Live reload connected'); };
      ws.onmessage = (event) => {
        if (event.data === 'reload' || (typeof event.data === 'string' && event.data.includes('reload'))) {
          console.log('[unique] File change — reloading');
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
    document.documentElement.setAttribute('data-unique-hydrated', 'true');
    initBindings();
    initClickHandlers();
    initForms();
    initLiveReload();
    console.log('[unique] Page hydrated with', Object.keys(state).length, 'keys');
  }

  // Expose the Unique client API.
  window.kng = {
    state,
    fetch: uniqueFetch,
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
