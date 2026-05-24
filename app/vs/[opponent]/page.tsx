import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { COMPARISON_SLUGS, getComparison } from '@/lib/comparisons';

const SITE_URL = 'https://eyecare.love';

export const dynamicParams = false;
export function generateStaticParams() {
  return COMPARISON_SLUGS.map((opponent) => ({ opponent }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ opponent: string }>;
}): Promise<Metadata> {
  const { opponent } = await params;
  const c = getComparison(opponent);
  if (!c) return {};
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: `${SITE_URL}/vs/${c.slug}` },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url: `${SITE_URL}/vs/${c.slug}`,
      type: 'article',
    },
  };
}

export default async function VsPage({
  params,
}: {
  params: Promise<{ opponent: string }>;
}) {
  const { opponent } = await params;
  const c = getComparison(opponent);
  if (!c) notFound();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'EYE CARE', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: `EYE CARE vs ${c.vs}`, item: `${SITE_URL}/vs/${c.slug}` },
    ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px 96px' }}>
        <div style={eyebrowStyle}>Comparison</div>
        <h1 style={h1Style}>
          EYE CARE <em style={{ color: '#7a7568', fontWeight: 300 }}>vs</em> {c.vs}.
        </h1>
        <p style={leadStyle}>{c.oneLiner}</p>

        <div style={{ marginTop: 32 }}>
          <Link href="/en" style={ctaButtonStyle}>Open EYE CARE →</Link>
          {c.vsUrl && (
            <a
              href={c.vsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginInlineStart: 18,
                fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
                fontStyle: 'italic',
                color: '#1c1b18',
                padding: '12px 16px',
                textDecoration: 'none',
                borderBottom: '1px dotted rgba(28,27,24,.18)',
                fontSize: '.95rem',
              }}
            >
              Visit {c.vs} →
            </a>
          )}
        </div>

        <Section heading="When EYE CARE is the better fit">
          <p style={pStyle}>{c.whenToUseUs}</p>
        </Section>

        <Section heading={`When ${c.vs} is the better fit`}>
          <p style={pStyle}>{c.whenToUseThem}</p>
        </Section>

        <Section heading="Feature-by-feature">
          <div
            style={{
              borderTop: '1px solid rgba(28,27,24,.14)',
              borderBottom: '1px solid rgba(28,27,24,.14)',
            }}
          >
            {c.rows.map((r, i) => (
              <div
                key={r.feature}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1fr',
                  gap: 16,
                  padding: '14px 4px',
                  borderTop: i === 0 ? 'none' : '1px solid rgba(28,27,24,.08)',
                  fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
                  fontSize: '.95rem',
                  lineHeight: 1.5,
                  color: '#3a352d',
                }}
              >
                <div
                  style={{
                    fontFamily:
                      'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
                    fontSize: '.65rem',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: '#7a7568',
                  }}
                >
                  {r.feature}
                </div>
                <div style={{ color: '#1c1b18' }}>
                  <span style={{ color: '#c47d56', fontStyle: 'italic' }}>EYE CARE: </span>
                  {r.us}
                </div>
                <div>
                  <span style={{ color: '#7a7568', fontStyle: 'italic' }}>{c.vs}: </span>
                  {r.them}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section heading="Our pitch">
          <p style={pStyle}>{c.ourPitch}</p>
        </Section>

        <Section heading="Verdict">
          <p style={pStyle}>{c.verdict}</p>
        </Section>

        <aside style={ctaCardStyle}>
          <div style={ctaEyebrowStyle}>EYE CARE</div>
          <div style={ctaTitleStyle}>Start a 20-minute cycle →</div>
          <div style={{ marginTop: 18 }}>
            <Link href="/en" style={ctaButtonStyle}>Open the timer</Link>
          </div>
        </aside>
      </article>
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 44 }}>
      <h2 style={h2Style}>{heading}</h2>
      {children}
    </section>
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
const h2Style: React.CSSProperties = {
  fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
  fontStyle: 'italic', fontWeight: 400, fontSize: '1.5rem',
  margin: '0 0 14px', color: '#1c1b18',
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
const ctaCardStyle: React.CSSProperties = {
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
