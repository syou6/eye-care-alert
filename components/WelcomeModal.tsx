'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { translations, tKey, type Language } from '@/lib/translations';
import { FONT_SERIF, langLineHeight } from '@/lib/hours';

export const WELCOME_STORAGE_KEY = 'eyeCareWelcomeSeen';

export default function WelcomeModal({
  language,
  onComplete,
}: {
  language: Language;
  onComplete: (opts: { allowedNotifications: boolean }) => void;
}) {
  const t = translations[language];
  const lh = langLineHeight(language);
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        background: 'var(--c-bg)',
        display: 'grid', placeItems: 'center', padding: 24,
      }}
    >
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 4, opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        style={{
          width: '100%',
          maxWidth: 520,
          textAlign: 'center',
        }}
      >
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
      </motion.div>
    </motion.div>
  );
}
