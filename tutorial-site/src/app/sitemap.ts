import type { MetadataRoute } from 'next';
import { chapters, languages } from '@/data/languages';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://unique.js.org';
  const routes: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = ['/', '/quick-start', '/api', '/examples', '/faq', '/benchmarks'];
  for (const path of staticPages) {
    routes.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: path === '/' ? 1.0 : 0.8,
    });
  }

  // Tutorial pages: 16 languages × 50 chapters = 800 pages
  for (const lang of languages) {
    for (const chapter of chapters) {
      routes.push({
        url: `${baseUrl}/learn/${lang.id}/${chapter.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return routes;
}
