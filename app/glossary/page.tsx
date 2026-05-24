import type { Metadata } from 'next';
import Link from 'next/link';
import { GLOSSARY } from '@/lib/glossary';

const SITE_URL = 'https://eyecare.love';

export const metadata: Metadata = {
  title: 'Glossary — eye care terminology | EYE CARE',
  description:
    'Plain-English definitions of digital eye strain, computer vision syndrome, ciliary muscle, myopia, presbyopia, dry eye, accommodation, and blink rate.',
  alternates: { canonical: `${SITE_URL}/glossary` },
};

export default function GlossaryIndex() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'EYE CARE Glossary',
    url: `${SITE_URL}/glossary`,
    hasDefinedTerm: GLOSSARY.map((g) => ({
      '@type': 'DefinedTerm',
      name: g.term,
      description: g.short,
      url: `${SITE_URL}/glossary/${g.slug}`,
    })),
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
        <Link href="/en" style={chromeLinkSerif}>Open timer →</Link>
      </header>

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 96px' }}>
        <div style={eyebrowStyle}>Glossary · {GLOSSARY.length} terms</div>
        <h1 style={h1Style}>The vocabulary of eye care.</h1>
        <p style={leadStyle}>
          Short, plain-English definitions of the terms you will run into reading about digital
          eye strain. Each links to a longer page with related concepts.
        </p>

        <div style={{ height: 1, background: 'rgba(28,27,24,.14)', margin: '48px 0' }} />

        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {GLOSSARY.map((g, i) => (
            <li
              key={g.slug}
              style={{
                borderTop: i === 0 ? 'none' : '1px solid rgba(28,27,24,.12)',
                paddingTop: i === 0 ? 0 : 24,
                paddingBottom: 24,
              }}
            >
              <Link
                href={`/glossary/${g.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: '1.5rem',
                    color: '#1c1b18',
                  }}
                >
                  {g.term}
                </h2>
                <p
                  style={{
                    margin: '8px 0 0',
                    fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
                    fontSize: '1.0625rem',
                    color: '#3a352d',
                    lineHeight: 1.6,
                  }}
                >
                  {g.short}
                </p>
              </Link>
            </li>
          ))}
        </ul>
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
