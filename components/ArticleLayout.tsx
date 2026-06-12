'use client';

// ArticleLayout — "Hours" editorial shell for /learn/* pages.
// Same masthead + palette curve as the timer.

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import { translations, HOURS_KEYS, tKey, type Language } from '@/lib/translations';
import {
  effectivePalette, paletteVars, hourLabelFor, isVigil, isRTL as hoursIsRTL,
  langLineHeight, roman, FONT_SERIF,
} from '@/lib/hours';

type ArticleMeta = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
};

type RelatedLink = { href: string; title: string };

const SITE_URL = 'https://eyecare.love';

// Article-bottom ad placement. Renders nothing until the AdSense unit is
// created and its slot ID set in NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT.
const ARTICLE_AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT ?? '';

const DEFAULT_RELATED: RelatedLink[] = [
  { href: '/learn/20-20-20-rule-for-kids', title: 'The 20-20-20 rule for kids' },
  { href: '/learn/does-the-20-20-20-rule-work', title: 'Does the 20-20-20 rule actually work?' },
  { href: '/learn/20-20-2-rule', title: 'The 20-20-2 rule (kids + outdoor time)' },
  { href: '/learn/screen-break-statistics', title: 'Screen break statistics & eye strain data' },
];

const ARTICLE_NUMBER: Record<string, number> = {
  '20-20-20-rule-for-kids': 1,
  'does-the-20-20-20-rule-work': 2,
  '20-20-2-rule': 3,
  'screen-break-statistics': 4,
};

export default function ArticleLayout({
  meta,
  children,
  lang = 'en',
  related,
}: {
  meta: ArticleMeta;
  children: ReactNode;
  lang?: Language;
  related?: RelatedLink[];
}) {
  const t = translations[lang];
  const dir: 'ltr' | 'rtl' = hoursIsRTL(lang) ? 'rtl' : 'ltr';
  const lh = langLineHeight(lang);

  const [hour, setHour] = useState(() => {
    const d = new Date();
    return d.getHours() + d.getMinutes() / 60;
  });
  useEffect(() => {
    const id = window.setInterval(() => {
      const d = new Date();
      setHour(d.getHours() + d.getMinutes() / 60);
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const [theme, setTheme] = useState<'auto' | 'light' | 'dark'>('auto');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const v = window.localStorage.getItem('hours-theme');
      if (v === 'auto' || v === 'light' || v === 'dark') setTheme(v);
    } catch {
      // ignore
    }
  }, []);

  const palette = effectivePalette(hour, theme);
  const vigil = (theme === 'auto' && isVigil(hour)) || theme === 'dark';
  const hourLabel = hourLabelFor(hour);
  const articleNumber = ARTICLE_NUMBER[meta.slug] ?? 1;
  const relatedList = (related ?? DEFAULT_RELATED).filter((r) => !r.href.endsWith(`/${meta.slug}`));

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
    <div
      dir={dir}
      style={{
        ...paletteVars(palette),
        background: 'var(--c-bg)',
        color: 'var(--c-ink)',
        minHeight: '100dvh',
        fontFamily: 'var(--font-geist-sans, "Geist Sans", ui-sans-serif, system-ui, sans-serif)',
        transition: 'background-color 1.6s ease, color 1.6s ease',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <header
        className="flex items-baseline justify-between"
        style={{ borderBottom: '1px solid var(--c-rule)', padding: '14px 20px 10px', gap: 12 }}
      >
        <Link
          href={`/${lang}`}
          className="flex items-baseline gap-3 min-w-0"
          style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}
        >
          <span style={{
            fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
            fontSize: '.6875rem', fontWeight: 500, letterSpacing: '.16em',
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>
            {vigil ? '☾ ' : ''}EYE&nbsp;CARE
          </span>
          <span style={{
            fontFamily: FONT_SERIF, fontStyle: 'italic',
            fontSize: '.82rem', color: 'var(--c-mute)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {hourLabel}
          </span>
        </Link>
        <Link
          href={`/${lang}`}
          style={{
            fontFamily: FONT_SERIF, fontStyle: 'italic',
            fontSize: '.95rem', color: 'var(--c-ink)',
            textDecoration: 'none',
            borderBottom: '1px dotted var(--c-rule)', paddingBottom: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {tKey(lang, 'openTimer')} →
        </Link>
      </header>

      <article style={{ maxWidth: 660, margin: '0 auto', padding: '56px 24px 0', width: '100%' }}>
        <div style={{
          fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
          fontSize: '.625rem', letterSpacing: '.12em', textTransform: 'uppercase',
          color: 'var(--c-mute)', marginBottom: 18,
        }}>
          Learn · {roman(articleNumber)} · {meta.readingMinutes} min · {hourLabel.toUpperCase()}
        </div>

        <h1 style={{
          fontFamily: FONT_SERIF, fontStyle: 'italic', fontWeight: 400,
          fontSize: 'clamp(2rem, 6.5cqw, 4rem)', lineHeight: 1.05,
          letterSpacing: '-0.015em',
          margin: 0, color: 'var(--c-ink)',
        }}>
          {meta.title}
        </h1>

        <p style={{
          fontFamily: FONT_SERIF, fontStyle: 'italic',
          fontSize: '1.125rem', color: 'var(--c-mute)',
          marginTop: 22, lineHeight: Math.max(lh, 1.55),
        }}>
          {meta.description}
        </p>

        <div style={{ height: 1, background: 'var(--c-rule)', margin: '40px 0' }} />

        <div
          className="hours-prose"
          style={{
            fontFamily: FONT_SERIF, color: 'var(--c-ink)',
            fontSize: '1.0625rem', lineHeight: lh, fontWeight: 400,
          }}
        >
          {children}
        </div>

        {ARTICLE_AD_SLOT && (
          <div style={{ borderTop: '1px solid var(--c-rule)', marginTop: 40, paddingTop: 16 }}>
            <div style={{
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: '.625rem', letterSpacing: '.12em', textTransform: 'uppercase',
              color: 'var(--c-mute)', marginBottom: 10,
            }}>
              Sponsored
            </div>
            <AdSlot slot={ARTICLE_AD_SLOT} format="auto" reservedHeight={120} />
          </div>
        )}

        <Link
          href={`/${lang}`}
          style={{
            display: 'block', textDecoration: 'none',
            margin: '36px 0', padding: '20px 22px',
            border: '1px solid var(--c-rule)',
            background: 'var(--c-surface)', color: 'var(--c-ink)',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
            fontSize: '.6875rem', letterSpacing: '.16em', textTransform: 'uppercase',
            color: 'var(--c-primary)', marginBottom: 6,
          }}>
            {t.title}
          </div>
          <div style={{
            fontFamily: FONT_SERIF, fontStyle: 'italic',
            fontSize: '1.25rem', color: 'var(--c-ink)',
          }}>
            {tKey(lang, 'openTimer')} → 20:00
          </div>
        </Link>

        {relatedList.length > 0 && (
          <nav style={{ borderTop: '1px solid var(--c-rule)', paddingTop: 28, marginTop: 56, marginBottom: 64 }}>
            <div style={{
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: '.6875rem', letterSpacing: '.16em', textTransform: 'uppercase',
              color: 'var(--c-mute)', marginBottom: 14,
            }}>
              {tKey(lang, 'relatedReading')}
            </div>
            {relatedList.map((r, i) => (
              <Link
                key={r.href}
                href={r.href}
                style={{
                  display: 'flex', alignItems: 'baseline', gap: 14,
                  padding: '14px 0',
                  borderTop: i === 0 ? 'none' : '1px solid var(--c-rule)',
                  textDecoration: 'none', color: 'var(--c-ink)',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
                  fontSize: '.625rem', letterSpacing: '.12em', textTransform: 'uppercase',
                  color: 'var(--c-mute)', width: 30,
                }}>
                  {roman(i + 2)}
                </span>
                <span style={{ fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: '1.05rem' }}>
                  {r.title}
                </span>
              </Link>
            ))}
          </nav>
        )}
      </article>

      <style jsx global>{`
        .hours-prose p { margin: 0 0 1.1em; }
        .hours-prose p:first-child::first-letter {
          font-family: ${FONT_SERIF};
          font-style: italic;
          float: ${dir === 'rtl' ? 'right' : 'left'};
          font-size: 3.6em;
          line-height: .88;
          margin: 0 ${dir === 'rtl' ? '0 -.05em 8px' : '8px -.05em 0'};
          color: var(--c-primary);
        }
        .hours-prose h2 {
          font-family: ${FONT_SERIF};
          font-style: italic;
          font-size: 1.625rem;
          line-height: 1.25;
          margin: 2em 0 .6em;
          color: var(--c-ink);
        }
        .hours-prose h3 {
          font-family: ${FONT_SERIF};
          font-style: italic;
          font-size: 1.25rem;
          margin: 1.6em 0 .4em;
          color: var(--c-ink);
        }
        .hours-prose ul, .hours-prose ol {
          margin: 0 0 1.1em 1.4em;
          padding: 0;
        }
        .hours-prose li { margin: 0 0 .4em; }
        .hours-prose a {
          color: var(--c-ink);
          text-decoration: none;
          border-bottom: 1px solid var(--c-primary);
          padding-bottom: 1px;
        }
        .hours-prose blockquote {
          margin: 1.4em 0;
          padding-inline-start: 1.4em;
          border-inline-start: 2px solid var(--c-primary);
          color: var(--c-mute);
          font-style: italic;
        }
        .hours-prose strong { font-weight: 600; }
        .hours-prose em { font-style: italic; }
      `}</style>
    </div>
  );
}
