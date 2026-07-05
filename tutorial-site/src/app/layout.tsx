import '../styles/globals.css';

export const metadata = {
  title: 'Kungfu.js - Learn the Polyglot Web Framework',
  description: 'Interactive tutorial for Kungfu.js. Learn to build fast, secure web apps in Rust, JavaScript, Python, Go and more.',
  keywords: 'kungfu, web framework, rust, javascript, python, go, tutorial, polyglot, http, server',
  authors: [{ name: 'Resolutefemi' }],
  openGraph: {
    title: 'Kungfu.js - Learn the Polyglot Web Framework',
    description: 'Build fast, secure web apps in any language. Rust core, polyglot bindings.',
    type: 'website',
    url: 'https://kungfu.js.org',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kungfu.js - Polyglot Web Framework',
    description: 'Build fast, secure web apps in any language.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#00C853" />
      </head>
      <body>{children}</body>
    </html>
  );
}
