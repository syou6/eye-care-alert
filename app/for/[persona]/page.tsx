import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPersona, PERSONA_SLUGS } from '@/lib/personas';

const SITE_URL = 'https://eyecare.love';

export const dynamicParams = false;

export function generateStaticParams() {
  return PERSONA_SLUGS.map((persona) => ({ persona }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ persona: string }>;
}): Promise<Metadata> {
  const { persona } = await params;
  const p = getPersona(persona);
  if (!p) return {};
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: { canonical: `${SITE_URL}/for/${p.slug}` },
    openGraph: {
      title: p.metaTitle,
      description: p.metaDescription,
      url: `${SITE_URL}/for/${p.slug}`,
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: p.metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: p.metaTitle,
      description: p.metaDescription,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

export default async function PersonaPage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona } = await params;
  const p = getPersona(persona);
  if (!p) notFound();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: p.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'EYE CARE', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: `For ${p.audience}`,
        item: `${SITE_URL}/for/${p.slug}`,
      },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <header
        style={{
          borderBottom: '1px solid rgba(28,27,24,.14)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <Link
          href="/en"
          style={{
            fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
            fontSize: '.6875rem',
            fontWeight: 500,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: '#1c1b18',
            textDecoration: 'none',
          }}
        >
          EYE&nbsp;CARE
        </Link>
        <Link
          href="/en"
          style={{
            fontFamily:
              'ui-serif, Charter, "Iowan Old Style", "Apple Garamond", Cambria, "Times New Roman", Georgia, serif',
            fontStyle: 'italic',
            fontSize: '.95rem',
            color: '#1c1b18',
            textDecoration: 'none',
            borderBottom: '1px dotted rgba(28,27,24,.18)',
            paddingBottom: 1,
          }}
        >
          Open timer →
        </Link>
      </header>

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 96px' }}>
        <div
          style={{
            fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
            fontSize: '.625rem',
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: '#7a7568',
            marginBottom: 18,
          }}
        >
          For {p.audience}
        </div>

        <h1
          style={{
            fontFamily:
              'ui-serif, Charter, "Iowan Old Style", "Apple Garamond", Cambria, "Times New Roman", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.015em',
            margin: 0,
            color: '#1c1b18',
          }}
        >
          A 20-20-20 timer for {p.audience}.
        </h1>

        <p
          style={{
            fontFamily:
              'ui-serif, Charter, "Iowan Old Style", "Apple Garamond", Cambria, "Times New Roman", Georgia, serif',
            fontStyle: 'italic',
            fontSize: '1.15rem',
            color: '#5a564a',
            marginTop: 22,
            lineHeight: 1.6,
          }}
        >
          {p.intro}
        </p>

        <div style={{ margin: '32px 0' }}>
          <Link
            href="/en"
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: '.75rem',
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              background: '#1c1b18',
              color: '#f5f1ea',
              padding: '14px 24px',
              textDecoration: 'none',
              minHeight: 44,
            }}
          >
            Open the timer →
          </Link>
        </div>

        <Section heading={p.whyHeadline}>
          <ul style={ulStyle}>
            {p.whyBullets.map((b, i) => (
              <li key={i} style={liStyle}>
                {b}
              </li>
            ))}
          </ul>
        </Section>

        <Section heading={p.howHeadline}>
          <p style={pStyle}>{p.howBody}</p>
        </Section>

        <Section heading={p.pitfallsHeadline}>
          <p style={pStyle}>{p.pitfallsBody}</p>
        </Section>

        <Section heading="Common questions">
          <dl style={{ margin: 0 }}>
            {p.faq.map((item, i) => (
              <div
                key={i}
                style={{
                  paddingTop: i === 0 ? 0 : 22,
                  marginTop: i === 0 ? 0 : 22,
                  borderTop: i === 0 ? 'none' : '1px solid rgba(28,27,24,.12)',
                }}
              >
                <dt
                  style={{
                    fontFamily:
                      'ui-serif, Charter, "Iowan Old Style", "Apple Garamond", Cambria, "Times New Roman", Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: '1.25rem',
                    color: '#1c1b18',
                    marginBottom: 8,
                    lineHeight: 1.25,
                  }}
                >
                  {item.q}
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontFamily:
                      'ui-serif, Charter, "Iowan Old Style", "Apple Garamond", Cambria, "Times New Roman", Georgia, serif',
                    fontSize: '1.0625rem',
                    color: '#3a352d',
                    lineHeight: 1.7,
                  }}
                >
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <aside
          style={{
            marginTop: 56,
            padding: '32px 28px',
            border: '1px solid rgba(28,27,24,.14)',
            background: '#fbf8f2',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: '.6875rem',
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: '#c47d56',
              marginBottom: 6,
            }}
          >
            EYE CARE
          </div>
          <div
            style={{
              fontFamily:
                'ui-serif, Charter, "Iowan Old Style", "Apple Garamond", Cambria, "Times New Roman", Georgia, serif',
              fontStyle: 'italic',
              fontSize: '1.4rem',
              color: '#1c1b18',
            }}
          >
            Start a 20-minute cycle for your eyes →
          </div>
          <div style={{ marginTop: 20 }}>
            <Link
              href="/en"
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
                fontSize: '.75rem',
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                background: '#1c1b18',
                color: '#f5f1ea',
                padding: '12px 22px',
                textDecoration: 'none',
                minHeight: 44,
              }}
            >
              Open EYE CARE
            </Link>
          </div>
        </aside>

        <nav
          style={{
            marginTop: 56,
            paddingTop: 28,
            borderTop: '1px solid rgba(28,27,24,.14)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: '.6875rem',
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: '#7a7568',
              marginBottom: 14,
            }}
          >
            Related reading
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <Link href="/learn/does-the-20-20-20-rule-work" style={relatedLink}>
                Does the 20-20-20 rule actually work? →
              </Link>
            </li>
            <li>
              <Link href="/learn/screen-break-statistics" style={relatedLink}>
                Screen break statistics &amp; eye strain data →
              </Link>
            </li>
            <li>
              <Link href="/learn/20-20-20-rule-for-kids" style={relatedLink}>
                The 20-20-20 rule for kids →
              </Link>
            </li>
            <li>
              <Link href="/learn/20-20-2-rule" style={relatedLink}>
                The 20-20-2 rule (kids + outdoor time) →
              </Link>
            </li>
            <li>
              <Link href="/learn" style={relatedLink}>
                All articles →
              </Link>
            </li>
          </ul>
        </nav>
      </article>
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 48 }}>
      <h2
        style={{
          fontFamily:
            'ui-serif, Charter, "Iowan Old Style", "Apple Garamond", Cambria, "Times New Roman", Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '1.75rem',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          margin: '0 0 14px',
          color: '#1c1b18',
        }}
      >
        {heading}
      </h2>
      {children}
    </section>
  );
}

const pStyle: React.CSSProperties = {
  fontFamily:
    'ui-serif, Charter, "Iowan Old Style", "Apple Garamond", Cambria, "Times New Roman", Georgia, serif',
  fontSize: '1.0625rem',
  color: '#3a352d',
  lineHeight: 1.7,
  margin: 0,
};

const ulStyle: React.CSSProperties = {
  margin: 0,
  padding: 0,
  listStyle: 'none',
};

const liStyle: React.CSSProperties = {
  fontFamily:
    'ui-serif, Charter, "Iowan Old Style", "Apple Garamond", Cambria, "Times New Roman", Georgia, serif',
  fontSize: '1.0625rem',
  color: '#3a352d',
  lineHeight: 1.6,
  marginBottom: 14,
  paddingInlineStart: 22,
  position: 'relative',
};

const relatedLink: React.CSSProperties = {
  display: 'block',
  padding: '12px 0',
  borderTop: '1px solid rgba(28,27,24,.08)',
  fontFamily:
    'ui-serif, Charter, "Iowan Old Style", "Apple Garamond", Cambria, "Times New Roman", Georgia, serif',
  fontStyle: 'italic',
  fontSize: '1.05rem',
  color: '#1c1b18',
  textDecoration: 'none',
};
