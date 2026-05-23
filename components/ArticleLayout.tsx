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

const RELATED: { href: string; title: string }[] = [
  { href: '/learn/20-20-20-rule-for-kids', title: 'The 20-20-20 rule for kids' },
  { href: '/learn/does-the-20-20-20-rule-work', title: 'Does the 20-20-20 rule actually work?' },
  { href: '/learn/20-20-2-rule', title: 'The 20-20-2 rule (kids + outdoor time)' },
  { href: '/learn/screen-break-statistics', title: 'Screen break statistics & eye strain data' },
];

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

  const related = RELATED.filter((r) => !r.href.endsWith(`/${meta.slug}`));

  return (
    <div className="min-h-[100dvh] bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#0a0a0a] dark:text-[#f5f5f7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <header className="sticky top-0 z-30 backdrop-blur bg-[#f5f5f7]/80 dark:bg-[#0a0a0a]/80 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <Link
            href="/en"
            className="inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]"
          >
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#eef2ff] dark:bg-[#0a84ff]/20 text-[#007aff] dark:text-[#0a84ff]">
              <svg width="14" height="10" viewBox="0 0 18 12" fill="none" aria-hidden>
                <path d="M1 6 C 4 1, 14 1, 17 6 C 14 11, 4 11, 1 6 Z" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="9" cy="6" r="2.4" fill="currentColor" />
              </svg>
            </span>
            EYE CARE
          </Link>
          <Link
            href="/en"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#007aff] dark:bg-[#0a84ff] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M3.5 2.5 L11 7 L3.5 11.5 Z" fill="currentColor" />
            </svg>
            Open timer
          </Link>
        </div>
      </header>

      <article className="max-w-2xl mx-auto px-5 py-12">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#6e6e73] dark:text-[#86868b] font-mono">
          {meta.readingMinutes} min read
        </p>
        <h1 className="mt-3 text-[clamp(2rem,5vw,2.75rem)] font-semibold tracking-tight leading-[1.1] text-[#1d1d1f] dark:text-[#f5f5f7]">
          {meta.title}
        </h1>
        <p className="mt-4 text-lg text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
          {meta.description}
        </p>

        <div className="mt-10 h-px bg-black/[0.06] dark:bg-white/[0.08]" />

        <div className="article-prose mt-10 text-[#1d1d1f] dark:text-[#f5f5f7]">{children}</div>

        <Link
          href="/en"
          className="mt-12 block rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#161618] p-6 hover:bg-[#fafafa] dark:hover:bg-[#1c1c1e] transition-colors"
        >
          <div className="text-[11px] uppercase tracking-[0.12em] text-[#007aff] dark:text-[#0a84ff] font-mono font-semibold mb-2">
            EYE CARE
          </div>
          <div className="text-[18px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
            Open the free timer →
          </div>
          <div className="mt-1 text-[13px] text-[#6e6e73] dark:text-[#86868b]">
            12 languages · works offline · no signup
          </div>
        </Link>

        {related.length > 0 && (
          <nav className="mt-12 pt-8 border-t border-black/[0.06] dark:border-white/[0.08]">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#6e6e73] dark:text-[#86868b] font-mono mb-4">
              Related reading
            </p>
            <ul className="divide-y divide-black/[0.06] dark:divide-white/[0.08]">
              {related.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="flex items-center justify-between py-3 text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#007aff] dark:hover:text-[#0a84ff] transition-colors"
                  >
                    <span>{r.title}</span>
                    <span className="text-[#c7c7cc]">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>

      <footer className="py-8 text-center text-[12px] text-[#6e6e73] dark:text-[#86868b]">
        <Link href="/en" className="hover:underline">eyecare.love</Link>
        <span className="opacity-50 mx-2">·</span>
        Free 20-20-20 timer
      </footer>

      <style>{`
        .article-prose { font-size: 17px; line-height: 1.7; }
        .article-prose p { margin: 0 0 1.1em; }
        .article-prose h2 { margin: 1.8em 0 .5em; font-size: 1.5rem; font-weight: 600; letter-spacing: -0.015em; line-height: 1.25; }
        .article-prose h3 { margin: 1.4em 0 .4em; font-size: 1.125rem; font-weight: 600; letter-spacing: -0.01em; }
        .article-prose ul, .article-prose ol { margin: 0 0 1.1em 1.4em; padding: 0; }
        .article-prose li { margin: 0 0 .4em; }
        .article-prose a { color: #007aff; text-decoration: none; border-bottom: 1px solid currentColor; padding-bottom: 1px; }
        .article-prose a:hover { opacity: .7; }
        .article-prose strong { font-weight: 600; }
        .article-prose em { font-style: italic; }
        @media (prefers-color-scheme: dark) {
          .article-prose a { color: #0a84ff; }
        }
      `}</style>
    </div>
  );
}
