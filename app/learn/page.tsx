import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://eyecare.love';

const ARTICLES = [
  {
    slug: 'does-the-20-20-20-rule-work',
    title: 'Does the 20-20-20 rule actually work?',
    description:
      'What the peer-reviewed evidence says about screen-break protocols — and what the rule does not solve.',
    minutes: 7,
  },
  {
    slug: 'computer-vision-syndrome',
    title: 'Computer vision syndrome: symptoms, causes, and what helps',
    description:
      'CVS affects 50-90% of regular computer users. The mechanism, the symptoms, and the evidence-based interventions that actually move the needle.',
    minutes: 7,
  },
  {
    slug: '20-20-20-rule-for-kids',
    title: 'The 20-20-20 rule for kids',
    description:
      'A parent\'s guide to screen time, the 20-20-20 rule, and how to slow childhood myopia.',
    minutes: 6,
  },
  {
    slug: '20-20-2-rule',
    title: 'The 20-20-2 rule (kids + outdoor time)',
    description:
      'The pediatric upgrade: 2 hours of outdoor time daily, on top of 20-20-20 screen breaks.',
    minutes: 6,
  },
  {
    slug: 'best-monitor-distance',
    title: 'Best monitor distance for eye health',
    description:
      'Arm\'s length, top of screen at eye level — and why getting it right reduces eye fatigue more than any other ergonomic change.',
    minutes: 5,
  },
  {
    slug: 'blue-light-glasses-vs-20-20-20',
    title: 'Blue light glasses vs the 20-20-20 rule',
    description:
      'The honest comparison: blue light glasses have thin evidence, the 20-20-20 rule costs nothing and has stronger research support.',
    minutes: 6,
  },
  {
    slug: 'dark-mode-and-eye-strain',
    title: 'Does dark mode reduce eye strain? An honest answer',
    description:
      'Dark mode helps in dim environments and hurts in bright ones. The right answer depends on lighting, task, and age.',
    minutes: 5,
  },
  {
    slug: 'dry-eye-from-screens',
    title: 'Dry eye from screens: why it happens and what helps',
    description:
      'Blink rate drops ~60% during screen use, which drives most digital dry-eye symptoms. The practical fix hierarchy, from free to clinical.',
    minutes: 5,
  },
  {
    slug: 'eye-strain-headaches',
    title: 'Eye strain headaches: when they are normal and when to worry',
    description:
      'Most afternoon screen headaches are tension or eye-strain headaches that resolve with breaks. Some warrant a doctor — here is how to tell.',
    minutes: 6,
  },
  {
    slug: 'screen-break-statistics',
    title: 'Screen break statistics & eye strain data',
    description:
      'Citable numbers on digital eye strain, screen time, and why most self-monitored break protocols fail.',
    minutes: 5,
  },
];

export const metadata: Metadata = {
  title: 'Learn — articles on the 20-20-20 rule and digital eye strain | EYE CARE',
  description:
    'Evidence-based articles on the 20-20-20 rule, childhood myopia, and digital eye strain. Practical, cited, and free.',
  alternates: { canonical: `${SITE_URL}/learn` },
  openGraph: {
    title: 'Learn — articles on the 20-20-20 rule and digital eye strain',
    description:
      'Evidence-based articles on the 20-20-20 rule, childhood myopia, and digital eye strain.',
    url: `${SITE_URL}/learn`,
    type: 'website',
  },
};

export default function LearnIndex() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'EYE CARE — Learn',
    description:
      'Evidence-based articles on the 20-20-20 rule, childhood myopia, and digital eye strain.',
    url: `${SITE_URL}/learn`,
    hasPart: ARTICLES.map((a) => ({
      '@type': 'Article',
      headline: a.title,
      description: a.description,
      url: `${SITE_URL}/learn/${a.slug}`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
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

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 96px' }}>
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
          Learn · {ARTICLES.length} articles
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
          What the eye-care research actually says.
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
          Four short, cited pieces on the 20-20-20 rule, childhood myopia, and the evidence behind
          screen-break protocols. Read one, take a 20-second break, come back to the next.
        </p>

        <div style={{ height: 1, background: 'rgba(28,27,24,.14)', margin: '48px 0' }} />

        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {ARTICLES.map((a, i) => (
            <li
              key={a.slug}
              style={{
                borderTop: i === 0 ? 'none' : '1px solid rgba(28,27,24,.12)',
                paddingTop: i === 0 ? 0 : 28,
                paddingBottom: 28,
              }}
            >
              <Link
                href={`/learn/${a.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
                    fontSize: '.625rem',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: '#7a7568',
                    marginBottom: 10,
                  }}
                >
                  {a.minutes} min read
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontFamily:
                      'ui-serif, Charter, "Iowan Old Style", "Apple Garamond", Cambria, "Times New Roman", Georgia, serif',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: '1.6rem',
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                    color: '#1c1b18',
                  }}
                >
                  {a.title}
                </h2>
                <p
                  style={{
                    margin: '10px 0 0',
                    fontFamily:
                      'ui-serif, Charter, "Iowan Old Style", "Apple Garamond", Cambria, "Times New Roman", Georgia, serif',
                    fontSize: '1.0625rem',
                    color: '#3a352d',
                    lineHeight: 1.6,
                  }}
                >
                  {a.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <aside style={{ marginTop: 56, textAlign: 'center' }}>
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
            Open EYE CARE timer →
          </Link>
        </aside>
      </main>
    </div>
  );
}
