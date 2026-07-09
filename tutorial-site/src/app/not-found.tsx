import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="not-found">
        <div className="not-found-code">404</div>
        <h1>Page Not Found</h1>
        <p>
          The page you are looking for does not exist. It may have been moved,
          deleted, or never existed in the first place.
        </p>
        <div className="not-found-actions">
          <Link href="/" className="btn">Go Home</Link>
          <Link href="/quick-start" className="btn">Quick Start</Link>
          <Link href="/learn/rust/01-getting-started" className="btn">Tutorial</Link>
          <Link href="/api" className="btn">API Reference</Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
