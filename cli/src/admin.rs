//! `kungfu generate admin` — generate a full CRUD admin dashboard.
//!
//! Produces a self-contained HTML file at `public/admin/index.html` that:
//! - Lists all routes from the OpenAPI spec
//! - Provides interactive "Try it" forms for each route
//! - Auto-generates CRUD tables for REST endpoints (GET/POST/PUT/DELETE patterns)
//! - Supports JSON body editing with syntax highlighting
//! - Shows response status + body inline

pub fn generate_admin_html(api_title: &str) -> String {
    format!(
        r#"<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} — Admin Dashboard</title>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; }}
    .header {{ background: #1e293b; padding: 1rem 2rem; border-bottom: 1px solid #334155; display: flex; align-items: center; justify-content: space-between; }}
    .header h1 {{ font-size: 1.25rem; font-weight: 600; }}
    .header .badge {{ background: #3b82f6; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }}
    .container {{ display: grid; grid-template-columns: 280px 1fr; min-height: calc(100vh - 57px); }}
    .sidebar {{ background: #1e293b; border-right: 1px solid #334155; padding: 1rem; overflow-y: auto; }}
    .sidebar h2 {{ font-size: 0.75rem; text-transform: uppercase; color: #64748b; margin: 1rem 0 0.5rem; letter-spacing: 0.05em; }}
    .sidebar a {{ display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; color: #cbd5e1; text-decoration: none; border-radius: 6px; font-size: 0.875rem; transition: all 0.15s; }}
    .sidebar a:hover {{ background: #334155; color: white; }}
    .sidebar a.active {{ background: #3b82f6; color: white; }}
    .main {{ padding: 2rem; overflow: auto; }}
    .card {{ background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; }}
    .card h3 {{ font-size: 1.1rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }}
    .method {{ display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em; }}
    .method.get {{ background: #1e3a5f; color: #60a5fa; }}
    .method.post {{ background: #14532d; color: #4ade80; }}
    .method.put {{ background: #78350f; color: #fbbf24; }}
    .method.delete {{ background: #7f1d1d; color: #f87171; }}
    .method.patch {{ background: #581c87; color: #c084fc; }}
    .table {{ width: 100%; border-collapse: collapse; margin-top: 1rem; }}
    .table th {{ text-align: left; padding: 0.75rem; border-bottom: 2px solid #334155; font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; }}
    .table td {{ padding: 0.75rem; border-bottom: 1px solid #334155; font-size: 0.875rem; }}
    .table tr:hover {{ background: #334155; }}
    .btn {{ padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 500; transition: all 0.15s; }}
    .btn-primary {{ background: #3b82f6; color: white; }}
    .btn-primary:hover {{ background: #2563eb; }}
    .btn-danger {{ background: #ef4444; color: white; }}
    .btn-danger:hover {{ background: #dc2626; }}
    .btn-sm {{ padding: 0.25rem 0.5rem; font-size: 0.75rem; }}
    input, textarea, select {{ width: 100%; padding: 0.5rem 0.75rem; background: #0f172a; border: 1px solid #475569; border-radius: 6px; color: #e2e8f0; font: inherit; font-size: 0.875rem; }}
    input:focus, textarea:focus {{ outline: none; border-color: #3b82f6; }}
    textarea {{ font-family: 'Fira Code', monospace; min-height: 120px; resize: vertical; }}
    .form-group {{ margin-bottom: 1rem; }}
    .form-group label {{ display: block; margin-bottom: 0.25rem; font-size: 0.8rem; color: #94a3b8; }}
    .resp {{ margin-top: 1rem; padding: 1rem; background: #0f172a; border-radius: 6px; border: 1px solid #334155; }}
    .resp-status {{ font-weight: 600; margin-bottom: 0.5rem; }}
    .resp-body {{ font-family: monospace; font-size: 0.8rem; white-space: pre-wrap; word-break: break-all; max-height: 400px; overflow: auto; }}
    .resp-status.ok {{ color: #4ade80; }}
    .resp-status.err {{ color: #f87171; }}
    .tabs {{ display: flex; gap: 0; margin-bottom: 1rem; border-bottom: 1px solid #334155; }}
    .tab {{ padding: 0.5rem 1rem; cursor: pointer; border-bottom: 2px solid transparent; color: #94a3b8; }}
    .tab.active {{ color: white; border-bottom-color: #3b82f6; }}
    .empty {{ text-align: center; color: #64748b; padding: 3rem; }}
    .loading {{ text-align: center; color: #64748b; padding: 2rem; }}
    .spinner {{ display: inline-block; width: 24px; height: 24px; border: 3px solid #334155; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; }}
    @keyframes spin {{ to {{ transform: rotate(360deg); }} }}
    @media (max-width: 768px) {{ .container {{ grid-template-columns: 1fr; }} .sidebar {{ display: none; }} }}
  </style>
</head>
<body>
  <div class="header">
    <h1>🥋 {title} <span class="badge">Admin</span></h1>
    <div>
      <span style="color:#64748b;font-size:0.8rem;">v<span id="version"></span></span>
    </div>
  </div>
  <div class="container">
    <div class="sidebar">
      <h2>Routes</h2>
      <div id="routes-list"><div class="loading"><div class="spinner"></div></div></div>
    </div>
    <div class="main" id="main">
      <div class="card">
        <h3>Welcome to the Admin Dashboard</h3>
        <p style="color:#94a3b8;">This dashboard reads the OpenAPI spec at <code>/openapi.json</code> and provides interactive CRUD interfaces for all routes.</p>
        <p style="color:#94a3b8;margin-top:0.5rem;">Click a route on the left to try it, or use the CRUD table below for REST endpoints.</p>
      </div>
      <div id="crud-section"></div>
      <div id="route-detail"></div>
    </div>
  </div>
  <script>
    let spec = {{}};
    let currentRoute = null;

    async function loadSpec() {{
      try {{
        const resp = await fetch('/openapi.json');
        spec = await resp.json();
        document.getElementById('version').textContent = spec.info?.version || '1.0.0';
        renderRoutes();
        renderCrudTables();
      }} catch (e) {{
        document.getElementById('routes-list').innerHTML = '<div style="color:#f87171;padding:1rem;">Failed to load /openapi.json</div>';
      }}
    }}

    function renderRoutes() {{
      const list = document.getElementById('routes-list');
      list.innerHTML = '';
      const paths = Object.entries(spec.paths || {{}});
      if (paths.length === 0) {{
        list.innerHTML = '<div class="empty">No routes found</div>';
        return;
      }}
      paths.forEach(([path, methods]) => {{
        Object.entries(methods).forEach(([method, op]) => {{
          const a = document.createElement('a');
          a.href = '#';
          a.innerHTML = '<span class="method ' + method + '">' + method.toUpperCase() + '</span> ' + path;
          a.onclick = (e) => {{
            e.preventDefault();
            document.querySelectorAll('.sidebar a').forEach(el => el.classList.remove('active'));
            a.classList.add('active');
            showRoute(path, method, op);
          }};
          list.appendChild(a);
        }});
      }});
    }}

    function renderCrudTables() {{
      const crud = document.getElementById('crud-section');
      // Detect CRUD patterns: if we have GET /resource + POST /resource + GET /resource/:id + PUT /resource/:id + DELETE /resource/:id
      const paths = spec.paths || {{}};
      const resources = new Set();
      Object.keys(paths).forEach(p => {{
        const match = p.match(/^\/([^/]+)$/);
        if (match) resources.add(match[1]);
      }});

      if (resources.size === 0) return;

      crud.innerHTML = '<div class="card"><h3>📊 CRUD Tables</h3><p style="color:#94a3b8;margin-bottom:1rem;">Auto-detected REST endpoints. Click "Load" to fetch data.</p></div>';

      resources.forEach(resource => {{
        const listPath = '/' + resource;
        const itemPath = '/' + resource + '/:id';
        if (!paths[listPath] || !paths[listPath].get) return;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h3>📦 ${{resource}}</h3>
          <div style="margin-bottom:1rem;">
            <button class="btn btn-primary btn-sm" onclick="loadCrudData('${{resource}}')">Load Data</button>
            <button class="btn btn-primary btn-sm" onclick="showCreateForm('${{resource}}')">+ New</button>
          </div>
          <div id="crud-${{resource}}" class="crud-table"></div>
          <div id="form-${{resource}}"></div>
        `;
        crud.appendChild(card);
      }});
    }}

    async function loadCrudData(resource) {{
      const div = document.getElementById('crud-' + resource);
      div.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
      try {{
        const resp = await fetch('/' + resource);
        const data = await resp.json();
        if (!Array.isArray(data) || data.length === 0) {{
          div.innerHTML = '<div class="empty">No records found</div>';
          return;
        }}
        const cols = Object.keys(data[0]);
        let html = '<table class="table"><thead><tr>';
        cols.forEach(c => html += '<th>' + c + '</th>');
        html += '<th>Actions</th></tr></thead><tbody>';
        data.forEach(row => {{
          html += '<tr>';
          cols.forEach(c => {{
            const val = typeof row[c] === 'object' ? JSON.stringify(row[c]) : row[c];
            html += '<td>' + (val ?? '') + '</td>';
          }});
          const id = row.id || row[cols[0]];
          html += '<td><button class="btn btn-sm btn-danger" onclick="deleteRecord(\'${{resource}}\',' + id + ')">Delete</button></td>';
          html += '</tr>';
        }});
        html += '</tbody></table>';
        div.innerHTML = html;
      }} catch (e) {{
        div.innerHTML = '<div style="color:#f87171;">Error: ' + e.message + '</div>';
      }}
    }}

    function showCreateForm(resource) {{
      const div = document.getElementById('form-' + resource);
      div.innerHTML = `
        <div style="margin-top:1rem;padding:1rem;background:#0f172a;border-radius:6px;">
          <h4 style="margin-bottom:0.5rem;">Create New ${{resource}}</h4>
          <div class="form-group">
            <label>JSON Body</label>
            <textarea id="create-body-${{resource}}" placeholder='{{"name":"value"}}'>{{}}</textarea>
          </div>
          <button class="btn btn-primary btn-sm" onclick="createRecord('${{resource}}')">Create</button>
          <button class="btn btn-sm" onclick="document.getElementById('form-${{resource}}').innerHTML=''">Cancel</button>
        </div>
      `;
    }}

    async function createRecord(resource) {{
      const body = document.getElementById('create-body-' + resource).value;
      try {{
        const resp = await fetch('/' + resource, {{
          method: 'POST',
          headers: {{'Content-Type': 'application/json'}},
          body: body
        }});
        const text = await resp.text();
        alert(resp.ok ? 'Created!' : 'Error: ' + text);
        loadCrudData(resource);
        document.getElementById('form-' + resource).innerHTML = '';
      }} catch (e) {{
        alert('Error: ' + e.message);
      }}
    }}

    async function deleteRecord(resource, id) {{
      if (!confirm('Delete record ' + id + '?')) return;
      try {{
        const resp = await fetch('/' + resource + '/' + id, {{method: 'DELETE'}});
        if (resp.ok) loadCrudData(resource);
        else alert('Delete failed');
      }} catch (e) {{
        alert('Error: ' + e.message);
      }}
    }}

    function showRoute(path, method, op) {{
      const detail = document.getElementById('route-detail');
      const params = (path.match(/:[^/]+|\\{{[^}}]+\\}}/g) || []).map(p => p.replace(/^[:{{]|}}$/g, ''));
      detail.innerHTML = `
        <div class="card">
          <h3><span class="method ${{method}}">${{method.toUpperCase()}}</span> ${{path}}</h3>
          <p style="color:#94a3b8;">${{op.summary || 'No description'}}</p>
          ${{op.tags?.length ? '<p style="color:#64748b;font-size:0.8rem;">Tags: ' + op.tags.join(', ') + '</p>' : ''}}
        </div>
        <div class="card">
          <h3>Try it</h3>
          ${{params.length > 0 ? '<div class="form-group"><label>Path Parameters</label><div id="params-input"></div></div>' : ''}}
          ${{['POST','PUT','PATCH'].includes(method.toUpperCase()) ? '<div class="form-group"><label>Request Body (JSON)</label><textarea id="try-body" placeholder=\\'{{}}\\'>{{}}</textarea></div>' : ''}}
          <button class="btn btn-primary" onclick="tryRoute('${{path}}','${{method}}')">Send Request</button>
          <div id="try-result"></div>
        </div>
      `;
      // Render param inputs.
      const paramsDiv = document.getElementById('params-input');
      if (paramsDiv) {{
        params.forEach(p => {{
          paramsDiv.innerHTML += '<input id="param-' + p + '" placeholder="' + p + '" style="margin-bottom:0.5rem;">';
        }});
      }}
    }}

    async function tryRoute(path, method) {{
      let url = path;
      // Replace path params.
      const params = path.match(/:[^/]+|\\{{[^}}]+\\}}/g) || [];
      params.forEach(p => {{
        const name = p.replace(/^[:{{]|}}$/g, '');
        const val = document.getElementById('param-' + name)?.value || '';
        url = url.replace(p, val);
      }});
      const body = ['POST','PUT','PATCH'].includes(method.toUpperCase()) ? document.getElementById('try-body')?.value : null;
      const resultDiv = document.getElementById('try-result');
      resultDiv.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
      try {{
        const resp = await fetch(url, {{
          method: method.toUpperCase(),
          body: body || undefined,
          headers: body ? {{'Content-Type': 'application/json'}} : undefined,
        }});
        const text = await resp.text();
        const statusClass = resp.ok ? 'ok' : 'err';
        resultDiv.innerHTML = `
          <div class="resp">
            <div class="resp-status ${{statusClass}}">Status: ${{resp.status}} ${{resp.statusText}}</div>
            <div class="resp-body">${{text}}</div>
          </div>
        `;
      }} catch (e) {{
        resultDiv.innerHTML = '<div class="resp"><div class="resp-status err">Error: ' + e.message + '</div></div>';
      }}
    }}

    // Load on startup.
    loadSpec();
  </script>
</body>
</html>"#,
        title = api_title
    )
}
