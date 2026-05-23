import Link from 'next/link';
import type { ReactNode } from 'react';

type ArticleMeta = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
};

const SITE_URL = 'https://eyecare.love';

export default function ArticleLayout({
  meta,
  children,
}: {
  meta: ArticleMeta;
  children: ReactNode;
}) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.description,
    datePublished: meta.publishedAt,
    dateModified: meta.updatedAt ?? meta.publishedAt,
    author: { '@type': 'Person', name: 'Sho Kawamoto' },
    publisher: {
      '@type': 'Organization',
      name: 'EYE CARE',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/learn/${meta.slug}` },
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <header className="border-b border-gray-200 bg-white/70 backdrop-blur sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/en" className="font-light tracking-widest text-gray-800">
            EYE CARE
          </Link>
          <Link
            href="/en"
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            Open timer →
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
          {meta.readingMinutes} min read
        </p>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-tight mb-4">
          {meta.title}
        </h1>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">{meta.description}</p>

        <div className="prose prose-lg max-w-none prose-headings:font-light prose-headings:tracking-tight prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
          {children}
        </div>

        <aside className="mt-16 p-8 rounded-3xl bg-white shadow-xl border border-gray-200 text-center">
          <p className="text-sm text-gray-500 mb-3">Ready to start protecting your eyes?</p>
          <h2 className="text-2xl font-light mb-4">Try the free 20-20-20 timer</h2>
          <Link
            href="/en"
            className="inline-block px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
          >
            Open EYE CARE timer
          </Link>
          <p className="text-xs text-gray-400 mt-3">Free forever • 12 languages • No signup</p>
        </aside>

        <nav className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Related reading</p>
          <ul className="space-y-2 text-blue-600">
            <li>
              <Link href="/learn/20-20-20-rule-for-kids" className="hover:underline">
                The 20-20-20 rule for kids
              </Link>
            </li>
            <li>
              <Link href="/learn/does-the-20-20-20-rule-work" className="hover:underline">
                Does the 20-20-20 rule actually work?
              </Link>
            </li>
            <li>
              <Link href="/learn/20-20-2-rule" className="hover:underline">
                The 20-20-2 rule (kids + outdoor time)
              </Link>
            </li>
            <li>
              <Link href="/learn/screen-break-statistics" className="hover:underline">
                Screen break statistics &amp; eye strain data
              </Link>
            </li>
          </ul>
        </nav>
      </article>

      <footer className="border-t border-gray-200 bg-white py-8 mt-16">
        <div className="max-w-3xl mx-auto px-6 text-center text-xs text-gray-500">
          <Link href="/en" className="hover:underline">eyecare.love</Link> · Free 20-20-20 timer
        </div>
      </footer>
    </div>
  );
}
