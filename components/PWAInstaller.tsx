'use client';

import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_STORAGE_KEY = 'eyeCarePwaInstallDismissedAt';
const DISMISS_COOLDOWN_DAYS = 14;

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  // Register service worker
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // silent fail — SW is progressive enhancement
    });
  }, []);

  // Capture install prompt
  useEffect(() => {
    if (typeof window === 'undefined') return;

    function shouldShow() {
      try {
        const dismissedAt = window.localStorage.getItem(DISMISS_STORAGE_KEY);
        if (!dismissedAt) return true;
        const ms = Date.now() - Number(dismissedAt);
        return ms > DISMISS_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
      } catch {
        return true;
      }
    }

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      if (!shouldShow()) return;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    function onInstalled() {
      setDeferredPrompt(null);
      setVisible(false);
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible || !deferredPrompt) return null;

  return (
    <div
      role="dialog"
      aria-label="Install EYE CARE app"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3 animate-in slide-in-from-bottom-4"
    >
      <span className="text-2xl" aria-hidden="true">👁️</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Install EYE CARE
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Add to home screen for quick access
        </p>
      </div>
      <button
        onClick={handleInstall}
        className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
      >
        Install
      </button>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="px-2 py-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
