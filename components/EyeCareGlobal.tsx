'use client';

// EyeCareGlobal — "Hours" editorial redesign.
// Preserves the Phase-1 reducer (timestamp-based FSM) and the i18n routing
// integration; only the JSX render tree adopts the new design language.

import { useEffect, useMemo, useReducer, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdSlot from '@/components/AdSlot';
import HelpModal from '@/components/HelpModal';
import WelcomeModal, { WELCOME_STORAGE_KEY } from '@/components/WelcomeModal';
import { translations, HOURS_KEYS, tKey, type Language } from '@/lib/translations';
import {
  effectivePalette, paletteVars,
  hourLabelFor, roman, isVigil, isRTL as hoursIsRTL, langLineHeight,
  FONT_SERIF,
} from '@/lib/hours';
import {
  unlockAudio, chimeBreakStart, chimeBreakEnd, chimeWarning,
  loadMuted, setMuted as persistMuted,
} from '@/lib/audio';
import { tickStreak, isFirstSessionToday, milestoneFor, loadStreak, bumpDailySession } from '@/lib/streak';
import { track } from '@/lib/analytics';

const SESSION_SECONDS = 20 * 60;
const BREAK_SECONDS = 20;
const STORAGE_KEY = 'eyeCarePreferences';
const THEME_STORAGE_KEY = 'hours-theme';
const DONATION_INTERVAL = 10;
const BREAK_AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_BREAK_SLOT ?? '';
const SUPPORTED_LANGS = [
  'en', 'ja', 'zh', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'it',
] as const;
const LANG_NATIVE: Record<string, string> = {
  en: 'English', ja: '日本語', zh: '中文', ko: '한국어', es: 'Español', fr: 'Français',
  de: 'Deutsch', pt: 'Português', ru: 'Русский', ar: 'العربية', hi: 'हिन्दी', it: 'Italiano',
};
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

type SavedPrefs = {
  sessionsCompleted: number;
  language: Language | null;
};

function loadPrefs(): SavedPrefs {
  const defaults: SavedPrefs = { sessionsCompleted: 0, language: null };
  if (typeof window === 'undefined') return defaults;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaults;
    const parsed = JSON.parse(saved);
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
    // quota / private mode — ignore
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
}: {
  initialLanguage?: Language;
} = {}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [language, setLanguage] = useState<Language>(initialLanguage ?? 'en');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAmbientHint, setShowAmbientHint] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [streakChip, setStreakChip] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastDonationShownAt = useRef(0);
  const warnedAt5sRef = useRef(false);
  const router = useRouter();

  const t = translations[language];
  const isRTL = hoursIsRTL(language);
  const dir: 'ltr' | 'rtl' = isRTL ? 'rtl' : 'ltr';
  const lh = langLineHeight(language);

  // Local hour drives the palette — recomputed every minute.
  const [hour, setHour] = useState(() => {
    const d = new Date();
    return d.getHours() + d.getMinutes() / 60;
  });
  useEffect(() => {
    const id = window.setInterval(() => {
      const d = new Date();
      setHour(d.getHours() + d.getMinutes() / 60);
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  // Theme override (auto/light/dark) persisted under its own key.
  const [theme, setTheme] = useState<'auto' | 'light' | 'dark'>('auto');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'auto' || saved === 'light' || saved === 'dark') setTheme(saved);
    } catch {
      // ignore
    }
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Hydrate session prefs once (URL-provided language wins).
  useEffect(() => {
    const prefs = loadPrefs();
    if (!initialLanguage) setLanguage(detectLanguage(prefs.language));
    dispatch({ type: 'HYDRATE_SESSIONS', n: prefs.sessionsCompleted });
    lastDonationShownAt.current = prefs.sessionsCompleted;
    setMutedState(loadMuted());
    // First-run: show welcome OR ambient hint (mutually exclusive).
    try {
      const seenWelcome = window.localStorage.getItem(WELCOME_STORAGE_KEY) === '1';
      if (!seenWelcome) {
        setShowWelcome(true);
      } else {
        const seenHint = window.localStorage.getItem('eyeCareAmbientHintSeen') === '1';
        if (!seenHint) setShowAmbientHint(true);
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, [initialLanguage]);

  useEffect(() => {
    if (!isLoaded) return;
    savePrefs({ sessionsCompleted: state.sessionsCompleted, language });
  }, [language, state.sessionsCompleted, isLoaded]);

  // Set <html> dir + lang to match current language.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  // Single ticker — recomputes remaining from endTime, no drift.
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

  // Last-5s warning chime (work phase only).
  useEffect(() => {
    if (state.phase !== 'work' || state.endTime == null) {
      warnedAt5sRef.current = false;
      return;
    }
    if (state.remaining <= 5 && state.remaining > 0 && !warnedAt5sRef.current) {
      warnedAt5sRef.current = true;
      chimeWarning();
    }
    if (state.remaining > 5) warnedAt5sRef.current = false;
  }, [state.phase, state.remaining, state.endTime]);

  // Phase transitions when remaining reaches zero.
  useEffect(() => {
    if (state.remaining !== 0) return;
    if (state.phase === 'work') {
      chimeBreakStart();
      bumpDailySession();
      dispatch({ type: 'START_BREAK' });
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(t.notification.title, {
            body: t.notification.body,
            tag: 'eye-care-break',
            icon: '/icon.svg',
          });
        } catch {
          // some browsers throw
        }
      }
      const next = state.sessionsCompleted + 1;
      // Streak tracking — only on the day's first completed session.
      if (isFirstSessionToday()) {
        const { state: streak, advanced } = tickStreak();
        if (advanced) {
          const m = milestoneFor(streak.streak);
          const copy =
            m === 'first'
              ? tKey(language, 'firstSessionToday')
              : m === 'week'
                ? tKey(language, 'streakWeek')
                : m === 'month'
                  ? tKey(language, 'streakMonth')
                  : m === 'hundred'
                    ? tKey(language, 'streakHundred')
                    : tKey(language, 'streakDay').replace('{n}', String(streak.streak));
          setStreakChip(copy);
          window.setTimeout(() => setStreakChip(null), 8000);
        }
      }
      if (next % DONATION_INTERVAL === 0 && next !== lastDonationShownAt.current) {
        setShowDonation(true);
        lastDonationShownAt.current = next;
      }
    } else if (state.phase === 'break') {
      chimeBreakEnd();
      dispatch({ type: 'END_BREAK' });
    }
  }, [state.phase, state.remaining, state.sessionsCompleted, t.notification, language]);

  const handleStartPause = useCallback(() => {
    if (state.phase === 'idle') {
      void unlockAudio();
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
      if (showAmbientHint) {
        try {
          window.localStorage.setItem('eyeCareAmbientHintSeen', '1');
        } catch {
          // ignore
        }
        setShowAmbientHint(false);
      }
      track('timer_start', { language });
      dispatch({ type: 'START' });
    } else {
      track('timer_pause', { language });
      dispatch({ type: 'PAUSE' });
    }
  }, [state.phase, showAmbientHint, language]);

  const handleReset = useCallback(() => {
    track('timer_reset', { language });
    dispatch({ type: 'RESET' });
  }, [language]);
  const handleSkipBreak = useCallback(() => {
    track('break_skipped', { language });
    dispatch({ type: 'SKIP_BREAK' });
  }, [language]);

  const toggleMuted = useCallback(() => {
    setMutedState((m) => {
      const next = !m;
      persistMuted(next);
      return next;
    });
  }, []);

  const handleWelcomeComplete = useCallback(() => {
    try {
      window.localStorage.setItem(WELCOME_STORAGE_KEY, '1');
    } catch {
      // ignore
    }
    setShowWelcome(false);
  }, []);

  // Keyboard shortcuts.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (showWelcome || showLangPicker || showHelp || showDonation) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleStartPause();
      } else if (e.key === 'r' || e.key === 'R') {
        handleReset();
      } else if (e.key === 'Escape') {
        if (state.phase === 'break') handleSkipBreak();
      } else if (e.key === '?') {
        setShowHelp(true);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handleStartPause, handleReset, handleSkipBreak, state.phase, showWelcome, showLangPicker, showHelp, showDonation]);

  const cycleTheme = useCallback(() => {
    setTheme((x) => (x === 'auto' ? 'dark' : x === 'dark' ? 'light' : 'auto'));
  }, []);

  // Derived UI flags.
  const isActive = state.endTime !== null && state.phase === 'work';
  const isPaused = state.phase === 'idle' && state.workRemaining < SESSION_SECONDS && state.workRemaining > 0;
  const showBreak = state.phase === 'break';
  const last60 = isActive && state.remaining <= 60;
  const palette = useMemo(() => effectivePalette(hour, theme), [hour, theme]);
  const vigil = (theme === 'auto' && isVigil(hour)) || theme === 'dark';
  const workSecondsForProgress = state.phase === 'work' ? state.remaining : state.workRemaining;
  const progress = Math.min(1, Math.max(0, (SESSION_SECONDS - workSecondsForProgress) / SESSION_SECONDS));
  const localTime = `${String(Math.floor(hour)).padStart(2, '0')}:${String(Math.floor((hour % 1) * 60)).padStart(2, '0')}`;
  const hourLabel = hourLabelFor(hour);
  const hourWord =
    (translations[language] as unknown as { hourWords?: Record<string, string> })?.hourWords?.[hourLabel] ??
    HOURS_KEYS.hourWords[hourLabel] ??
    hourLabel;

  return (
    <MotionConfig reducedMotion="user">
    <div
      dir={dir}
      style={{
        ...paletteVars(palette),
        background: 'var(--c-bg)',
        color: 'var(--c-ink)',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-geist-sans, "Geist Sans", ui-sans-serif, system-ui, sans-serif)',
        containerType: 'inline-size',
        transition: 'background-color 1.6s ease, color 1.6s ease',
      }}
    >
      {/* Masthead */}
      <header
        className="flex items-baseline justify-between px-5 pt-4 pb-3"
        style={{ borderBottom: '1px solid var(--c-rule)', gap: 12 }}
      >
        <div className="flex items-baseline gap-3 min-w-0 flex-1">
          <span style={{
            fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
            fontSize: '.6875rem', fontWeight: 500, letterSpacing: '.16em',
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>
            {vigil ? '☾ ' : ''}EYE&nbsp;CARE
          </span>
          <span style={{
            fontFamily: FONT_SERIF, fontStyle: 'italic',
            fontSize: '.82rem', color: 'var(--c-mute)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{hourWord}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowHelp(true)}
            aria-label={tKey(language, 'helpLabel')}
            style={{
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: '.75rem', color: 'var(--c-mute)',
              background: 'transparent', border: 0, cursor: 'pointer', padding: '2px 6px',
            }}
          >
            ?
          </button>
          <button
            onClick={toggleMuted}
            aria-label={muted ? tKey(language, 'soundOff') : tKey(language, 'soundOn')}
            style={{ color: 'var(--c-mute)', background: 'transparent', border: 0, cursor: 'pointer', padding: 4 }}
          >
            <SoundGlyph muted={muted} />
          </button>
          <button
            onClick={() => setShowLangPicker(true)}
            aria-label="Language"
            style={{
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: '.625rem', letterSpacing: '.12em',
              textTransform: 'uppercase', color: 'var(--c-mute)',
              background: 'transparent', border: 0, cursor: 'pointer',
            }}
          >
            {language.toUpperCase()}
          </button>
          <button
            onClick={cycleTheme}
            aria-label={`Theme: ${theme}`}
            style={{ color: 'var(--c-mute)', background: 'transparent', border: 0, cursor: 'pointer', padding: 4 }}
          >
            <ThemeGlyph theme={theme} />
          </button>
        </div>
      </header>

      {/* Hairline progress */}
      <div style={{ height: 1, background: 'var(--c-rule)', position: 'relative' }}>
        <motion.div
          style={{
            position: 'absolute', insetInlineStart: 0, top: -0.5, height: 2,
            background: last60 ? 'var(--c-warn)' : 'var(--c-primary)',
          }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      </div>

      {/* Centerpiece */}
      <main className="flex-1 grid place-items-center px-6 py-8" style={{ gridTemplateRows: '1fr auto 1fr' }}>
        <div />
        <div className="text-center" style={{ maxWidth: 760 }}>
          <div style={{
            fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
            fontSize: '.625rem', letterSpacing: '.12em', textTransform: 'uppercase',
            color: 'var(--c-mute)', marginBottom: 10,
          }}>
            {t.title} · {roman(state.sessionsCompleted + 1)} · {localTime}
          </div>
          <div
            aria-live="polite"
            style={{
              fontFamily: FONT_SERIF, fontStyle: 'italic', fontWeight: vigil ? 200 : 300,
              fontSize: 'clamp(5rem, 32cqw, 16rem)', lineHeight: 0.92,
              letterSpacing: '-0.02em', color: 'var(--c-ink)',
              fontVariantNumeric: 'lining-nums tabular-nums',
              position: 'relative',
            }}
          >
            {formatTime(state.remaining)}
            {last60 && (
              <span aria-hidden style={{
                position: 'absolute', inset: '-6%',
                background: 'radial-gradient(closest-side, var(--c-warn) 0%, transparent 65%)',
                opacity: 0.14, pointerEvents: 'none',
              }} />
            )}
          </div>
          <div style={{
            fontFamily: FONT_SERIF, fontStyle: 'italic',
            fontSize: '1.125rem', color: 'var(--c-mute)',
            marginTop: 10, lineHeight: lh,
          }}>
            {!isActive && !isPaused && t.subtitle}
            {isActive && (last60 ? '—' : <em>{t.tracking?.toLowerCase?.() ?? t.tracking}</em>)}
            {isPaused && <em>{t.paused?.toLowerCase?.() ?? t.paused}</em>}
          </div>
        </div>

        <div className="self-start mt-8 flex flex-col items-center gap-3">
          <button
            onClick={handleStartPause}
            style={{
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: '.6875rem', letterSpacing: '.16em', textTransform: 'uppercase',
              border: '1px solid var(--c-ink)', color: 'var(--c-ink)',
              background: 'transparent', padding: '12px 22px',
              minHeight: 44, minWidth: 132, cursor: 'pointer',
            }}
          >
            {isActive ? t.pause : t.start}
          </button>
          <button
            onClick={handleReset}
            style={{
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: '.625rem', letterSpacing: '.12em', textTransform: 'uppercase',
              color: 'var(--c-mute)', background: 'transparent', border: 0, padding: '8px 12px',
              cursor: 'pointer',
            }}
          >
            {t.reset}
          </button>

          <AnimatePresence>
            {showAmbientHint && !isActive && !showBreak && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  marginTop: 18,
                  maxWidth: 340,
                  fontFamily: FONT_SERIF, fontStyle: 'italic',
                  fontSize: '.875rem', color: 'var(--c-mute)',
                  textAlign: 'center', lineHeight: lh,
                }}
              >
                {tKey(language, 'ambientHint')}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--c-rule)', padding: '12px 20px 14px' }} className="flex flex-col gap-2">
        <div className="flex justify-between items-baseline">
          <div style={{
            fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
            fontSize: '.625rem', letterSpacing: '.12em', textTransform: 'uppercase',
            color: 'var(--c-mute)',
          }}>
            <span style={{ fontFamily: FONT_SERIF, fontStyle: 'italic', letterSpacing: 0, textTransform: 'none' }}>
              {roman(state.sessionsCompleted)}
            </span>
            <span style={{ margin: '0 .5em', opacity: 0.5 }}>·</span>
            {t.totalSessions?.toLowerCase?.() ?? t.totalSessions}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowHelp(true)}
              style={footerLinkStyle}
            >
              Help
            </button>
            <Link href="/about" style={footerLinkStyle}>About</Link>
            <Link href="/stats" style={footerLinkStyle}>Stats</Link>
            <Link href="/learn" style={footerLinkStyle}>Learn</Link>
            <Link href="/privacy" style={footerLinkStyle}>Privacy</Link>
            <Link href="/terms" style={footerLinkStyle}>Terms</Link>
            <a
              href="/eye-care.ics"
              download
              style={footerLinkStyle}
            >
              .ics
            </a>
            <a
              href="https://buymeacoffee.com/shokawamoto"
              target="_blank"
              rel="noopener noreferrer"
              style={footerLinkStyle}
            >
              {t.buyCoffee}
            </a>
          </div>
        </div>
        <div style={{
          fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
          fontSize: '.55rem', letterSpacing: '.12em', textTransform: 'uppercase',
          color: 'var(--c-mute)', opacity: 0.6, textAlign: 'center',
        }}>
          {tKey(language, 'kbdHint')}
        </div>
      </footer>

      {/* Break overlay */}
      <AnimatePresence>
        {showBreak && (
          <BreakOverlay
            language={language}
            breakRemaining={state.remaining}
            vigil={vigil}
            onSkip={handleSkipBreak}
          />
        )}
      </AnimatePresence>

      {/* Language picker */}
      <AnimatePresence>
        {showLangPicker && (
          <LanguagePicker
            current={language}
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
            onClose={() => setShowDonation(false)}
          />
        )}
      </AnimatePresence>

      {/* Help modal */}
      <AnimatePresence>
        {showHelp && <HelpModal language={language} onClose={() => setShowHelp(false)} />}
      </AnimatePresence>

      {/* Welcome (first run) */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeModal
            language={language}
            onLanguageChange={(code) => {
              setLanguage(code);
              router.push(`/${code}`);
            }}
            onComplete={handleWelcomeComplete}
          />
        )}
      </AnimatePresence>

      {/* Streak chip */}
      <AnimatePresence>
        {streakChip && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              bottom: 'max(20px, env(safe-area-inset-bottom))',
              insetInlineStart: 20,
              zIndex: 45,
              background: 'var(--c-surface)',
              border: '1px solid var(--c-rule)',
              padding: '10px 16px',
              fontFamily: FONT_SERIF,
              fontStyle: 'italic',
              fontSize: '.875rem',
              color: 'var(--c-ink)',
              maxWidth: 'calc(100vw - 40px)',
            }}
          >
            {streakChip}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </MotionConfig>
  );
}

function SoundGlyph({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M2 5h2l3-2.2v8.4L4 9H2V5Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
        <path d="M9.5 4.5l3 5M12.5 4.5l-3 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M2 5h2l3-2.2v8.4L4 9H2V5Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <path d="M9.4 4.4a3.5 3.5 0 0 1 0 5.2M11 2.8a6 6 0 0 1 0 8.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

const affLink: React.CSSProperties = {
  color: 'var(--c-mute)',
  textDecoration: 'none',
  borderBottom: '1px dotted var(--c-rule)',
  paddingBottom: 1,
};

const footerLinkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
  fontSize: '.625rem', letterSpacing: '.12em', textTransform: 'uppercase',
  color: 'var(--c-mute)', textDecoration: 'none',
  background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
};

// ─── Break overlay ────────────────────────────────────────────────────────

function BreakOverlay({
  language, breakRemaining, vigil, onSkip,
}: {
  language: Language;
  breakRemaining: number;
  vigil: boolean;
  onSkip: () => void;
}) {
  const t = translations[language];
  const elapsed = BREAK_SECONDS - breakRemaining;
  const dir: 'ltr' | 'rtl' = hoursIsRTL(language) ? 'rtl' : 'ltr';
  const lh = langLineHeight(language);

  const ct = elapsed % 10;
  let phaseText = tKey(language, 'breatheIn');
  let scale = 0.6 + 0.4 * (ct / 4);
  if (ct >= 4 && ct < 6) {
    phaseText = tKey(language, 'breatheHold');
    scale = 1.0;
  } else if (ct >= 6) {
    phaseText = tKey(language, 'breatheOut');
    scale = 1.0 - 0.4 * ((ct - 6) / 4);
  }

  const adVisible = elapsed >= 5;

  return (
    <motion.div
      dir={dir}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="dialog"
      aria-label={t.restYourEyes}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'var(--c-surface)', color: 'var(--c-ink)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-geist-sans, "Geist Sans", ui-sans-serif, system-ui, sans-serif)',
        containerType: 'inline-size',
      }}
    >
      <div
        className="px-5 py-4 flex justify-between items-center"
        style={{
          fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
          fontSize: '.6875rem', letterSpacing: '.16em', textTransform: 'uppercase',
          color: 'var(--c-mute)',
        }}
      >
        <span>{vigil ? '☾ ' : ''}EYE&nbsp;CARE</span>
        <span style={{
          fontFamily: FONT_SERIF, fontStyle: 'italic',
          fontSize: '.75rem', letterSpacing: 0, textTransform: 'none',
        }}>{t.restYourEyes?.toLowerCase?.() ?? t.restYourEyes}</span>
      </div>

      <div className="flex-1 grid place-items-center relative">
        <motion.div
          aria-hidden
          animate={{ scale }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'absolute',
            width: 'min(46vh, 360px)', height: 'min(46vh, 360px)',
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, var(--c-primary) 0%, transparent 70%)',
            opacity: 0.22,
          }}
        />
        <motion.div
          aria-hidden
          animate={{ scale: scale * 0.95 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'absolute',
            width: 'min(46vh, 360px)', height: 'min(46vh, 360px)',
            borderRadius: '50%',
            border: '1px solid var(--c-rule)',
          }}
        />

        <div className="text-center relative">
          <div style={{
            fontFamily: FONT_SERIF, fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(3rem, 20cqw, 8rem)', lineHeight: 1,
            letterSpacing: '-0.02em', color: 'var(--c-ink)',
            fontVariantNumeric: 'lining-nums tabular-nums',
          }}>
            {String(breakRemaining).padStart(2, '0')}
          </div>
          <motion.div
            key={phaseText}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: FONT_SERIF, fontStyle: 'italic',
              fontSize: '1.125rem', color: 'var(--c-ink)', marginTop: 12, lineHeight: lh,
            }}
          >
            {phaseText}
          </motion.div>
          <div style={{
            fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
            fontSize: '.625rem', letterSpacing: '.12em', textTransform: 'uppercase',
            color: 'var(--c-mute)', marginTop: 18,
          }}>
            {t.lookAway}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="flex justify-center mb-3">
          <button
            onClick={onSkip}
            disabled={elapsed < 3}
            style={{
              fontFamily: FONT_SERIF, fontStyle: 'italic',
              color: 'var(--c-mute)', background: 'transparent', border: 0,
              padding: '6px 12px', fontSize: '.95rem',
              borderBottom: '1px dotted var(--c-rule)',
              cursor: elapsed < 3 ? 'not-allowed' : 'pointer',
              opacity: elapsed < 3 ? 0.4 : 1,
            }}
          >
            {t.skipBreak?.toLowerCase?.() ?? t.skipBreak}
          </button>
        </div>
        {BREAK_AD_SLOT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: adVisible ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            style={{ borderTop: '1px solid var(--c-rule)', paddingTop: 14, textAlign: 'center' }}
          >
            <div style={{
              fontFamily: FONT_SERIF, fontStyle: 'italic',
              fontSize: '.78rem', color: 'var(--c-mute)', marginBottom: 10,
            }}>
              {tKey(language, 'sponsoredBy')}
            </div>
            <AdSlot slot={BREAK_AD_SLOT} format="auto" reservedHeight={100} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Language picker ──────────────────────────────────────────────────────

function LanguagePicker({
  current, onPick, onClose,
}: {
  current: Language;
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
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'color-mix(in srgb, var(--c-bg) 85%, transparent)',
        display: 'grid', placeItems: 'center', padding: 24,
      }}
    >
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 4, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--c-surface)', border: '1px solid var(--c-rule)',
          padding: '24px 0', minWidth: 280, maxWidth: 360, width: '100%',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
          fontSize: '.6875rem', letterSpacing: '.16em', textTransform: 'uppercase',
          color: 'var(--c-mute)', textAlign: 'center', marginBottom: 14,
        }}>
          Language
        </div>
        {SUPPORTED_LANGS.map((code) => (
          <button
            key={code}
            onClick={() => onPick(code as Language)}
            style={{
              display: 'block', width: '100%', textAlign: 'start',
              background: 'transparent', border: 0,
              padding: '10px 24px', cursor: 'pointer',
              fontFamily: FONT_SERIF, fontStyle: 'italic',
              fontSize: '1.05rem',
              color: code === current ? 'var(--c-primary)' : 'var(--c-ink)',
            }}
          >
            {LANG_NATIVE[code]}
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Donation modal ───────────────────────────────────────────────────────

function DonationModal({
  language, sessionsCompleted, onClose,
}: {
  language: Language;
  sessionsCompleted: number;
  onClose: () => void;
}) {
  const t = translations[language];
  const ask =
    (translations[language] as unknown as { donationAsk?: string }).donationAsk ?? HOURS_KEYS.donationAsk;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 70, display: 'grid', placeItems: 'center',
        background: 'color-mix(in srgb, var(--c-bg) 80%, transparent)', padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--c-surface)', border: '1px solid var(--c-rule)',
          padding: '36px 32px', maxWidth: 420, textAlign: 'center',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
          fontSize: '.625rem', letterSpacing: '.12em', textTransform: 'uppercase',
          color: 'var(--c-mute)', marginBottom: 14,
        }}>
          {roman(sessionsCompleted)} · {t.totalSessions?.toLowerCase?.() ?? t.totalSessions}
        </div>
        <div style={{
          fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: '1.4rem',
          color: 'var(--c-ink)', textWrap: 'balance' as never,
        }}>
          {ask}
        </div>
        <div className="flex gap-3 justify-center mt-7">
          <a
            href="https://buymeacoffee.com/shokawamoto"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: '.6875rem', letterSpacing: '.16em', textTransform: 'uppercase',
              background: 'var(--c-ink)', color: 'var(--c-bg)',
              padding: '12px 22px', textDecoration: 'none',
            }}
          >
            {t.supportWithCoffee}
          </a>
          <button
            onClick={onClose}
            style={{
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: '.625rem', letterSpacing: '.12em', textTransform: 'uppercase',
              color: 'var(--c-mute)', background: 'transparent', border: 0, padding: '12px',
              cursor: 'pointer',
            }}
          >
            {tKey(language, 'later')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Theme glyph ──────────────────────────────────────────────────────────

function ThemeGlyph({ theme }: { theme: 'auto' | 'light' | 'dark' }) {
  if (theme === 'dark')
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M11 8a4 4 0 1 1-5-5 4 4 0 0 0 5 5z" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  if (theme === 'light')
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="2.4" stroke="currentColor" strokeWidth="1" />
        <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
          <path d="M7 1.5v1.2M7 11.3v1.2M1.5 7h1.2M11.3 7h1.2M3 3l.85.85M10.15 10.15l.85.85M3 11l.85-.85M10.15 3.85l.85-.85" />
        </g>
      </svg>
    );
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="3.5" stroke="currentColor" strokeWidth="1" />
      <path d="M7 3.5v7a3.5 3.5 0 0 0 0-7z" fill="currentColor" />
    </svg>
  );
}
