'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'eyeCarePwaInstallDismissedAt';
const REMINDER_DAYS = 14;

export default function PWAInstaller() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    function shouldShow() {
      try {
        const dismissedAt = Number(window.localStorage.getItem(DISMISS_KEY) ?? 0);
        return !dismissedAt || Date.now() - dismissedAt > REMINDER_DAYS * 86_400_000;
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
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          role="dialog"
          aria-label="Install EYE CARE"
          className="fixed left-1/2 z-40 w-[min(440px,calc(100%-24px))] -translate-x-1/2 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#161618] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_16px_40px_rgba(0,0,0,0.12)] p-4 flex items-center gap-3"
          style={{ bottom: 'max(20px, env(safe-area-inset-bottom))' }}
        >
          <span
            aria-hidden
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#eef2ff] dark:bg-[#0a84ff]/20 text-[#007aff] dark:text-[#0a84ff] shrink-0"
          >
            <svg width="20" height="14" viewBox="0 0 18 12" fill="none" aria-hidden>
              <path d="M1 6 C 4 1, 14 1, 17 6 C 14 11, 4 11, 1 6 Z" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="9" cy="6" r="2.6" fill="currentColor" />
            </svg>
          </span>

          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
              Install EYE CARE
            </div>
            <div className="text-[12px] text-[#6e6e73] dark:text-[#86868b] truncate">
              Add to home screen for quick access
            </div>
          </div>

          <button
            onClick={install}
            className="px-3.5 py-2 rounded-lg bg-[#007aff] dark:bg-[#0a84ff] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            Install
          </button>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="w-8 h-8 rounded-lg text-[#86868b] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors shrink-0 inline-flex items-center justify-center"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
