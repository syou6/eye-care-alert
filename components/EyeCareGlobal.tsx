'use client';

// EyeCareGlobal — Things 3 / Linear macOS-app style.
// White card on system gray, hairline borders, big tabular-num timer,
// solid blue primary CTA with icon. Light + dark themes only (no time curve).
// Preserves Phase 1 reducer / FSM and i18n routing integration.

import { useEffect, useMemo, useReducer, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AdSlot from '@/components/AdSlot';
import { translations, tKey, type Language } from '@/lib/translations';

const SESSION_SECONDS = 20 * 60;
const BREAK_SECONDS = 20;
const STORAGE_KEY = 'eyeCarePreferences';
const THEME_STORAGE_KEY = 'eyeCareTheme';
const DONATION_INTERVAL = 10;
const BREAK_AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_BREAK_SLOT ?? '';

const LANG_NATIVE: Record<string, string> = {
  en: 'English', ja: '日本語', zh: '中文', ko: '한국어', es: 'Español', fr: 'Français',
  de: 'Deutsch', pt: 'Português', ru: 'Русский', ar: 'العربية', hi: 'हिन्दी', it: 'Italiano',
};
const SUPPORTED_LANGS = Object.keys(LANG_NATIVE) as Language[];
const SUPPORTED_LANG_PREFIXES: Language[] = [
  'ja', 'zh', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'it',
];

// ─── Reducer / state ──────────────────────────────────────────────────────

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
      return { ...state, phase: 'idle', endTime: null, workRemaining: state.remaining };
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

type SavedPrefs = { sessionsCompleted: number; language: Language | null };

function loadPrefs(): SavedPrefs {
  const defaults: SavedPrefs = { sessionsCompleted: 0, language: null };
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      sessionsCompleted: typeof parsed?.sessionsCompleted === 'number' ? parsed.sessionsCompleted : 0,
      language: typeof parsed?.language === 'string' ? (parsed.language as Language) : null,
    };
  } catch {
    return defaults;
  }
}

function savePrefs(prefs: { sessionsCompleted: number; language: Language }) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Component ────────────────────────────────────────────────────────────

export default function EyeCareGlobal({
  initialLanguage,
}: { initialLanguage?: Language } = {}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [language, setLanguage] = useState<Language>(initialLanguage ?? 'en');
  const [theme, setTheme] = useState<'auto' | 'light' | 'dark'>('auto');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [systemDark, setSystemDark] = useState(false);
  const lastDonationShownAt = useRef(0);
  const router = useRouter();

  const t = translations[language];
  const isRTL = language === 'ar';
  const dir: 'ltr' | 'rtl' = isRTL ? 'rtl' : 'ltr';
  const isDark = theme === 'dark' || (theme === 'auto' && systemDark);

  // Hydrate prefs + theme + system dark mode
  useEffect(() => {
    const prefs = loadPrefs();
    if (!initialLanguage) setLanguage(detectLanguage(prefs.language));
    dispatch({ type: 'HYDRATE_SESSIONS', n: prefs.sessionsCompleted });
    lastDonationShownAt.current = prefs.sessionsCompleted;
    try {
      const t = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (t === 'auto' || t === 'light' || t === 'dark') setTheme(t);
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, [initialLanguage]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    savePrefs({ sessionsCompleted: state.sessionsCompleted, language });
  }, [language, state.sessionsCompleted, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme, isLoaded]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [dir, language, isDark]);

  // Single ticker, drift-free
  useEffect(() => {
    if (state.endTime == null) return;
    const tick = () => dispatch({ type: 'TICK', now: Date.now() });
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [state.endTime]);

  useEffect(() => {
    function onVis() {
      if (document.visibilityState === 'visible') {
        dispatch({ type: 'TICK', now: Date.now() });
      }
    }
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

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
          // ignore
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

  const cycleTheme = useCallback(() => {
    setTheme((x) => (x === 'auto' ? 'light' : x === 'light' ? 'dark' : 'auto'));
  }, []);

  const isActive = state.endTime !== null && state.phase === 'work';
  const isPaused = state.phase === 'idle' && state.workRemaining < SESSION_SECONDS && state.workRemaining > 0;
  const showBreak = state.phase === 'break';
  const last60 = isActive && state.remaining <= 60;
  const workSecondsForProgress = state.phase === 'work' ? state.remaining : state.workRemaining;
  const progress = Math.min(1, Math.max(0, (SESSION_SECONDS - workSecondsForProgress) / SESSION_SECONDS));

  const palette = useMemo(
    () =>
      isDark
        ? {
            pageBg: '#0a0a0a',
            cardBg: '#161618',
            cardBorder: 'rgba(255,255,255,0.08)',
            cardShadow: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)',
            ink: '#f5f5f7',
            mute: '#86868b',
            subtle: '#48484a',
            railBg: '#2c2c2e',
            primary: '#0a84ff',
            primaryHover: '#1a8eff',
            warn: '#ff453a',
            badgeBg: 'rgba(10,132,255,0.12)',
            badgeText: '#0a84ff',
          }
        : {
            pageBg: '#f5f5f7',
            cardBg: '#ffffff',
            cardBorder: 'rgba(0,0,0,0.06)',
            cardShadow: '0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.06)',
            ink: '#1d1d1f',
            mute: '#6e6e73',
            subtle: '#c7c7cc',
            railBg: '#e5e5ea',
            primary: '#007aff',
            primaryHover: '#0066d6',
            warn: '#ff3b30',
            badgeBg: '#eef2ff',
            badgeText: '#3056d3',
          },
    [isDark],
  );

  const sansStack =
    'var(--font-geist-sans, "Geist Sans"), -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  const monoStack =
    'var(--font-geist-mono, "Geist Mono"), "SF Mono", Menlo, Consolas, monospace';

  return (
    <div
      dir={dir}
      style={{
        minHeight: '100dvh',
        background: palette.pageBg,
        color: palette.ink,
        fontFamily: sansStack,
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 200ms ease, color 200ms ease',
      }}
    >
      {/* App chrome bar */}
      <header
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span aria-hidden style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: palette.badgeBg }}>
            <EyeGlyph color={palette.primary} />
          </span>
          <span style={{ fontWeight: 600, fontSize: '0.9375rem', letterSpacing: '-0.005em' }}>
            EYE CARE
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ChromeButton onClick={() => setShowLangPicker(true)} ariaLabel="Language" palette={palette}>
            <span style={{ fontFamily: monoStack, fontSize: '0.75rem', letterSpacing: '0.04em', fontWeight: 500 }}>
              {language.toUpperCase()}
            </span>
          </ChromeButton>
          <ChromeButton onClick={cycleTheme} ariaLabel={`Theme: ${theme}`} palette={palette}>
            <ThemeIcon theme={theme} />
          </ChromeButton>
        </div>
      </header>

      {/* Main card */}
      <main style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '8px 16px 40px' }}>
        <section
          style={{
            width: '100%',
            maxWidth: 420,
            background: palette.cardBg,
            border: `1px solid ${palette.cardBorder}`,
            borderRadius: 24,
            boxShadow: palette.cardShadow,
            padding: '32px 28px 24px',
          }}
        >
          {/* Status badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 10px',
                borderRadius: 999,
                background: isActive ? palette.badgeBg : 'transparent',
                border: isActive ? 'none' : `1px solid ${palette.cardBorder}`,
                color: isActive ? palette.badgeText : palette.mute,
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: monoStack,
              }}
            >
              <StatusDot active={isActive} color={isActive ? palette.primary : palette.subtle} />
              {isActive ? t.tracking : isPaused ? t.paused : t.subtitle.split(' • ')[0] ?? t.subtitle}
            </span>
          </div>

          {/* Time */}
          <div
            aria-live="polite"
            style={{
              textAlign: 'center',
              fontVariantNumeric: 'tabular-nums lining-nums',
              fontFeatureSettings: '"tnum","lnum"',
              fontWeight: 300,
              fontSize: 'clamp(4rem, 18vw, 6rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: last60 ? palette.warn : palette.ink,
              transition: 'color 200ms ease',
            }}
          >
            {formatTime(state.remaining)}
          </div>

          {/* Progress bar */}
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            style={{
              marginTop: 20,
              height: 4,
              borderRadius: 999,
              background: palette.railBg,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4, ease: 'linear' }}
              style={{
                position: 'absolute',
                insetInlineStart: 0,
                top: 0,
                height: '100%',
                borderRadius: 999,
                background: last60 ? palette.warn : palette.primary,
              }}
            />
          </div>

          {/* Session meta */}
          <div
            style={{
              marginTop: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              fontSize: '0.75rem',
              color: palette.mute,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <span>20–20–20</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>
              {state.sessionsCompleted} {(t.totalSessions ?? '').toLowerCase()}
            </span>
          </div>

          {/* Primary action */}
          <button
            onClick={handleStartPause}
            style={{
              marginTop: 24,
              width: '100%',
              padding: '14px 18px',
              borderRadius: 14,
              border: 0,
              background: palette.primary,
              color: '#ffffff',
              fontSize: '0.9375rem',
              fontWeight: 600,
              letterSpacing: '-0.005em',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              minHeight: 48,
              boxShadow: `0 1px 2px rgba(0,0,0,0.08), 0 8px 20px ${palette.primary}33`,
              transition: 'transform 80ms ease, background-color 120ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = palette.primaryHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = palette.primary)}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.99)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isActive ? <PauseIcon /> : <PlayIcon />}
            {isActive ? t.pause : t.start}
          </button>

          {/* Secondary */}
          <button
            onClick={handleReset}
            style={{
              marginTop: 8,
              width: '100%',
              padding: '10px 12px',
              border: 0,
              background: 'transparent',
              color: palette.mute,
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderRadius: 10,
              transition: 'color 120ms ease, background-color 120ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = palette.ink;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = palette.mute;
            }}
          >
            {t.reset}
          </button>
        </section>

        {/* Affiliate strip */}
        <div
          style={{
            marginTop: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontSize: '0.6875rem',
            color: palette.mute,
            textAlign: 'center',
            flexWrap: 'wrap',
            padding: '0 16px',
          }}
        >
          <a href="https://amzn.to/blulight-glasses" target="_blank" rel="sponsored noopener noreferrer" style={affLink(palette)}>
            {t.blueLightGlasses}
          </a>
          <span style={{ opacity: 0.4 }}>·</span>
          <a href="https://amzn.to/eye-drops" target="_blank" rel="sponsored noopener noreferrer" style={affLink(palette)}>
            {t.eyeDrops}
          </a>
          <span style={{ opacity: 0.4 }}>·</span>
          <a href="https://amzn.to/monitor-light" target="_blank" rel="sponsored noopener noreferrer" style={affLink(palette)}>
            {t.monitorLight}
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '20px 24px 28px',
          textAlign: 'center',
          fontSize: '0.6875rem',
          color: palette.mute,
        }}
      >
        <a
          href="https://buymeacoffee.com/shokawamoto"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: palette.mute,
            textDecoration: 'none',
            borderBottom: `1px dotted ${palette.subtle}`,
            paddingBottom: 1,
          }}
        >
          {t.buyCoffee}
        </a>
        <span style={{ opacity: 0.4, margin: '0 10px' }}>·</span>
        <a
          href="https://x.com/K8292288065827"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: palette.mute,
            textDecoration: 'none',
            borderBottom: `1px dotted ${palette.subtle}`,
            paddingBottom: 1,
          }}
        >
          {t.contactUs}
        </a>
      </footer>

      {/* Break overlay */}
      <AnimatePresence>
        {showBreak && (
          <BreakOverlay
            language={language}
            breakRemaining={state.remaining}
            palette={palette}
            sansStack={sansStack}
            monoStack={monoStack}
            onSkip={handleSkipBreak}
          />
        )}
      </AnimatePresence>

      {/* Language picker */}
      <AnimatePresence>
        {showLangPicker && (
          <LanguagePicker
            current={language}
            palette={palette}
            sansStack={sansStack}
            onPick={(code) => {
              setLanguage(code);
              setShowLangPicker(false);
              router.push(`/${code}`);
            }}
            onClose={() => setShowLangPicker(false)}
          />
        )}
      </AnimatePresence>

      {/* Donation modal */}
      <AnimatePresence>
        {showDonation && (
          <DonationModal
            language={language}
            sessionsCompleted={state.sessionsCompleted}
            palette={palette}
            sansStack={sansStack}
            monoStack={monoStack}
            onClose={() => setShowDonation(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Atoms ─────────────────────────────────────────────────────────────────

type Palette = {
  pageBg: string; cardBg: string; cardBorder: string; cardShadow: string;
  ink: string; mute: string; subtle: string; railBg: string;
  primary: string; primaryHover: string; warn: string;
  badgeBg: string; badgeText: string;
};

function affLink(p: Palette): React.CSSProperties {
  return {
    color: p.mute,
    textDecoration: 'none',
    borderBottom: `1px dotted ${p.subtle}`,
    paddingBottom: 1,
    whiteSpace: 'nowrap',
  };
}

function ChromeButton({
  onClick,
  ariaLabel,
  palette,
  children,
}: {
  onClick: () => void;
  ariaLabel: string;
  palette: Palette;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        minHeight: 32,
        minWidth: 32,
        padding: '0 10px',
        borderRadius: 8,
        border: 0,
        background: 'transparent',
        color: palette.mute,
        cursor: 'pointer',
        transition: 'background-color 120ms ease, color 120ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = palette.badgeBg;
        e.currentTarget.style.color = palette.ink;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = palette.mute;
      }}
    >
      {children}
    </button>
  );
}

function StatusDot({ active, color }: { active: boolean; color: string }) {
  return (
    <span
      aria-hidden
      style={{
        width: 6,
        height: 6,
        borderRadius: 999,
        background: color,
        boxShadow: active ? `0 0 0 3px ${color}22` : 'none',
        display: 'inline-block',
      }}
    />
  );
}

function EyeGlyph({ color }: { color: string }) {
  return (
    <svg width="16" height="11" viewBox="0 0 18 12" fill="none" aria-hidden>
      <path d="M1 6 C 4 1, 14 1, 17 6 C 14 11, 4 11, 1 6 Z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9" cy="6" r="2.4" fill={color} />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3.5 2.5 L11 7 L3.5 11.5 Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="3" y="2.5" width="3" height="9" rx="1" fill="currentColor" />
      <rect x="8" y="2.5" width="3" height="9" rx="1" fill="currentColor" />
    </svg>
  );
}

function ThemeIcon({ theme }: { theme: 'auto' | 'light' | 'dark' }) {
  if (theme === 'dark')
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M12.5 9.2A4.5 4.5 0 1 1 6.8 3.5 5 5 0 0 0 12.5 9.2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  if (theme === 'light')
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <path d="M8 1.5v1.4M8 13.1v1.4M1.5 8h1.4M13.1 8h1.4M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
        </g>
      </svg>
    );
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="4.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 3.8v8.4a4.2 4.2 0 0 0 0-8.4Z" fill="currentColor" />
    </svg>
  );
}

// ─── Break overlay ─────────────────────────────────────────────────────────

function BreakOverlay({
  language, breakRemaining, palette, sansStack, monoStack, onSkip,
}: {
  language: Language;
  breakRemaining: number;
  palette: Palette;
  sansStack: string;
  monoStack: string;
  onSkip: () => void;
}) {
  const t = translations[language];
  const elapsed = BREAK_SECONDS - breakRemaining;
  const progress = Math.min(1, Math.max(0, elapsed / BREAK_SECONDS));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-label={t.restYourEyes}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: palette.pageBg,
        color: palette.ink,
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        fontFamily: sansStack,
      }}
    >
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <div
          aria-hidden
          style={{
            margin: '0 auto 28px',
            width: 96,
            height: 96,
            borderRadius: 999,
            background: palette.badgeBg,
            display: 'grid',
            placeItems: 'center',
            color: palette.primary,
          }}
        >
          <svg width="44" height="30" viewBox="0 0 44 30" fill="none" aria-hidden>
            <path d="M2 15 C 8 3, 36 3, 42 15 C 36 27, 8 27, 2 15 Z" stroke="currentColor" strokeWidth="2" />
            <circle cx="22" cy="15" r="6.5" fill="currentColor" />
          </svg>
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 600,
            letterSpacing: '-0.015em',
          }}
        >
          {t.restYourEyes}
        </h2>
        <p
          style={{
            margin: '8px 0 28px',
            color: palette.mute,
            fontSize: '0.9375rem',
          }}
        >
          {t.lookAway}
        </p>

        <div
          style={{
            fontFamily: monoStack,
            fontSize: 'clamp(4rem, 18vw, 5.5rem)',
            fontWeight: 300,
            letterSpacing: '-0.03em',
            fontVariantNumeric: 'tabular-nums lining-nums',
            color: palette.ink,
          }}
        >
          {String(breakRemaining).padStart(2, '0')}
        </div>

        <div
          style={{
            margin: '20px auto 0',
            width: '70%',
            height: 4,
            borderRadius: 999,
            background: palette.railBg,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <motion.div
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4, ease: 'linear' }}
            style={{
              position: 'absolute',
              insetInlineStart: 0,
              top: 0,
              height: '100%',
              borderRadius: 999,
              background: palette.primary,
            }}
          />
        </div>

        <button
          onClick={onSkip}
          disabled={elapsed < 3}
          style={{
            marginTop: 32,
            padding: '8px 16px',
            border: 0,
            background: 'transparent',
            color: palette.mute,
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: elapsed < 3 ? 'not-allowed' : 'pointer',
            opacity: elapsed < 3 ? 0.4 : 1,
            borderRadius: 10,
          }}
        >
          {t.skipBreak}
        </button>

        {BREAK_AD_SLOT && elapsed >= 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid ${palette.cardBorder}` }}
          >
            <div
              style={{
                fontSize: '0.6875rem',
                color: palette.mute,
                marginBottom: 10,
                fontFamily: monoStack,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {tKey(language, 'sponsoredBy')}
            </div>
            <AdSlot slot={BREAK_AD_SLOT} format="auto" reservedHeight={100} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Language picker ───────────────────────────────────────────────────────

function LanguagePicker({
  current, palette, sansStack, onPick, onClose,
}: {
  current: Language;
  palette: Palette;
  sansStack: string;
  onPick: (lang: Language) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'grid',
        placeItems: 'center',
        padding: 16,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        fontFamily: sansStack,
      }}
    >
      <motion.div
        initial={{ scale: 0.96, y: 8, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 360,
          background: palette.cardBg,
          border: `1px solid ${palette.cardBorder}`,
          borderRadius: 18,
          boxShadow: palette.cardShadow,
          padding: 8,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        {SUPPORTED_LANGS.map((code) => {
          const selected = code === current;
          return (
            <button
              key={code}
              onClick={() => onPick(code)}
              style={{
                width: '100%',
                textAlign: 'start',
                padding: '12px 14px',
                borderRadius: 10,
                border: 0,
                background: selected ? palette.badgeBg : 'transparent',
                color: selected ? palette.badgeText : palette.ink,
                fontSize: '0.9375rem',
                fontWeight: selected ? 600 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background-color 120ms ease',
              }}
            >
              <span>{LANG_NATIVE[code]}</span>
              {selected && <CheckIcon color={palette.primary} />}
            </button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3 7.5 L6 10.5 L11.5 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Donation modal ────────────────────────────────────────────────────────

function DonationModal({
  language, sessionsCompleted, palette, sansStack, monoStack, onClose,
}: {
  language: Language;
  sessionsCompleted: number;
  palette: Palette;
  sansStack: string;
  monoStack: string;
  onClose: () => void;
}) {
  const t = translations[language];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        fontFamily: sansStack,
      }}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 380,
          background: palette.cardBg,
          border: `1px solid ${palette.cardBorder}`,
          borderRadius: 20,
          boxShadow: palette.cardShadow,
          padding: 28,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: monoStack,
            fontSize: '0.6875rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: palette.mute,
            marginBottom: 14,
          }}
        >
          {sessionsCompleted} · {(t.totalSessions ?? '').toLowerCase()}
        </div>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.015em' }}>
          {t.amazingProgress}
        </h3>
        <p style={{ marginTop: 10, color: palette.mute, fontSize: '0.875rem', lineHeight: 1.5 }}>
          {t.supportDevelopment}
        </p>
        <div style={{ marginTop: 24, display: 'flex', gap: 8, justifyContent: 'center' }}>
          <a
            href="https://buymeacoffee.com/shokawamoto"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 12,
              background: palette.primary,
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            {t.supportWithCoffee}
          </a>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 12,
              border: `1px solid ${palette.cardBorder}`,
              background: 'transparent',
              color: palette.ink,
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {tKey(language, 'later')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
