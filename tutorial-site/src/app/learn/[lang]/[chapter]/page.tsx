import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { chapters, languages } from '@/data/languages';
import { getChapterContent } from '@/data/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = languages.find(l => l.id === params.lang);
  if (!lang) return {};
  return {
    title: `Unique.js Tutorial - ${lang.name} - From Beginner to Pro`,
    description: `Learn Unique.js in ${lang.name}. Complete tutorial from installation to deployment. ${lang.description}`,
    keywords: `unique, ${lang.name}, tutorial, web framework, ${lang.fileExtension}`,
    openGraph: {
      title: `Learn Unique.js in ${lang.name}`,
      description: `Complete ${lang.name} tutorial for the Unique.js polyglot web framework.`,
    },
  };
}

export default async function TutorialPage({
  params,
}: {
  params: { lang: string; chapter: string };
}) {
  const lang = languages.find((l) => l.id === params.lang);
  if (!lang) notFound();

  const chapterIndex = chapters.findIndex((c) => c.slug === params.chapter);
  if (chapterIndex === -1) notFound();

  const chapter = chapters[chapterIndex];
  const prev = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const next = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  const content = getChapterContent(params.lang, params.chapter);

  return (
    <>
      <Navbar />
      <div className="tutorial-layout">
        <aside className="sidebar">
          <h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lang.iconUrl} alt={lang.name} width={20} height={20} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            {lang.name}
          </h3>
          {chapters.map((c, i) => (
            <Link
              key={c.slug}
              href={`/learn/${params.lang}/${c.slug}`}
              className={c.slug === params.chapter ? 'active' : ''}
            >
              {i + 1}. {c.title}
            </Link>
          ))}
          <h3>Other Languages</h3>
          {languages.filter(l => l.id !== params.lang).map(l => (
            <Link key={l.id} href={`/learn/${l.id}/01-getting-started`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.iconUrl} alt={l.name} width={16} height={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              {l.name}
            </Link>
          ))}
        </aside>
        <main className="content">
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <div className="btn-row">
            {prev ? (
              <Link href={`/learn/${params.lang}/${prev.slug}`} className="btn">
                Previous: {prev.title}
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/learn/${params.lang}/${next.slug}`} className="btn">
                Next: {next.title}
              </Link>
            ) : <span />}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export async function generateStaticParams() {
  const params: { lang: string; chapter: string }[] = [];
  for (const lang of languages) {
    for (const chapter of chapters) {
      params.push({ lang: lang.id, chapter: chapter.slug });
    }
  }
  return params;
}

