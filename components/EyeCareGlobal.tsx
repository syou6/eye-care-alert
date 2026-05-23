'use client';

import { useEffect, useMemo, useReducer, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AdSlot from '@/components/AdSlot';
import { translations, languages, type Language } from '@/lib/translations';

const BREAK_AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_BREAK_SLOT ?? '';

const SESSION_SECONDS = 20 * 60;
const BREAK_SECONDS = 20;
const SVG_RADIUS = 88;
const SVG_CIRCUMFERENCE = 2 * Math.PI * SVG_RADIUS;
const STORAGE_KEY = 'eyeCarePreferences';
const DONATION_INTERVAL = 10;
const SUPPORTED_LANG_PREFIXES: Language[] = [
  'ja', 'zh', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'it',
];

type Phase = 'idle' | 'work' | 'break';

type TimerState = {
  phase: Phase;
  endTime: number | null;
  remaining: number;
  workRemaining: number;
  sessionsCompleted: number;
};

const initialState: TimerState = {
  phase: 'idle',
  endTime: null,
  remaining: SESSION_SECONDS,
  workRemaining: SESSION_SECONDS,
  sessionsCompleted: 0,
};

type Action =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'TICK'; now: number }
  | { type: 'START_BREAK' }
  | { type: 'END_BREAK' }
  | { type: 'SKIP_BREAK' }
  | { type: 'HYDRATE_SESSIONS'; n: number };

function reducer(state: TimerState, action: Action): TimerState {
  switch (action.type) {
    case 'START': {
      const remaining = state.workRemaining > 0 ? state.workRemaining : SESSION_SECONDS;
      return {
        ...state,
        phase: 'work',
        endTime: Date.now() + remaining * 1000,
        remaining,
        workRemaining: remaining,
      };
    }
    case 'PAUSE':
      return {
        ...state,
        phase: 'idle',
        endTime: null,
        workRemaining: state.remaining,
      };
    case 'RESET':
      return { ...initialState, sessionsCompleted: state.sessionsCompleted };
    case 'TICK': {
      if (state.endTime == null) return state;
      const remaining = Math.max(0, Math.ceil((state.endTime - action.now) / 1000));
      if (remaining === state.remaining) return state;
      return { ...state, remaining };
    }
    case 'START_BREAK':
      return {
        ...state,
        phase: 'break',
        endTime: Date.now() + BREAK_SECONDS * 1000,
        remaining: BREAK_SECONDS,
        workRemaining: SESSION_SECONDS,
        sessionsCompleted: state.sessionsCompleted + 1,
      };
    case 'END_BREAK':
    case 'SKIP_BREAK':
      return {
        ...state,
        phase: 'work',
        endTime: Date.now() + SESSION_SECONDS * 1000,
        remaining: SESSION_SECONDS,
        workRemaining: SESSION_SECONDS,
      };
    case 'HYDRATE_SESSIONS':
      return { ...state, sessionsCompleted: action.n };
    default:
      return state;
  }
}

function detectLanguage(saved: Language | null): Language {
  if (saved) return saved;
  if (typeof navigator === 'undefined') return 'en';
  const browserLang = navigator.language.toLowerCase();
  return SUPPORTED_LANG_PREFIXES.find((p) => browserLang.startsWith(p)) ?? 'en';
}

type SavedPrefs = {
  theme: 'light' | 'dark';
  sessionsCompleted: number;
  language: Language | null;
};

function loadPrefs(): SavedPrefs {
  const defaults: SavedPrefs = { theme: 'light', sessionsCompleted: 0, language: null };
  if (typeof window === 'undefined') return defaults;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaults;
    const parsed = JSON.parse(saved);
    return {
      theme: parsed?.theme === 'dark' ? 'dark' : 'light',
      sessionsCompleted: typeof parsed?.sessionsCompleted === 'number' ? parsed.sessionsCompleted : 0,
      language: typeof parsed?.language === 'string' ? (parsed.language as Language) : null,
    };
  } catch {
    return defaults;
  }
}

function savePrefs(prefs: { theme: string; sessionsCompleted: number; language: Language }) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // quota exceeded or private mode — silently ignore
  }
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function EyeCareGlobal({
  initialLanguage,
}: {
  initialLanguage?: Language;
} = {}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<Language>(initialLanguage ?? 'en');
  const [showDonation, setShowDonation] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastDonationShownAt = useRef(0);
  const router = useRouter();

  const t = translations[language];
  const isDark = theme === 'dark';
  const currentLang = useMemo(
    () => languages.find((l) => l.code === language),
    [language],
  );
  const isRTL = language === 'ar';

  // Hydrate prefs once on mount. URL-provided initialLanguage wins over saved/browser.
  useEffect(() => {
    const prefs = loadPrefs();
    setTheme(prefs.theme);
    if (!initialLanguage) {
      setLanguage(detectLanguage(prefs.language));
    }
    dispatch({ type: 'HYDRATE_SESSIONS', n: prefs.sessionsCompleted });
    lastDonationShownAt.current = prefs.sessionsCompleted;
    setIsLoaded(true);
  }, [initialLanguage]);

  // Persist after hydration
  useEffect(() => {
    if (!isLoaded) return;
    savePrefs({ theme, sessionsCompleted: state.sessionsCompleted, language });
  }, [theme, language, state.sessionsCompleted, isLoaded]);

  // Apply dir to <html> for full-page RTL
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRTL, language]);

  // Ticker — single interval, drift-free (recomputes from endTime)
  useEffect(() => {
    if (state.endTime == null) return;
    const tick = () => dispatch({ type: 'TICK', now: Date.now() });
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [state.endTime]);

  // Re-sync on tab refocus (corrects throttled background drift)
  useEffect(() => {
    function onVis() {
      if (document.visibilityState === 'visible') {
        dispatch({ type: 'TICK', now: Date.now() });
      }
    }
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Phase transitions on remaining === 0
  useEffect(() => {
    if (state.remaining !== 0) return;
    if (state.phase === 'work') {
      dispatch({ type: 'START_BREAK' });
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(t.notification.title, {
            body: t.notification.body,
            tag: 'eye-care-break',
            icon: '/icon.svg',
          });
        } catch {
          // some browsers throw on Notification creation
        }
      }
      const next = state.sessionsCompleted + 1;
      if (next % DONATION_INTERVAL === 0 && next !== lastDonationShownAt.current) {
        setShowDonation(true);
        lastDonationShownAt.current = next;
      }
    } else if (state.phase === 'break') {
      dispatch({ type: 'END_BREAK' });
    }
  }, [state.phase, state.remaining, state.sessionsCompleted, t.notification]);

  // Outside-click + Escape close for language menu
  useEffect(() => {
    if (!showLanguageMenu) return;
    function onPointer(e: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowLanguageMenu(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowLanguageMenu(false);
    }
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [showLanguageMenu]);

  const handleStartPause = useCallback(() => {
    if (state.phase === 'idle') {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
      dispatch({ type: 'START' });
    } else {
      dispatch({ type: 'PAUSE' });
    }
  }, [state.phase]);

  const handleReset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const handleSkipBreak = useCallback(() => dispatch({ type: 'SKIP_BREAK' }), []);

  const handleShare = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const shareData = {
      title: t.title,
      text: t.subtitle,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled — no-op
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // clipboard blocked — no-op
    }
  }, [t.title, t.subtitle]);

  const showBreak = state.phase === 'break';
  const isActive = state.endTime !== null && !showBreak;
  const workSecondsForProgress = state.phase === 'work' ? state.remaining : state.workRemaining;
  const progress = ((SESSION_SECONDS - workSecondsForProgress) / SESSION_SECONDS) * 100;
  const progressClamped = Math.min(100, Math.max(0, progress));
  const strokeOffset = SVG_CIRCUMFERENCE - (SVG_CIRCUMFERENCE * progressClamped) / 100;

  return (
    <div
      className={`min-h-[100dvh] ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 to-gray-800'
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
      } flex items-center justify-center p-8 transition-colors duration-500`}
    >
      {/* Top Banner */}
      <div
        className={`fixed top-0 left-0 right-0 h-16 ${
          isDark
            ? 'bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-gray-700/40'
            : 'bg-gradient-to-r from-gray-50/80 to-gray-100/80 border-gray-200/30'
        } backdrop-blur-sm flex items-center justify-between px-6 border-b z-40`}
      >
        <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <span className="opacity-60">📢</span>
          <span className="font-medium">{t.sponsorMessage}</span>
          <span className="opacity-60">•</span>
          <a
            href="https://x.com/K8292288065827"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {t.contactUs}
          </a>
        </div>

        {/* Language Selector */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowLanguageMenu((v) => !v)}
            aria-expanded={showLanguageMenu}
            aria-haspopup="listbox"
            aria-label={`Language: ${currentLang?.name ?? language}`}
            className={`px-4 py-2 rounded-lg shadow-sm border flex items-center gap-2 transition-colors ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg">{currentLang?.flag}</span>
            <span className="text-sm font-medium">{currentLang?.name}</span>
            <svg
              className={`w-4 h-4 transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {showLanguageMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                role="listbox"
                className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl border overflow-hidden z-50 ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="max-h-80 overflow-y-auto">
                  {languages.map((lang) => {
                    const selected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          setLanguage(lang.code as Language);
                          setShowLanguageMenu(false);
                          router.push(`/${lang.code}`);
                        }}
                        className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                          selected
                            ? isDark
                              ? 'bg-blue-900/40 text-blue-300'
                              : 'bg-blue-50 text-blue-600'
                            : isDark
                              ? 'text-gray-300 hover:bg-gray-700'
                              : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                        {selected && (
                          <svg
                            className={`w-4 h-4 ml-auto ${isDark ? 'text-blue-300' : 'text-blue-600'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mt-20"
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className={`text-3xl font-light tracking-widest ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {t.title}
          </h1>
          <p className={`text-xs mt-2 tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {t.subtitle}
          </p>
        </motion.div>

        <motion.div
          className={`${isDark ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-lg rounded-3xl shadow-2xl p-12`}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {!showBreak ? (
              <motion.div
                key="timer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative mb-12">
                  <svg
                    className="w-48 h-48 mx-auto -rotate-90"
                    viewBox="0 0 192 192"
                    aria-hidden="true"
                  >
                    <circle
                      cx="96"
                      cy="96"
                      r={SVG_RADIUS}
                      stroke={isDark ? '#374151' : '#e5e7eb'}
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r={SVG_RADIUS}
                      stroke={isDark ? '#60a5fa' : '#3b82f6'}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={SVG_CIRCUMFERENCE}
                      animate={{ strokeDashoffset: strokeOffset }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`text-5xl font-light tabular-nums ${
                        state.remaining <= 60 && state.phase === 'work'
                          ? isDark
                            ? 'text-red-300 animate-pulse'
                            : 'text-red-500 animate-pulse'
                          : isDark
                            ? 'text-white'
                            : 'text-gray-900'
                      }`}
                      role="timer"
                      aria-live="polite"
                      aria-atomic="true"
                      aria-label={`${formatTime(state.remaining)} ${state.phase === 'work' ? 'remaining in work session' : ''}`}
                    >
                      {formatTime(state.remaining)}
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <motion.div
                    className={`text-sm tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                    animate={{ opacity: isActive ? [0.5, 1, 0.5] : 1 }}
                    transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                  >
                    {isActive ? `● ${t.tracking}` : `⏸ ${t.paused}`}
                  </motion.div>
                  <div className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {t.totalSessions}: {state.sessionsCompleted}
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartPause}
                    className={`flex-1 py-4 rounded-2xl font-medium transition-all duration-300 ${
                      isDark
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isActive ? t.pause : t.start}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className={`px-6 py-4 rounded-2xl font-medium transition-all duration-300 ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {t.reset}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="break"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center"
                role="status"
                aria-live="assertive"
              >
                <motion.div
                  className="mb-8 text-6xl"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  aria-hidden="true"
                >
                  👁️
                </motion.div>

                <h2 className={`text-2xl font-light mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t.restYourEyes}
                </h2>

                <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.lookAway}</p>

                <div
                  className={`text-6xl font-light mb-8 tabular-nums animate-pulse ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}
                >
                  {state.remaining}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSkipBreak}
                  className={`px-8 py-3 rounded-2xl font-medium transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  {t.skipBreak}
                </motion.button>

                {BREAK_AD_SLOT && (
                  <div className="mt-8 -mx-4">
                    <AdSlot
                      slot={BREAK_AD_SLOT}
                      format="auto"
                      reservedHeight={120}
                      className="overflow-hidden rounded-xl"
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Theme Toggle */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={isDark}
            className={`p-3 rounded-full transition-all ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                : 'bg-white hover:bg-gray-100 text-gray-700 shadow-lg'
            }`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Support Section */}
        <div className="mt-8 text-center">
          <p className={`text-xs mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t.freeForever}</p>
          <div className="flex justify-center gap-4">
            <a
              href="https://buymeacoffee.com/shokawamoto"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-500 transition-all"
            >
              ☕ {t.buyCoffee}
            </a>
            <button
              onClick={handleShare}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              📤 {t.share}
            </button>
          </div>
        </div>

        {/* Helpful Links */}
        <div className={`mt-8 p-4 rounded-lg text-center ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <p className={`text-xs mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t.recommendedProducts}</p>
          <div className="flex justify-center gap-3 text-xs">
            <a
              href="https://amzn.to/blulight-glasses"
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {t.blueLightGlasses}
            </a>
            <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>•</span>
            <a
              href="https://amzn.to/eye-drops"
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {t.eyeDrops}
            </a>
            <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>•</span>
            <a
              href="https://amzn.to/monitor-light"
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {t.monitorLight}
            </a>
          </div>
          <p className={`text-xs mt-2 italic ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            {t.affiliateNote}
          </p>
        </div>
      </motion.div>

      {/* Donation Modal */}
      <AnimatePresence>
        {showDonation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-50"
            onClick={() => setShowDonation(false)}
            role="presentation"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="donation-title"
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 max-w-md shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4 text-4xl" aria-hidden="true">🎉</div>
              <h3
                id="donation-title"
                className={`text-2xl font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {t.amazingProgress}
              </h3>
              <p className={`mb-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.sessionsCompleted.replace('{count}', state.sessionsCompleted.toString())} {t.dedication}
              </p>
              <p className={`mb-6 text-sm text-center ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {t.supportDevelopment}
              </p>
              <div className="flex gap-4">
                <a
                  href="https://buymeacoffee.com/shokawamoto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg font-bold text-center hover:from-yellow-500 hover:to-yellow-600 transition-all"
                >
                  ☕ {t.supportWithCoffee}
                </a>
                <button
                  onClick={() => setShowDonation(false)}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {t.maybeLater}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
