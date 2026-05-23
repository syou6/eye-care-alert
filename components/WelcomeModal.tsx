'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { translations, tKey, type Language } from '@/lib/translations';
import { FONT_SERIF, langLineHeight, isRTL as hoursIsRTL } from '@/lib/hours';

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

  return (
    <motion.div
      dir={dir}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        background: 'var(--c-bg)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Language strip — always visible so user can switch before reading anything */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--c-rule)',
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
            fontSize: '.625rem', letterSpacing: '.12em', textTransform: 'uppercase',
            color: 'var(--c-mute)', marginInlineEnd: 6, whiteSpace: 'nowrap',
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
              style={{
                background: 'transparent',
                border: 0,
                padding: '6px 10px',
                cursor: 'pointer',
                fontFamily: FONT_SERIF,
                fontStyle: 'italic',
                fontSize: '.95rem',
                color: selected ? 'var(--c-primary)' : 'var(--c-mute)',
                whiteSpace: 'nowrap',
                borderBottom: selected ? '1px solid var(--c-primary)' : '1px solid transparent',
              }}
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
            fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
            fontSize: '.625rem', letterSpacing: '.16em', textTransform: 'uppercase',
            color: 'var(--c-mute)', marginBottom: 18,
          }}>
            {t.title} · {step === 1 ? 'I' : 'II'} / II
          </div>

          {step === 1 ? (
            <>
              <h2
                id="welcome-title"
                style={{
                  margin: 0,
                  fontFamily: FONT_SERIF, fontStyle: 'italic', fontWeight: 400,
                  fontSize: 'clamp(2rem, 6vw, 3rem)', lineHeight: 1.05,
                  letterSpacing: '-0.015em', color: 'var(--c-ink)',
                }}
              >
                {tKey(language, 'welcomeTitle1')}
              </h2>
              <p style={{
                marginTop: 22,
                fontFamily: FONT_SERIF, fontStyle: 'italic',
                fontSize: '1.125rem', lineHeight: lh,
                color: 'var(--c-mute)',
              }}>
                {tKey(language, 'welcomeBody1')}
              </p>

              <button
                onClick={() => setStep(2)}
                style={{
                  marginTop: 36,
                  fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
                  fontSize: '.6875rem', letterSpacing: '.16em', textTransform: 'uppercase',
                  border: '1px solid var(--c-ink)', color: 'var(--c-ink)',
                  background: 'transparent', padding: '12px 28px',
                  minHeight: 44, cursor: 'pointer',
                }}
              >
                Next
              </button>
            </>
          ) : (
            <>
              <h2
                id="welcome-title"
                style={{
                  margin: 0,
                  fontFamily: FONT_SERIF, fontStyle: 'italic', fontWeight: 400,
                  fontSize: 'clamp(2rem, 6vw, 3rem)', lineHeight: 1.05,
                  letterSpacing: '-0.015em', color: 'var(--c-ink)',
                }}
              >
                {tKey(language, 'welcomeTitle2')}
              </h2>
              <p style={{
                marginTop: 22,
                fontFamily: FONT_SERIF, fontStyle: 'italic',
                fontSize: '1.125rem', lineHeight: lh,
                color: 'var(--c-mute)',
              }}>
                {tKey(language, 'welcomeBody2')}
              </p>

              <div style={{
                marginTop: 36,
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={handleAllow}
                  style={{
                    fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
                    fontSize: '.6875rem', letterSpacing: '.16em', textTransform: 'uppercase',
                    background: 'var(--c-ink)', color: 'var(--c-bg)',
                    border: 0, padding: '12px 22px',
                    minHeight: 44, cursor: 'pointer',
                  }}
                >
                  {tKey(language, 'welcomeAllow')}
                </button>
                <button
                  onClick={handleSkip}
                  style={{
                    fontFamily: FONT_SERIF, fontStyle: 'italic',
                    color: 'var(--c-mute)',
                    background: 'transparent', border: 0,
                    padding: '12px 16px', fontSize: '.95rem',
                    borderBottom: '1px dotted var(--c-rule)',
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
