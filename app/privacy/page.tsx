import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://eyecare.love';

export const metadata: Metadata = {
  title: 'Privacy Policy | EYE CARE',
  description:
    'How EYE CARE handles your data: localStorage-only state, optional cookieless analytics, Google AdSense disclosures, and what we do not collect.',
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function Privacy() {
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
        <h1 style={h1Style}>Privacy Policy</h1>

        <p style={pStyle}>
          EYE CARE is a free 20-20-20 timer. We try to handle your data with the same restraint
          we hope you take with your eyes. Plain English below — and a one-line summary first:{' '}
          <strong>your timer state, theme, and language preference live in your browser only;
          we add anonymous analytics and Google AdSense, both standard for free web tools, and
          nothing else.</strong>
        </p>

        <Section heading="What we store on your device">
          <ul style={ulStyle}>
            <li>
              <strong>localStorage</strong> on your browser holds: your selected language,
              theme, completed-session count, daily streak, and a flag for whether you have
              seen the welcome screen. We never send this to a server.
            </li>
            <li>
              <strong>Service Worker cache</strong> for offline use stores a copy of the
              timer page and assets in your browser. Cleared whenever you clear your browser
              data.
            </li>
          </ul>
        </Section>

        <Section heading="What we collect, anonymously">
          <ul style={ulStyle}>
            <li>
              <strong>Google Analytics 4</strong> records page views and basic device
              information (country, browser, screen size). We do not enable advertising
              features in GA4. You can opt out via the standard Google Analytics opt-out
              browser add-on.
            </li>
            <li>
              <strong>Plausible Analytics</strong> (optional, may or may not be active on a
              given visit) records cookieless, IP-anonymized page views with no personal
              identifiers.
            </li>
          </ul>
        </Section>

        <Section heading="What Google AdSense does">
          <p style={pStyle}>
            EYE CARE displays ads served by Google AdSense (publisher ID
            ca-pub-6158728857323077). Google may set cookies and use device identifiers to
            personalize ads. You can review and adjust what Google knows about you at{' '}
            <a href="https://adssettings.google.com/" style={inlineLink}>adssettings.google.com</a>{' '}
            and opt out of personalized ads industry-wide at{' '}
            <a href="https://optout.aboutads.info/" style={inlineLink}>optout.aboutads.info</a>.
          </p>
          <p style={pStyle}>
            We do not target ads to children, do not display ads in our welcome flow, and try
            to keep ad density low compared to other free tool sites.
          </p>
        </Section>

        <Section heading="What we do not collect">
          <ul style={ulStyle}>
            <li>No account, no email, no name, no phone number.</li>
            <li>No biometric data.</li>
            <li>No screen recording or screenshot of your other tabs.</li>
            <li>No tracking across other websites.</li>
            <li>No data sale to third parties.</li>
          </ul>
        </Section>

        <Section heading="Affiliate links">
          <p style={pStyle}>
            Some links to products (blue light glasses, eye drops, monitor lights) are
            affiliate links. If you click and buy, the merchant pays us a small commission at
            no cost to you. We mark all such links with <code>rel=&quot;sponsored&quot;</code> per
            FTC and Google guidelines.
          </p>
        </Section>

        <Section heading="Children">
          <p style={pStyle}>
            EYE CARE is appropriate for children and explicitly recommended for them by
            pediatric eye-care guidelines. We do not knowingly collect personal information
            from anyone under 13. If you believe a child has shared personal data with us
            (other than localStorage on their own device), contact us and we will delete it.
          </p>
        </Section>

        <Section heading="Changes">
          <p style={pStyle}>
            We may update this policy. The &quot;last updated&quot; date at the top of this
            page reflects the most recent revision. Material changes will be announced via a
            short notice in the welcome flow.
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
