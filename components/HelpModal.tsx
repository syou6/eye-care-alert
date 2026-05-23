'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { translations, tKey, type Language } from '@/lib/translations';
import { FONT_SERIF, langLineHeight } from '@/lib/hours';

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
        background: 'color-mix(in srgb, var(--c-bg) 85%, transparent)',
        display: 'grid', placeItems: 'center', padding: 24,
      }}
    >
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 4, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        style={{
          background: 'var(--c-surface)',
          border: '1px solid var(--c-rule)',
          padding: '36px 36px 28px',
          width: '100%',
          maxWidth: 520,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
          fontSize: '.6875rem', letterSpacing: '.16em', textTransform: 'uppercase',
          color: 'var(--c-mute)', marginBottom: 14,
        }}>
          {t.title} · About
        </div>

        <h2
          id="help-title"
          style={{
            margin: 0,
            fontFamily: FONT_SERIF, fontStyle: 'italic', fontWeight: 400,
            fontSize: '1.75rem', lineHeight: 1.15, letterSpacing: '-0.01em',
            color: 'var(--c-ink)',
          }}
        >
          {tKey(language, 'helpTitle')}
        </h2>

        <p style={{
          marginTop: 16,
          fontFamily: FONT_SERIF,
          fontSize: '1.0625rem',
          color: 'var(--c-ink)',
          lineHeight: lh,
        }}>
          {tKey(language, 'helpBody')}
        </p>

        <div style={{ height: 1, background: 'var(--c-rule)', margin: '24px 0' }} />

        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          <li>
            <Link
              href="/learn/does-the-20-20-20-rule-work"
              style={{
                display: 'block',
                fontFamily: FONT_SERIF, fontStyle: 'italic',
                fontSize: '1.05rem',
                color: 'var(--c-ink)',
                textDecoration: 'none',
                padding: '10px 0',
                borderBottom: '1px dotted var(--c-rule)',
              }}
            >
              Does the 20-20-20 rule actually work? →
            </Link>
          </li>
          <li>
            <Link
              href="/learn/20-20-20-rule-for-kids"
              style={{
                display: 'block',
                fontFamily: FONT_SERIF, fontStyle: 'italic',
                fontSize: '1.05rem',
                color: 'var(--c-ink)',
                textDecoration: 'none',
                padding: '10px 0',
                borderBottom: '1px dotted var(--c-rule)',
              }}
            >
              The 20-20-20 rule for kids →
            </Link>
          </li>
          <li>
            <Link
              href="/learn/20-20-2-rule"
              style={{
                display: 'block',
                fontFamily: FONT_SERIF, fontStyle: 'italic',
                fontSize: '1.05rem',
                color: 'var(--c-ink)',
                textDecoration: 'none',
                padding: '10px 0',
                borderBottom: '1px dotted var(--c-rule)',
              }}
            >
              The 20-20-2 rule (kids + outdoor time) →
            </Link>
          </li>
          <li>
            <Link
              href="/learn/screen-break-statistics"
              style={{
                display: 'block',
                fontFamily: FONT_SERIF, fontStyle: 'italic',
                fontSize: '1.05rem',
                color: 'var(--c-ink)',
                textDecoration: 'none',
                padding: '10px 0',
              }}
            >
              Screen break statistics →
            </Link>
          </li>
        </ul>

        <div style={{
          marginTop: 28,
          fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
          fontSize: '.625rem', letterSpacing: '.12em', textTransform: 'uppercase',
          color: 'var(--c-mute)', textAlign: 'center',
        }}>
          {tKey(language, 'kbdHint')}
        </div>

        <div style={{ marginTop: 22, textAlign: 'center' }}>
          <button
            onClick={onClose}
            aria-label={tKey(language, 'closeLabel')}
            style={{
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: '.6875rem', letterSpacing: '.16em', textTransform: 'uppercase',
              color: 'var(--c-mute)', background: 'transparent',
              border: 0, padding: '8px 12px', cursor: 'pointer',
            }}
          >
            {tKey(language, 'closeLabel')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
