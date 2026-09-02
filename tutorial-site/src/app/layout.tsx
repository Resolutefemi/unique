import '@/styles/globals.css';
import { PrismLoader } from '../components/PrismLoader';

export const metadata = {
  metadataBase: new URL('https://unique.js.org'),
  title: 'Unique.js - Learn the Polyglot Web Framework',
  description: 'Interactive tutorial for Unique.js. Learn to build fast, secure web apps in Rust, JavaScript, Python, Go, PHP, Ruby, C#, and more. From beginner to pro.',
  keywords: 'unique, Unique.js, web framework, rust, javascript, typescript, python, go, java, php, ruby, csharp, tutorial, polyglot, Resolute Femi, Ariyo Oluwafemi Stephen, Built by Resolute Femi',
  authors: [{ name: 'Resolute Femi (Ariyo Oluwafemi Stephen)', url: 'https://github.com/Resolutefemi' }],
  creator: 'Resolute Femi (Ariyo Oluwafemi Stephen)',
  publisher: 'Renance — Built by Resolute Femi',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Unique.js - Learn the Polyglot Web Framework',
    description: 'Build fast, secure web apps in any language. Rust core, polyglot bindings. 16 languages supported. Built by Resolute Femi (Ariyo Oluwafemi Stephen).',
    type: 'website',
    url: 'https://unique.js.org',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unique.js - Polyglot Web Framework',
    description: 'Build fast, secure web apps in any language. 16 languages supported. Built by Resolute Femi.',
    creator: '@Resolutefemi',
  },
};

const uniqueJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://github.com/Resolutefemi#person',
      name: 'Resolute Femi',
      alternateName: ['Ariyo Oluwafemi Stephen', 'Ariyo Oluwafemi', 'Resolutefemi'],
      email: 'mailto:ariyooluwafemi487@gmail.com',
      jobTitle: 'Software Engineer & Founder of Renance',
      url: 'https://github.com/Resolutefemi',
      description:
        'Resolute Femi (Ariyo Oluwafemi Stephen) is a Nigerian software engineer and founder of Renance — creator of Unique.js, the polyglot web framework with a Rust core and bindings for 16 languages.',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://unique.js.org#app',
      name: 'Unique.js',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      url: 'https://unique.js.org',
      description:
        'Unique.js is a polyglot web framework with a Rust core — build fast, secure web apps in Rust, JavaScript, Python, Go, PHP, Ruby, C# and more. Interactive tutorial site built by Resolute Femi (Ariyo Oluwafemi Stephen).',
      author: { '@id': 'https://github.com/Resolutefemi#person' },
      creator: { '@id': 'https://github.com/Resolutefemi#person' },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(uniqueJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
