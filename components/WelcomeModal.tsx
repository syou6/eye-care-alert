'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { translations, tKey, type Language } from '@/lib/translations';
import { langLineHeight, isRTL as hoursIsRTL } from '@/lib/hours';

// Shadow Console typefaces (families defined in layout.tsx via next/font).
const F_UI = 'var(--font-grotesk), ui-sans-serif, system-ui, sans-serif';
const F_MONO = 'var(--font-console), ui-monospace, monospace';

export const WELCOME_STORAGE_KEY = 'eyeCareWelcomeSeen';

const LANG_NATIVE: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'ko', name: '한국어' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'it', name: 'Italiano' },
];

export default function WelcomeModal({
  language,
  onLanguageChange,
  onComplete,
}: {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onComplete: (opts: { allowedNotifications: boolean }) => void;
}) {
  const t = translations[language];
  const lh = langLineHeight(language);
  const dir: 'ltr' | 'rtl' = hoursIsRTL(language) ? 'rtl' : 'ltr';
  const [step, setStep] = useState<1 | 2>(1);

  const handleAllow = async () => {
    let allowed = false;
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        allowed = res === 'granted';
      } catch {
        // ignore
      }
    }
    onComplete({ allowedNotifications: allowed });
  };

  const handleSkip = () => onComplete({ allowedNotifications: false });

  const title = (text: string) => (
    <h2
      id="welcome-title"
      style={{
        margin: 0,
        fontFamily: F_UI, fontWeight: 500,
        fontSize: 'clamp(1.9rem, 6vw, 2.8rem)', lineHeight: 1.1,
        letterSpacing: '-0.01em', color: 'var(--ink)',
      }}
    >
      {text}
    </h2>
  );

  const body = (text: string) => (
    <p style={{
      marginTop: 22,
      fontFamily: F_UI,
      fontSize: '1.1rem', lineHeight: lh,
      color: 'var(--ink-soft)',
    }}>
      {text}
    </p>
  );

  return (
    <motion.div
      dir={dir}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        background: 'var(--bg)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Language strip — always visible so user can switch before reading */}
      <div
        style={{
          padding: '14px 16px',
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: F_UI,
            fontSize: '.625rem', fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase',
            color: 'var(--ink-soft)', marginInlineEnd: 6, whiteSpace: 'nowrap',
          }}
        >
          Language ·
        </span>
        {LANG_NATIVE.map(({ code, name }) => {
          const selected = code === language;
          return (
            <button
              key={code}
              onClick={() => onLanguageChange(code)}
              aria-pressed={selected}
              className={selected ? 'neu-pressed' : ''}
              style={{
                background: 'var(--bg)',
                border: 0,
                padding: '8px 14px',
                borderRadius: 999,
                cursor: 'pointer',
                fontFamily: F_UI,
                fontSize: '.9rem',
                fontWeight: selected ? 500 : 400,
                color: selected ? 'var(--accent)' : 'var(--ink-soft)',
                whiteSpace: 'nowrap',
                ['--offset' as string]: '2px',
                ['--blur' as string]: '5px',
              } as React.CSSProperties}
            >
              {name}
            </button>
          );
        })}
      </div>

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 4, opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        style={{
          flex: 1,
          display: 'grid',
          placeItems: 'center',
          padding: 24,
        }}
      >
        <div style={{ width: '100%', maxWidth: 520, textAlign: 'center' }}>
          <div style={{
            fontFamily: F_UI,
            fontSize: '.6875rem', fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase',
            color: 'var(--ink-soft)', marginBottom: 22,
          }}>
            {t.title} ·{' '}
            <span style={{ fontFamily: F_MONO }}>{step === 1 ? 'I' : 'II'} / II</span>
          </div>

          {step === 1 ? (
            <>
              {title(tKey(language, 'welcomeTitle1'))}
              {body(tKey(language, 'welcomeBody1'))}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(2)}
                className="neu-primary"
                style={{
                  marginTop: 40,
                  fontFamily: F_UI, fontSize: '.7rem', fontWeight: 500,
                  letterSpacing: '.16em', textTransform: 'uppercase',
                  color: '#fff', borderRadius: 'var(--r-ctrl)',
                  padding: '15px 36px', minHeight: 48, cursor: 'pointer',
                }}
              >
                Next
              </motion.button>
            </>
          ) : (
            <>
              {title(tKey(language, 'welcomeTitle2'))}
              {body(tKey(language, 'welcomeBody2'))}

              <div style={{
                marginTop: 40,
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAllow}
                  className="neu-primary"
                  style={{
                    fontFamily: F_UI, fontSize: '.7rem', fontWeight: 500,
                    letterSpacing: '.16em', textTransform: 'uppercase',
                    color: '#fff', borderRadius: 'var(--r-ctrl)',
                    padding: '15px 30px', minHeight: 48, cursor: 'pointer',
                  }}
                >
                  {tKey(language, 'welcomeAllow')}
                </motion.button>
                <button
                  onClick={handleSkip}
                  style={{
                    fontFamily: F_UI, fontSize: '.7rem', fontWeight: 500,
                    letterSpacing: '.12em', textTransform: 'uppercase',
                    color: 'var(--ink-soft)',
                    background: 'transparent', border: 0,
                    padding: '12px 16px',
                    cursor: 'pointer',
                  }}
                >
                  {tKey(language, 'welcomeSkip')}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
