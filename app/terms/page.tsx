import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://eyecare.love';

export const metadata: Metadata = {
  title: 'Terms of Use | EYE CARE',
  description:
    'Terms of use for the free EYE CARE 20-20-20 timer. Plain English. Permissive, with the usual no-warranty disclaimer for health-adjacent tools.',
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function Terms() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#f5f1ea',
        color: '#1c1b18',
        fontFamily: 'var(--font-geist-sans, "Geist Sans", ui-sans-serif, system-ui, sans-serif)',
      }}
    >
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
        <div style={eyebrowStyle}>Last updated: 2026-05-24</div>
        <h1 style={h1Style}>Terms of Use</h1>

        <p style={pStyle}>
          By using EYE CARE (eyecare.love) you agree to these terms. They are short.
        </p>

        <Section heading="What you can do">
          <ul style={ulStyle}>
            <li>Use the timer for personal or commercial purposes, free.</li>
            <li>Embed the timer on your own website with the provided embed script.</li>
            <li>
              Link to articles, share the URL, send to friends, family, students, patients,
              colleagues — no permission needed.
            </li>
            <li>
              Fork the source code on GitHub. EYE CARE is open source.
            </li>
          </ul>
        </Section>

        <Section heading="Not medical advice">
          <p style={pStyle}>
            EYE CARE implements an eye-care heuristic recommended by professional eye-care
            associations, but it is not a medical device and does not replace a comprehensive
            eye exam. If you experience persistent eye discomfort, vision changes, or
            symptoms beyond ordinary screen fatigue, see a qualified eye-care professional.
          </p>
        </Section>

        <Section heading="No warranty">
          <p style={pStyle}>
            The timer is provided &quot;as is.&quot; We do our best to keep it working, accurate,
            and bug-free, but we make no guarantees about uptime, accuracy of session counts,
            or fitness for any particular purpose. Use it at your own risk.
          </p>
        </Section>

        <Section heading="Limitation of liability">
          <p style={pStyle}>
            We are not liable for any damages arising from your use of the timer, the
            articles, or any third-party links (including affiliate product links). If you
            do not accept this, the simplest remedy is to stop using the site.
          </p>
        </Section>

        <Section heading="Third-party services">
          <p style={pStyle}>
            EYE CARE displays ads via Google AdSense and uses Google Analytics (and optionally
            Plausible) for usage statistics. Your interaction with those services is governed
            by their respective terms and privacy policies. See our{' '}
            <a href="/privacy" style={inlineLink}>privacy policy</a> for details on what
            is collected.
          </p>
        </Section>

        <Section heading="Changes">
          <p style={pStyle}>
            We may update these terms. The &quot;last updated&quot; date at the top of this
            page reflects the most recent revision. Continued use after a change means you
            accept the new terms.
          </p>
        </Section>

        <Section heading="Contact">
          <p style={pStyle}>
            Questions? Reach the maintainer at{' '}
            <a href="https://x.com/K8292288065827" style={inlineLink}>@K8292288065827</a> on X
            or open an issue at{' '}
            <a href="https://github.com/syou6/eye-care-alert" style={inlineLink}>github.com/syou6/eye-care-alert</a>.
          </p>
        </Section>
      </article>
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 40 }}>
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
const pStyle: React.CSSProperties = {
  fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
  fontSize: '1.0625rem', color: '#3a352d', lineHeight: 1.7, margin: '0 0 1em',
};
const ulStyle: React.CSSProperties = {
  margin: 0, padding: '0 0 0 1.2em',
  fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
  fontSize: '1.0625rem', color: '#3a352d', lineHeight: 1.6,
};
const inlineLink: React.CSSProperties = {
  color: '#1c1b18', borderBottom: '1px solid #c47d56', textDecoration: 'none',
};
