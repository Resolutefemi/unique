import '@/styles/globals.css';
import { PrismLoader } from '../components/PrismLoader';

export const metadata = {
  title: 'Unique.js - Learn the Polyglot Web Framework',
  description: 'Interactive tutorial for Unique.js. Learn to build fast, secure web apps in Rust, JavaScript, Python, Go, PHP, Ruby, C#, and more. From beginner to pro.',
  keywords: 'unique, web framework, rust, javascript, typescript, python, go, java, php, ruby, csharp, tutorial, polyglot',
  authors: [{ name: 'Resolutefemi' }],
  openGraph: {
    title: 'Unique.js - Learn the Polyglot Web Framework',
    description: 'Build fast, secure web apps in any language. Rust core, polyglot bindings. 16 languages supported.',
    type: 'website',
    url: 'https://unique.js.org',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unique.js - Polyglot Web Framework',
    description: 'Build fast, secure web apps in any language. 16 languages supported.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#00C853" />
        {/* Preconnect to cdnjs so Prism.js + theme CSS load faster */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
      </head>
      <body>
        <PrismLoader />
        {children}
      </body>
    </html>
  );
}
