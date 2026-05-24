import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GLOSSARY_SLUGS, getGlossaryEntry } from '@/lib/glossary';

const SITE_URL = 'https://eyecare.love';

export const dynamicParams = false;
export function generateStaticParams() {
  return GLOSSARY_SLUGS.map((term) => ({ term }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const { term } = await params;
  const entry = getGlossaryEntry(term);
  if (!entry) return {};
  return {
    title: `${entry.term} — definition | EYE CARE glossary`,
    description: entry.short,
    alternates: { canonical: `${SITE_URL}/glossary/${entry.slug}` },
    openGraph: {
      title: `${entry.term} — definition`,
      description: entry.short,
      url: `${SITE_URL}/glossary/${entry.slug}`,
      type: 'article',
    },
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term } = await params;
  const entry = getGlossaryEntry(term);
  if (!entry) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${SITE_URL}/glossary/${entry.slug}`,
    name: entry.term,
    description: entry.short,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'EYE CARE Glossary',
      url: `${SITE_URL}/glossary`,
    },
    ...(entry.alsoKnown ? { alternateName: entry.alsoKnown } : {}),
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#f5f1ea',
        color: '#1c1b18',
        fontFamily: 'var(--font-geist-sans, "Geist Sans", ui-sans-serif, system-ui, sans-serif)',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <header
        style={{
          borderBottom: '1px solid rgba(28,27,24,.14)',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/en" style={chromeLink}>EYE&nbsp;CARE</Link>
        <Link href="/glossary" style={chromeLinkSerif}>Glossary →</Link>
      </header>

      <article style={{ maxWidth: 640, margin: '0 auto', padding: '64px 24px 96px' }}>
        <div style={eyebrowStyle}>Glossary</div>
        <h1 style={h1Style}>{entry.term}</h1>
        {entry.alsoKnown && entry.alsoKnown.length > 0 && (
          <p
            style={{
              fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
              fontStyle: 'italic',
              fontSize: '.95rem',
              color: '#7a7568',
              marginTop: 8,
            }}
          >
            Also known as: {entry.alsoKnown.join(', ')}
          </p>
        )}

        <p style={leadStyle}>{entry.short}</p>

        <div style={{ height: 1, background: 'rgba(28,27,24,.14)', margin: '40px 0' }} />

        <p style={pStyle}>{entry.full}</p>

        {entry.related && entry.related.length > 0 && (
          <nav style={{ marginTop: 56, paddingTop: 28, borderTop: '1px solid rgba(28,27,24,.14)' }}>
            <div style={eyebrowStyle}>Related</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {entry.related.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    style={{
                      display: 'block',
                      padding: '12px 0',
                      borderTop: '1px solid rgba(28,27,24,.08)',
                      fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
                      fontStyle: 'italic',
                      fontSize: '1.05rem',
                      color: '#1c1b18',
                      textDecoration: 'none',
                    }}
                  >
                    {r.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <aside style={ctaStyle}>
          <div style={ctaEyebrowStyle}>EYE CARE</div>
          <div style={ctaTitleStyle}>Open the 20-20-20 timer →</div>
          <div style={{ marginTop: 18 }}>
            <Link href="/en" style={ctaButtonStyle}>Start a cycle</Link>
          </div>
        </aside>
      </article>
    </div>
  );
}

const chromeLink: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
  fontSize: '.6875rem', fontWeight: 500, letterSpacing: '.16em',
  textTransform: 'uppercase', color: '#1c1b18', textDecoration: 'none',
};
const chromeLinkSerif: React.CSSProperties = {
  fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
  fontStyle: 'italic', fontSize: '.95rem', color: '#1c1b18',
  textDecoration: 'none', borderBottom: '1px dotted rgba(28,27,24,.18)', paddingBottom: 1,
};
const eyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
  fontSize: '.625rem', letterSpacing: '.12em', textTransform: 'uppercase',
  color: '#7a7568', marginBottom: 18,
};
const h1Style: React.CSSProperties = {
  fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
  fontStyle: 'italic', fontWeight: 400,
  fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)', lineHeight: 1.05,
  letterSpacing: '-0.015em', margin: 0, color: '#1c1b18',
};
const leadStyle: React.CSSProperties = {
  fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
  fontStyle: 'italic', fontSize: '1.15rem', color: '#5a564a',
  marginTop: 22, lineHeight: 1.6,
};
const pStyle: React.CSSProperties = {
  fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
  fontSize: '1.0625rem', color: '#3a352d', lineHeight: 1.7, margin: '0 0 1em',
};
const ctaStyle: React.CSSProperties = {
  marginTop: 56, padding: '32px 28px',
  border: '1px solid rgba(28,27,24,.14)', background: '#fbf8f2',
};
const ctaEyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
  fontSize: '.6875rem', letterSpacing: '.16em', textTransform: 'uppercase',
  color: '#c47d56', marginBottom: 6,
};
const ctaTitleStyle: React.CSSProperties = {
  fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
  fontStyle: 'italic', fontSize: '1.4rem', color: '#1c1b18',
};
const ctaButtonStyle: React.CSSProperties = {
  display: 'inline-block',
  fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
  fontSize: '.75rem', letterSpacing: '.16em', textTransform: 'uppercase',
  background: '#1c1b18', color: '#f5f1ea', padding: '12px 22px',
  textDecoration: 'none', minHeight: 44,
};
