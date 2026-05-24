import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found | EYE CARE',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#f5f1ea',
        color: '#1c1b18',
        fontFamily: 'var(--font-geist-sans, "Geist Sans", ui-sans-serif, system-ui, sans-serif)',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div
          style={{
            fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
            fontSize: '.625rem',
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: '#7a7568',
            marginBottom: 18,
          }}
        >
          404 · Not found
        </div>
        <h1
          style={{
            fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.015em',
            margin: 0,
            color: '#1c1b18',
          }}
        >
          This page seems to have wandered off.
        </h1>
        <p
          style={{
            fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            color: '#5a564a',
            marginTop: 18,
            lineHeight: 1.55,
          }}
        >
          Probably worth taking a 20-second break and then heading back to the timer.
        </p>

        <div
          style={{
            marginTop: 32,
            display: 'flex',
            gap: 14,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/en"
            style={{
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: '.6875rem',
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              background: '#1c1b18',
              color: '#f5f1ea',
              padding: '12px 22px',
              textDecoration: 'none',
              minHeight: 44,
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Open the timer
          </Link>
          <Link
            href="/learn"
            style={{
              fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
              fontStyle: 'italic',
              color: '#1c1b18',
              padding: '12px 16px',
              textDecoration: 'none',
              borderBottom: '1px dotted rgba(28,27,24,.18)',
              fontSize: '.95rem',
            }}
          >
            Browse articles →
          </Link>
        </div>
      </div>
    </div>
  );
}
