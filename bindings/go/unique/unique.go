package unique

import (
	"encoding/json"
	"net/http"
	"strings"
	"sync"
)

// Unique is the main application type. Construct with New().
type Unique struct {
	mu       sync.Mutex
	routes   map[string]map[string]HandlerFunc // method → pattern → handler
	middleware []MiddlewareFunc
}

// New creates a new Unique application.
func New() *Unique {
	return &Unique{
		routes: make(map[string]map[string]HandlerFunc),
	}
}

// HandlerFunc is the signature for all route handlers.
type HandlerFunc func(w ResponseWriter, r *Request)

// MiddlewareFunc is the signature for middleware.
type MiddlewareFunc func(w ResponseWriter, r *Request, next func())

// Request is the HTTP request passed to handlers.
type Request struct {
	Method  string
	Path    string
	Query   map[string]string
	Params  map[string]string
	Headers map[string]string
	Body    []byte
}

// ResponseWriter is the response writer passed to handlers.
type ResponseWriter interface {
	Status(code int)
	Header(key, value string)
	JSON(code int, v interface{})
	Text(code int, s string)
	HTML(code int, s string)
}

// rw implements ResponseWriter.
type rw struct {
	headerMap http.Header
	status    int
	body      []byte
}

func (w *rw) Status(code int)              { w.status = code }
func (w *rw) Header(key, value string)     { w.headerMap.Set(key, value) }
func (w *rw) JSON(code int, v interface{}) {
	w.status = code
	w.headerMap.Set("Content-Type", "application/json; charset=utf-8")
	b, _ := json.Marshal(v)
	w.body = b
}
func (w *rw) Text(code int, s string) {
	w.status = code
	w.headerMap.Set("Content-Type", "text/plain; charset=utf-8")
	w.body = []byte(s)
}
func (w *rw) HTML(code int, s string) {
	w.status = code
	w.headerMap.Set("Content-Type", "text/html; charset=utf-8")
	w.body = []byte(s)
}

// Get registers a GET handler.
func (k *Unique) Get(pattern string, h HandlerFunc)    { k.add("GET", pattern, h) }
func (k *Unique) Post(pattern string, h HandlerFunc)   { k.add("POST", pattern, h) }
func (k *Unique) Put(pattern string, h HandlerFunc)    { k.add("PUT", pattern, h) }
func (k *Unique) Delete(pattern string, h HandlerFunc) { k.add("DELETE", pattern, h) }
func (k *Unique) Patch(pattern string, h HandlerFunc)  { k.add("PATCH", pattern, h) }

func (k *Unique) add(method, pattern string, h HandlerFunc) {
	k.mu.Lock()
	defer k.mu.Unlock()
	if _, ok := k.routes[method]; !ok {
		k.routes[method] = make(map[string]HandlerFunc)
	}
	k.routes[method][pattern] = h
}

// Use registers a middleware.
func (k *Unique) Use(m MiddlewareFunc) {
	k.mu.Lock()
	defer k.mu.Unlock()
	k.middleware = append(k.middleware, m)
}

// Run starts the HTTP server on the given address (e.g. ":3000").
// Blocks until the server stops.
//
// Note: V1.0 of this Go binding uses net/http as the transport. In V1.1
// when the C ABI lands, this will swap to calling the Rust core for
// full performance parity with the Rust/Python bindings.
func (k *Unique) Run(addr string) error {
	mux := http.NewServeMux()
	mux.HandleFunc("/", k.handle)
	srv := &http.Server{Addr: addr, Handler: mux}
	return srv.ListenAndServe()
}

func (k *Unique) handle(w http.ResponseWriter, r *http.Request) {
	// Build the Request.
	req := &Request{
		Method:  r.Method,
		Path:    r.URL.Path,
		Query:   make(map[string]string),
		Params:  make(map[string]string),
		Headers: make(map[string]string),
	}
	for k, v := range r.URL.Query() {
		if len(v) > 0 {
			req.Query[k] = v[0]
		}
	}
	for k, v := range r.Header {
		if len(v) > 0 {
			req.Headers[strings.ToLower(k)] = v[0]
		}
	}
	if r.Body != nil {
		buf := make([]byte, 16*1024)
		n, _ := r.Body.Read(buf)
		req.Body = buf[:n]
	}

	// Find a matching route.
	k.mu.Lock()
	routes, ok := k.routes[r.Method]
	if !ok {
		k.mu.Unlock()
		http.Error(w, `{"error":{"code":404,"message":"Not Found"}}`, http.StatusNotFound)
		return
	}

	var handler HandlerFunc
	var pattern string
	for p, h := range routes {
		if matches, params := matchPattern(p, r.URL.Path); matches {
			handler = h
			pattern = p
			for k, v := range params {
				req.Params[k] = v
			}
			break
		}
	}
	mw := make([]MiddlewareFunc, len(k.middleware))
	copy(mw, k.middleware)
	k.mu.Unlock()

	if handler == nil {
		_ = pattern
		http.Error(w, `{"error":{"code":404,"message":"Not Found"}}`, http.StatusNotFound)
		return
	}

	// Build the ResponseWriter.
	rw := &rw{headerMap: http.Header{}, status: 200}

	// Apply middleware chain.
	idx := 0
	var next func()
	next = func() {
		if idx < len(mw) {
			i := idx
			idx++
			mw[i](rw, req, next)
		} else {
			handler(rw, req)
		}
	}
	next()

	// Write the response.
	for k, v := range rw.headerMap {
		for _, vv := range v {
			w.Header().Add(k, vv)
		}
	}
	w.WriteHeader(rw.status)
	w.Write(rw.body)
}

// matchPattern checks if path matches a pattern like "/users/:id".
// Returns (true, params) if it matches.
func matchPattern(pattern, path string) (bool, map[string]string) {
	patternParts := strings.Split(strings.Trim(pattern, "/"), "/")
	pathParts := strings.Split(strings.Trim(path, "/"), "/")
	if len(patternParts) != len(pathParts) {
		return false, nil
	}
	params := make(map[string]string)
	for i, pp := range patternParts {
		if strings.HasPrefix(pp, ":") {
			params[pp[1:]] = pathParts[i]
		} else if strings.HasPrefix(pp, "*") {
			params[pp[1:]] = strings.Join(pathParts[i:], "/")
			return true, params
		} else if pp != pathParts[i] {
			return false, nil
		}
	}
	return true, params
}
