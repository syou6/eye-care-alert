'use client';

// PWAInstaller — "Hours" editorial visual layer on the existing install flow.
// beforeinstallprompt + appinstalled listeners + the install/dismiss logic
// stay; only the toast UI changes.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations, HOURS_KEYS, tKey, type Language } from '@/lib/translations';
import { FONT_SERIF, isRTL as hoursIsRTL } from '@/lib/hours';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'eyeCarePwaInstallDismissedAt';
const REMINDER_DAYS = 14;

export default function PWAInstaller({ lang }: { lang?: Language } = {}) {
  const resolvedLang: Language = lang ?? 'en';
  const t = translations[resolvedLang];
  const dir: 'ltr' | 'rtl' = hoursIsRTL(resolvedLang) ? 'rtl' : 'ltr';
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  // Register service worker (production only).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW is progressive enhancement — silent fail OK
    });
  }, []);

  // beforeinstallprompt capture with cooldown.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    function shouldShow() {
      try {
        const dismissedAt = Number(window.localStorage.getItem(DISMISS_KEY) ?? 0);
        if (!dismissedAt) return true;
        return Date.now() - dismissedAt > REMINDER_DAYS * 86_400_000;
      } catch {
        return true;
      }
    }
    function onPrompt(e: Event) {
      e.preventDefault();
      if (!shouldShow()) return;
      setEvt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }
    function onInstalled() {
      setEvt(null);
      setVisible(false);
    }
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    if (outcome === 'dismissed') {
      try {
        window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
      } catch {
        // ignore
      }
    }
    setEvt(null);
    setVisible(false);
  };

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          dir={dir}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
          role="dialog"
          aria-label={tKey(resolvedLang, 'install')}
          style={{
            position: 'fixed',
            insetInlineStart: '50%',
            bottom: 'max(22px, env(safe-area-inset-bottom))',
            transform: 'translateX(-50%)',
            width: 'min(560px, calc(100% - 24px))',
            zIndex: 40,
            background: 'var(--c-surface, #fbf8f2)',
            border: '1px solid var(--c-rule, rgba(28,27,24,.14))',
            boxShadow: '0 8px 24px rgba(0,0,0,.06)',
            padding: '14px 16px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: 14,
            fontFamily: 'var(--font-geist-sans, "Geist Sans", ui-sans-serif, system-ui, sans-serif)',
          }}
        >
          <button
            onClick={dismiss}
            aria-label={tKey(resolvedLang, 'later')}
            style={{
              position: 'absolute', top: 8,
              insetInlineEnd: 8,
              width: 24, height: 24,
              background: 'transparent', border: 0,
              color: 'var(--c-mute, #7a7568)',
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            ×
          </button>

          <div style={{
            width: 40, height: 40, borderRadius: 999,
            background: 'var(--c-bg, #f5f1ea)',
            border: '1px solid var(--c-rule, rgba(28,27,24,.14))',
            display: 'grid', placeItems: 'center',
            flexShrink: 0,
          }}>
            <svg width="20" height="13" viewBox="0 0 18 12" fill="none" aria-hidden>
              <path d="M1 6 C 4 1, 14 1, 17 6 C 14 11, 4 11, 1 6 Z" stroke="var(--c-ink, #1c1b18)" strokeWidth="1" />
              <circle cx="9" cy="6" r="2.2" fill="var(--c-primary, #c47d56)" />
            </svg>
          </div>

          <div style={{ minWidth: 0, paddingInlineEnd: 4 }}>
            <div style={{
              fontFamily: FONT_SERIF, fontStyle: 'italic',
              fontSize: '.95rem', lineHeight: 1.25,
              color: 'var(--c-ink, #1c1b18)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {tKey(resolvedLang, 'install')} {t.title}
            </div>
            <div style={{
              color: 'var(--c-mute, #7a7568)',
              fontSize: '.75rem', lineHeight: 1.4, marginTop: 3,
            }}>
              {tKey(resolvedLang, 'installBody')}
            </div>
          </div>

          <button
            onClick={install}
            style={{
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: '.6875rem', letterSpacing: '.16em', textTransform: 'uppercase',
              background: 'var(--c-ink, #1c1b18)',
              color: 'var(--c-bg, #f5f1ea)',
              border: 0, padding: '12px 18px',
              minHeight: 44, cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {tKey(resolvedLang, 'install')}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
