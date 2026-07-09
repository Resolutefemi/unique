import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { benchmarkResults, performanceTips } from '@/data/benchmarks';

export const metadata = {
  title: 'Benchmarks — Unique.js',
  description: 'Performance benchmarks: Unique.js vs Express, FastAPI, Actix. See throughput, latency, and memory usage across 5 test scenarios.',
  keywords: 'unique.js, benchmarks, performance, throughput, latency, rust, web framework',
};

export default function BenchmarksPage() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="hero">
          <h1>Performance Benchmarks</h1>
          <p>
            Real-world performance numbers for Unique.js compared to Express.js,
            FastAPI, and Actix-web. All benchmarks run on the same hardware
            with identical test scenarios.
          </p>
        </div>

        <div className="tutorial-layout">
          <aside className="sidebar">
            <h3>Sections</h3>
            <a href="#methodology">Methodology</a>
            <a href="#hello-world">Hello World</a>
            <a href="#json-api">JSON API</a>
            <a href="#database">Database Query</a>
            <a href="#concurrent">Concurrent Connections</a>
            <a href="#memory">Memory Usage</a>
            <a href="#tips">Performance Tips</a>
          </aside>

          <main className="content">
            <section id="methodology">
              <h2>Methodology</h2>
              <p>
                All benchmarks were run on GitHub Actions CI runners with
                2-core CPUs and 8 GB RAM. The tool used is
                <code>oha</code> (a modern HTTP load tester written in Rust)
                running 30-second tests at 256 concurrent connections against
                a single server instance.
              </p>
              <p>
                Each framework was built in release mode with default
                settings. Unique.js was tested with and without the
                <code>io_uring</code> and <code>simd</code> features.
              </p>
              <pre><code className="language-bash">{`# Build all servers
cargo build --release -p unique-cli --features "unique-core/io_uring unique-core/simd"
cargo build --release -p unique-bench-actix
cd bench/express && npm install && cd ..
cd bench/fastapi && pip install -r requirements.txt && cd ..

# Run the benchmark
oha -n 1000000 -c 256 --latency-percentiles 50,90,99 http://localhost:3000/hello`}</code></pre>
            </section>

            {benchmarkResults.map((bench) => (
              <section key={bench.id} id={bench.id}>
                <h2>{bench.title}</h2>
                <p>{bench.description}</p>
                <div className="comparison-table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>Framework</th>
                        <th>Requests/sec</th>
                        <th>Avg Latency</th>
                        <th>p99 Latency</th>
                        <th>vs Unique.js</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bench.results.map((row) => (
                        <tr key={row.framework} className={row.framework.includes('Unique') ? 'highlight' : ''}>
                          <td className="feature-name">{row.framework}</td>
                          <td>{row.rps}</td>
                          <td>{row.avgLatency}</td>
                          <td>{row.p99Latency}</td>
                          <td>{row.comparison}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {bench.notes && (
                  <p><em>{bench.notes}</em></p>
                )}
              </section>
            ))}

            <section id="tips">
              <h2>Performance Tips</h2>
              <p>
                How to get the most out of Unique.js in production:
              </p>
              {performanceTips.map((tip) => (
                <div key={tip.title} className="faq-item">
                  <h3>{tip.title}</h3>
                  <p>{tip.description}</p>
                  {tip.code && (
                    <pre><code className={`language-${tip.codeLang || 'bash'}`}>{tip.code}</code></pre>
                  )}
                </div>
              ))}
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
