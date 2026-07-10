'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { translations, tKey, type Language } from '@/lib/translations';
import { langLineHeight } from '@/lib/hours';

// Shadow Console typefaces (families defined in layout.tsx via next/font).
const F_UI = 'var(--font-grotesk), ui-sans-serif, system-ui, sans-serif';

const LINKS: { href: string; label: string }[] = [
  { href: '/learn/does-the-20-20-20-rule-work', label: 'Does the 20-20-20 rule actually work? →' },
  { href: '/learn/20-20-20-rule-for-kids', label: 'The 20-20-20 rule for kids →' },
  { href: '/learn/20-20-2-rule', label: 'The 20-20-2 rule (kids + outdoor time) →' },
  { href: '/learn/screen-break-statistics', label: 'Screen break statistics →' },
];

export default function HelpModal({
  language,
  onClose,
}: {
  language: Language;
  onClose: () => void;
}) {
  const t = translations[language];
  const lh = langLineHeight(language);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 65,
        background: 'color-mix(in srgb, var(--bg) 74%, transparent)',
        backdropFilter: 'blur(2px)',
        display: 'grid', placeItems: 'center', padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        className="neu"
        style={{
          background: 'var(--bg)',
          borderRadius: 'var(--r-card)',
          padding: '36px 36px 28px',
          width: '100%',
          maxWidth: 520,
          maxHeight: '90vh',
          overflowY: 'auto',
          ['--offset' as string]: '10px',
          ['--blur' as string]: '26px',
        } as React.CSSProperties}
      >
        <div style={{
          fontFamily: F_UI,
          fontSize: '.7rem', fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase',
          color: 'var(--ink-soft)', marginBottom: 16,
        }}>
          {t.title} · About
        </div>

        <h2
          id="help-title"
          style={{
            margin: 0,
            fontFamily: F_UI, fontWeight: 500,
            fontSize: '1.7rem', lineHeight: 1.2, letterSpacing: '-0.01em',
            color: 'var(--ink)',
          }}
        >
          {tKey(language, 'helpTitle')}
        </h2>

        <p style={{
          marginTop: 16,
          fontFamily: F_UI,
          fontSize: '1.05rem',
          color: 'var(--ink)',
          lineHeight: lh,
        }}>
          {tKey(language, 'helpBody')}
        </p>

        {/* Recessed hairline divider */}
        <div
          className="neu-pressed"
          style={{
            height: 4, borderRadius: 999, margin: '26px 0',
            ['--offset' as string]: '1px', ['--blur' as string]: '2px',
          } as React.CSSProperties}
        />

        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="neu neu-btn"
                style={{
                  display: 'block',
                  fontFamily: F_UI,
                  fontSize: '1rem',
                  color: 'var(--ink)',
                  textDecoration: 'none',
                  padding: '13px 16px',
                  borderRadius: 'var(--r-ctrl)',
                  background: 'var(--bg)',
                  ['--offset' as string]: '3px',
                  ['--blur' as string]: '7px',
                } as React.CSSProperties}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{
          marginTop: 28,
          fontFamily: F_UI,
          fontSize: '.625rem', fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase',
          color: 'var(--ink-soft)', textAlign: 'center',
        }}>
          {tKey(language, 'kbdHint')}
        </div>

        <div style={{ marginTop: 22, textAlign: 'center' }}>
          <button
            onClick={onClose}
            aria-label={tKey(language, 'closeLabel')}
            className="neu neu-btn"
            style={{
              fontFamily: F_UI, fontSize: '.7rem', fontWeight: 500,
              letterSpacing: '.14em', textTransform: 'uppercase',
              color: 'var(--ink-soft)', background: 'var(--bg)',
              border: 0, padding: '11px 26px', borderRadius: 'var(--r-ctrl)', cursor: 'pointer',
              ['--offset' as string]: '4px', ['--blur' as string]: '9px',
            } as React.CSSProperties}
          >
            {tKey(language, 'closeLabel')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
