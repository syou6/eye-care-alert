import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://eyecare.love';

export const metadata: Metadata = {
  title: 'About EYE CARE | A free 20-20-20 timer for digital eye strain',
  description:
    'About EYE CARE: who built it, why, and what it is and is not. Free 20-20-20 timer, 12 languages, no signup, open source.',
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function About() {
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
        <div style={eyebrowStyle}>About</div>
        <h1 style={h1Style}>A quiet timer for your eyes.</h1>

        <p style={leadStyle}>
          EYE CARE is a free, in-browser 20-20-20 rule timer for anyone who spends their day
          on screens. No signup. No install. 12 languages. Works offline once installed as a
          PWA. Open source.
        </p>

        <Section heading="Why this exists">
          <p style={pStyle}>
            Every 20-20-20 timer on the web looked the same: a blue circle on a gradient, a
            big sans-serif number, a Start button. They worked, but they did not feel like
            things you would actually want open on a monitor all day. I wanted something
            quieter — closer to{' '}
            <a href="https://ia.net/writer" style={inlineLink}>iA Writer</a> or{' '}
            <a href="https://culturedcode.com/things/" style={inlineLink}>Things 3</a> than
            to a productivity dashboard.
          </p>
          <p style={pStyle}>
            And I wanted the eye-care articles to feel like part of the same product, not a
            separate blog theme. So both share the same masthead, the same time-of-day
            palette, the same italic serif typography.
          </p>
        </Section>

        <Section heading="What it is">
          <ul style={ulStyle}>
            <li>
              A faithful implementation of the 20-20-20 rule recommended by the American
              Optometric Association.
            </li>
            <li>
              A reducer-based, timestamp-driven timer (no drift, survives background-tab
              throttling, syncs on visibility change).
            </li>
            <li>
              12 SSG language routes with hreflang, JSON-LD (WebApplication / FAQPage / HowTo
              / Article), and a /llms.txt for AI crawlers.
            </li>
            <li>
              A PWA — install it to your home screen and it works offline.
            </li>
            <li>
              Open source on{' '}
              <a href="https://github.com/syou6/eye-care-alert" style={inlineLink}>GitHub</a>.
              Issues and PRs welcome, especially translations and persona pages.
            </li>
          </ul>
        </Section>

        <Section heading="What it is not">
          <ul style={ulStyle}>
            <li>
              A medical device. EYE CARE does not diagnose, treat, or cure any condition.
              See an eye-care professional for actual eye problems.
            </li>
            <li>
              A productivity app. We do not track tasks, projects, or time blocks. Use a real
              tool for that.
            </li>
            <li>
              A monetization machine. There is one optional donation prompt every 10 sessions,
              one Google AdSense unit in the break overlay (when configured), and a small
              affiliate strip. That is it.
            </li>
          </ul>
        </Section>

        <Section heading="How it is funded">
          <p style={pStyle}>
            Three sources, none of which require you to do anything:
          </p>
          <ul style={ulStyle}>
            <li>
              <strong>Google AdSense</strong> — one unit at the bottom of the break overlay,
              shown only after the first 5 seconds of the break.
            </li>
            <li>
              <strong>Affiliate links</strong> — blue light glasses, eye drops, monitor
              lights. Marked <code>rel=&quot;sponsored&quot;</code>. We get a small cut if
              you buy through the link.
            </li>
            <li>
              <strong>Donations</strong> via{' '}
              <a href="https://buymeacoffee.com/shokawamoto" style={inlineLink}>Buy Me a Coffee</a>.
              Genuinely optional.
            </li>
          </ul>
        </Section>

        <Section heading="Who built it">
          <p style={pStyle}>
            Sho Kawamoto — an indie developer based in Japan, working on small consumer web
            tools. Find me on{' '}
            <a href="https://x.com/K8292288065827" style={inlineLink}>X (@K8292288065827)</a>.
            EYE CARE is the project I keep coming back to because it is the one I use myself
            every working day.
          </p>
        </Section>

        <Section heading="Get involved">
          <ul style={ulStyle}>
            <li>
              <strong>Translate</strong> — the source is on GitHub. Add a language, open a PR.
            </li>
            <li>
              <strong>Add a persona page</strong> — see{' '}
              <Link href="/for/developers" style={inlineLink}>existing examples</Link>{' '}
              and add a profession we missed.
            </li>
            <li>
              <strong>Share</strong> — with anyone who spends too long in front of a screen
              (so, everyone).
            </li>
          </ul>
        </Section>

        <aside style={ctaStyle}>
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
const ulStyle: React.CSSProperties = {
  margin: 0, padding: '0 0 0 1.2em',
  fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
  fontSize: '1.0625rem', color: '#3a352d', lineHeight: 1.6,
};
const inlineLink: React.CSSProperties = {
  color: '#1c1b18', borderBottom: '1px solid #c47d56', textDecoration: 'none',
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
