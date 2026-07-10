'use client';

// EyeCareGlobal — "Shadow Console" neumorphic redesign.
// One material, one light source (top-left): every surface shares --bg and is
// separated only by soft dual shadows (see .neu / .neu-pressed in globals.css).
// Accent is reserved as signal — primary action, progress, ON/selected, the
// last-minute urgent readout. Preserves the timestamp-based reducer, i18n
// routing, audio, ticker, streak and Pro logic; only the render tree changed.

import { useEffect, useReducer, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdSlot from '@/components/AdSlot';
import HelpModal from '@/components/HelpModal';
import WelcomeModal, { WELCOME_STORAGE_KEY } from '@/components/WelcomeModal';
import { translations, HOURS_KEYS, tKey, type Language } from '@/lib/translations';
import {
  hourLabelFor, roman, isRTL as hoursIsRTL, langLineHeight,
} from '@/lib/hours';

// Shadow Console typefaces (defined in layout.tsx via next/font).
const F_UI = 'var(--font-grotesk), ui-sans-serif, system-ui, sans-serif';
const F_MONO = 'var(--font-console), ui-monospace, monospace';
import {
  unlockAudio, chimeBreakStart, chimeBreakEnd, chimeWarning,
  loadMuted, setMuted as persistMuted,
} from '@/lib/audio';
import { tickStreak, isFirstSessionToday, milestoneFor, bumpDailySession } from '@/lib/streak';
import { isPro } from '@/lib/pro';
import { showBreakNotification } from '@/lib/notify';
import { startTicker } from '@/lib/ticker';
import { track } from '@/lib/analytics';

const SESSION_SECONDS = 20 * 60;
const BREAK_SECONDS = 20;
const STORAGE_KEY = 'eyeCarePreferences';
const THEME_STORAGE_KEY = 'hours-theme';
const DONATION_INTERVAL = 10;
const BREAK_AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_BREAK_SLOT ?? '';
// Stripe Payment Link for the one-time Pro purchase. Interval controls stay
// hidden until this is configured (or the visitor already owns Pro).
const PRO_PAYMENT_LINK = process.env.NEXT_PUBLIC_PRO_PAYMENT_LINK ?? '';
// Pro rhythm presets (seconds).
const WORK_PRESETS = [15 * 60, 20 * 60, 25 * 60, 30 * 60, 45 * 60] as const;
const BREAK_PRESETS = [20, 30, 60] as const;
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
  workSeconds: number;
  breakSeconds: number;
};

const initialState: TimerState = {
  phase: 'idle',
  endTime: null,
  remaining: SESSION_SECONDS,
  workRemaining: SESSION_SECONDS,
  sessionsCompleted: 0,
  workSeconds: SESSION_SECONDS,
  breakSeconds: BREAK_SECONDS,
};

type Action =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'TICK'; now: number }
  | { type: 'START_BREAK' }
  | { type: 'END_BREAK' }
  | { type: 'SKIP_BREAK' }
  | { type: 'HYDRATE_SESSIONS'; n: number }
  | { type: 'SET_INTERVALS'; workSeconds: number; breakSeconds: number };

function reducer(state: TimerState, action: Action): TimerState {
  switch (action.type) {
    case 'START': {
      const remaining = state.workRemaining > 0 ? state.workRemaining : state.workSeconds;
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
      return {
        ...initialState,
        sessionsCompleted: state.sessionsCompleted,
        workSeconds: state.workSeconds,
        breakSeconds: state.breakSeconds,
        remaining: state.workSeconds,
        workRemaining: state.workSeconds,
      };
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
        endTime: Date.now() + state.breakSeconds * 1000,
        remaining: state.breakSeconds,
        workRemaining: state.workSeconds,
        sessionsCompleted: state.sessionsCompleted + 1,
      };
    case 'END_BREAK':
    case 'SKIP_BREAK':
      return {
        ...state,
        phase: 'work',
        endTime: Date.now() + state.workSeconds * 1000,
        remaining: state.workSeconds,
        workRemaining: state.workSeconds,
      };
    case 'HYDRATE_SESSIONS':
      return { ...state, sessionsCompleted: action.n };
    case 'SET_INTERVALS':
      // Changing the rhythm resets the current cycle to idle.
      return {
        ...state,
        phase: 'idle',
        endTime: null,
        workSeconds: action.workSeconds,
        breakSeconds: action.breakSeconds,
        remaining: action.workSeconds,
        workRemaining: action.workSeconds,
      };
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
  workSeconds: number;
  breakSeconds: number;
};

function clampInterval(value: unknown, fallback: number, min: number, max: number): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(max, Math.max(min, Math.round(value)))
    : fallback;
}

function loadPrefs(): SavedPrefs {
  const defaults: SavedPrefs = {
    sessionsCompleted: 0,
    language: null,
    workSeconds: SESSION_SECONDS,
    breakSeconds: BREAK_SECONDS,
  };
  if (typeof window === 'undefined') return defaults;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaults;
    const parsed = JSON.parse(saved);
    return {
      sessionsCompleted: typeof parsed?.sessionsCompleted === 'number' ? parsed.sessionsCompleted : 0,
      language: typeof parsed?.language === 'string' ? (parsed.language as Language) : null,
      workSeconds: clampInterval(parsed?.workSeconds, SESSION_SECONDS, 5 * 60, 60 * 60),
      breakSeconds: clampInterval(parsed?.breakSeconds, BREAK_SECONDS, 10, 120),
    };
  } catch {
    return defaults;
  }
}

function savePrefs(prefs: {
  sessionsCompleted: number;
  language: Language;
  workSeconds: number;
  breakSeconds: number;
}) {
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
  const [showPro, setShowPro] = useState(false);
  const [pro, setPro] = useState(false);
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

  // Resolve `auto` to a concrete light/dark for the single-material palette.
  const [systemDark, setSystemDark] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setSystemDark(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Hydrate session prefs once (URL-provided language wins).
  useEffect(() => {
    const prefs = loadPrefs();
    if (!initialLanguage) setLanguage(detectLanguage(prefs.language));
    dispatch({ type: 'HYDRATE_SESSIONS', n: prefs.sessionsCompleted });
    const hasPro = isPro();
    setPro(hasPro);
    if (hasPro && (prefs.workSeconds !== SESSION_SECONDS || prefs.breakSeconds !== BREAK_SECONDS)) {
      dispatch({ type: 'SET_INTERVALS', workSeconds: prefs.workSeconds, breakSeconds: prefs.breakSeconds });
    }
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
    savePrefs({
      sessionsCompleted: state.sessionsCompleted,
      language,
      workSeconds: state.workSeconds,
      breakSeconds: state.breakSeconds,
    });
  }, [language, state.sessionsCompleted, state.workSeconds, state.breakSeconds, isLoaded]);

  // Set <html> dir + lang to match current language.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  // Single ticker — recomputes remaining from endTime, no drift.
  // Runs in a Web Worker so hidden-tab timer throttling can't delay the
  // chime/notification (main-thread intervals drop to ~1/min when hidden).
  useEffect(() => {
    if (state.endTime == null) return;
    const tick = () => dispatch({ type: 'TICK', now: Date.now() });
    tick();
    const ticker = startTicker(tick);
    return () => ticker.stop();
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
      void showBreakNotification({
        title: t.notification.title,
        body: t.notification.body,
      });
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
      if (!pro && next % DONATION_INTERVAL === 0 && next !== lastDonationShownAt.current) {
        setShowDonation(true);
        lastDonationShownAt.current = next;
      }
    } else if (state.phase === 'break') {
      chimeBreakEnd();
      dispatch({ type: 'END_BREAK' });
    }
  }, [state.phase, state.remaining, state.sessionsCompleted, t.notification, language, pro]);

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
      if (showWelcome || showLangPicker || showHelp || showDonation || showPro) return;
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
  }, [handleStartPause, handleReset, handleSkipBreak, state.phase, showWelcome, showLangPicker, showHelp, showDonation, showPro]);

  const cycleTheme = useCallback(() => {
    setTheme((x) => (x === 'auto' ? 'dark' : x === 'dark' ? 'light' : 'auto'));
  }, []);

  const handleSetIntervals = useCallback((workSeconds: number, breakSeconds: number) => {
    dispatch({ type: 'SET_INTERVALS', workSeconds, breakSeconds });
    setShowPro(false);
    track('intervals_change', { work: workSeconds, break: breakSeconds });
  }, []);

  // Derived UI flags.
  const isActive = state.endTime !== null && state.phase === 'work';
  const isPaused = state.phase === 'idle' && state.workRemaining < SESSION_SECONDS && state.workRemaining > 0;
  const showBreak = state.phase === 'break';
  const last60 = isActive && state.remaining <= 60;
  const resolvedDark = theme === 'dark' || (theme === 'auto' && systemDark);
  const dataTheme: 'light' | 'dark' = resolvedDark ? 'dark' : 'light';
  const vigil = resolvedDark;
  const workSecondsForProgress = state.phase === 'work' ? state.remaining : state.workRemaining;
  const progress = Math.min(1, Math.max(0, (state.workSeconds - workSecondsForProgress) / state.workSeconds));
  const localTime = `${String(Math.floor(hour)).padStart(2, '0')}:${String(Math.floor((hour % 1) * 60)).padStart(2, '0')}`;
  const hourLabel = hourLabelFor(hour);
  const hourWord =
    (translations[language] as unknown as { hourWords?: Record<string, string> })?.hourWords?.[hourLabel] ??
    HOURS_KEYS.hourWords[hourLabel] ??
    hourLabel;

  return (
    <MotionConfig reducedMotion="user">
    <div
      className="shadow-console"
      data-theme={dataTheme}
      dir={dir}
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        containerType: 'inline-size',
        transition: 'background-color .4s ease, color .4s ease',
      }}
    >
      {/* Masthead — flat on the shared material, controls raised */}
      <header className="flex items-center justify-between px-5 pt-5 pb-3" style={{ gap: 12 }}>
        <div className="flex items-baseline gap-3 min-w-0 flex-1">
          <span style={{
            fontFamily: F_UI, fontSize: '.8125rem', fontWeight: 500, letterSpacing: '.2em',
            textTransform: 'uppercase', whiteSpace: 'nowrap', color: 'var(--ink)',
          }}>
            {vigil ? '☾ ' : ''}EYE&nbsp;CARE
          </span>
          <span style={{
            fontFamily: F_UI, fontSize: '.8rem', color: 'var(--ink-soft)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{hourWord}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setShowHelp(true)}
            aria-label={tKey(language, 'helpLabel')}
            className="neu neu-btn"
            style={ICON_BTN}
          >
            ?
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={toggleMuted}
            aria-label={muted ? tKey(language, 'soundOff') : tKey(language, 'soundOn')}
            className="neu neu-btn"
            style={ICON_BTN}
          >
            <SoundGlyph muted={muted} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setShowLangPicker(true)}
            aria-label="Language"
            className="neu neu-btn"
            style={{ ...ICON_BTN, fontSize: '.6875rem', letterSpacing: '.06em' }}
          >
            {language.toUpperCase()}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={cycleTheme}
            aria-label={`Theme: ${theme}`}
            className="neu neu-btn"
            style={ICON_BTN}
          >
            <ThemeGlyph theme={theme} />
          </motion.button>
        </div>
      </header>

      {/* Recessed progress groove — accent fill glows in the channel */}
      <div style={{ padding: '10px 20px 4px' }}>
        <div
          className="neu-pressed"
          style={{
            height: 12, borderRadius: 999, padding: 2, overflow: 'hidden',
            '--offset': '2px', '--blur': '4px',
          } as React.CSSProperties}
        >
          <motion.div
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.9, ease: 'linear' }}
            style={{
              height: '100%', borderRadius: 999,
              background: 'linear-gradient(90deg, var(--accent-2), var(--accent))',
              boxShadow: last60
                ? '0 0 12px color-mix(in srgb, var(--accent) 80%, transparent)'
                : '0 0 6px color-mix(in srgb, var(--accent) 45%, transparent)',
            }}
          />
        </div>
      </div>

      {/* Centerpiece */}
      <main className="flex-1 grid place-items-center px-6 py-6" style={{ gridTemplateRows: '1fr auto 1fr' }}>
        <div />
        <div className="text-center" style={{ maxWidth: 760 }}>
          <div style={{
            fontFamily: F_UI, fontSize: '.6875rem', fontWeight: 500,
            letterSpacing: '.18em', textTransform: 'uppercase',
            color: 'var(--ink-soft)', marginBottom: 20,
          }}>
            {t.title} · {roman(state.sessionsCompleted + 1)} ·{' '}
            <span style={{ fontFamily: F_MONO, letterSpacing: '.04em' }}>{localTime}</span>
          </div>

          {/* Instrument readout, recessed into the panel */}
          <div
            className="neu-pressed"
            style={{
              display: 'inline-block',
              borderRadius: 'var(--r-card)',
              padding: 'clamp(20px, 6cqw, 44px) clamp(28px, 9cqw, 72px)',
            }}
          >
            <div
              aria-live="polite"
              style={{
                fontFamily: F_MONO, fontWeight: 400,
                fontSize: 'clamp(3.5rem, 26cqw, 11rem)', lineHeight: 1,
                letterSpacing: '-0.01em',
                color: last60 ? 'var(--accent)' : 'var(--ink)',
                fontVariantNumeric: 'tabular-nums',
                transition: 'color .3s ease',
                textShadow: last60
                  ? '0 0 28px color-mix(in srgb, var(--accent) 45%, transparent)'
                  : 'none',
              }}
            >
              {formatTime(state.remaining)}
            </div>
          </div>

          <div style={{
            fontFamily: F_UI, fontSize: '1rem', color: 'var(--ink-soft)',
            marginTop: 22, lineHeight: lh,
          }}>
            {!isActive && !isPaused && t.subtitle}
            {isActive && (last60 ? '—' : (t.tracking?.toLowerCase?.() ?? t.tracking))}
            {isPaused && (t.paused?.toLowerCase?.() ?? t.paused)}
          </div>
        </div>

        <div className="self-start mt-10 flex flex-col items-center gap-5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleStartPause}
            className="neu-primary"
            style={{
              fontFamily: F_UI, fontSize: '.8rem', fontWeight: 500,
              letterSpacing: '.16em', textTransform: 'uppercase',
              padding: '17px 44px', borderRadius: 'var(--r-ctrl)',
              minHeight: 54, minWidth: 176,
            }}
          >
            {isActive ? t.pause : t.start}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleReset}
            className="neu neu-btn"
            style={{
              fontFamily: F_UI, fontSize: '.6875rem', fontWeight: 500,
              letterSpacing: '.14em', textTransform: 'uppercase',
              color: 'var(--ink-soft)', padding: '11px 26px', borderRadius: 'var(--r-ctrl)',
              '--offset': '4px', '--blur': '9px',
            } as React.CSSProperties}
          >
            {t.reset}
          </motion.button>

          {/* Tappable rhythm — discoverable entry to custom intervals (Pro). */}
          {(pro || PRO_PAYMENT_LINK) && !isActive && (
            <button
              onClick={() => {
                if (!pro) track('pro_modal_shown', { from: 'rhythm_chip', language });
                setShowPro(true);
              }}
              className="neu-pressed"
              style={{
                marginTop: 2, background: 'var(--bg)', border: 0, cursor: 'pointer',
                borderRadius: 999, padding: '9px 18px',
                fontFamily: F_UI, fontSize: '.8rem', color: 'var(--ink-soft)',
                '--offset': '2px', '--blur': '5px',
              } as React.CSSProperties}
            >
              <span style={{ fontFamily: F_MONO }}>{Math.round(state.workSeconds / 60)}</span>{' '}
              {tKey(language, 'rhythmMinShort')} ·{' '}
              <span style={{ fontFamily: F_MONO }}>{state.breakSeconds}</span>{' '}
              {tKey(language, 'rhythmSecShort')}
              <span style={{ color: 'var(--accent)', marginInlineStart: 10, fontWeight: 500 }}>
                {pro ? tKey(language, 'rhythmAdjust') : tKey(language, 'rhythmCustomize')}
              </span>
            </button>
          )}

          <AnimatePresence>
            {showAmbientHint && !isActive && !showBreak && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  marginTop: 8,
                  maxWidth: 340,
                  fontFamily: F_UI,
                  fontSize: '.85rem', color: 'var(--ink-soft)',
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
      <footer style={{ padding: '12px 20px 16px' }} className="flex flex-col gap-3">
        <div className="flex justify-between items-center" style={{ gap: 12, flexWrap: 'wrap' }}>
          <div style={{
            fontFamily: F_UI, fontSize: '.6875rem', fontWeight: 500,
            letterSpacing: '.12em', textTransform: 'uppercase',
            color: 'var(--ink-soft)',
          }}>
            <span style={{ fontFamily: F_MONO, letterSpacing: '.04em', textTransform: 'none' }}>
              {roman(state.sessionsCompleted)}
            </span>
            <span style={{ margin: '0 .5em', opacity: 0.5 }}>·</span>
            {t.totalSessions?.toLowerCase?.() ?? t.totalSessions}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {(pro || PRO_PAYMENT_LINK) && (
              <button
                onClick={() => setShowPro(true)}
                style={{ ...footerLinkStyle, color: 'var(--accent)' }}
              >
                {pro
                  ? <><span style={{ fontFamily: F_MONO }}>{Math.round(state.workSeconds / 60)}m · {state.breakSeconds}s</span></>
                  : 'Pro · $5'}
              </button>
            )}
            <button onClick={() => setShowHelp(true)} style={footerLinkStyle}>Help</button>
            <Link href="/about" style={footerLinkStyle}>About</Link>
            <Link href="/stats" style={footerLinkStyle}>Stats</Link>
            <Link href="/learn" style={footerLinkStyle}>Learn</Link>
            <Link href="/privacy" style={footerLinkStyle}>Privacy</Link>
            <Link href="/terms" style={footerLinkStyle}>Terms</Link>
            <a href="/eye-care.ics" download style={footerLinkStyle}>.ics</a>
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
          fontFamily: F_UI, fontSize: '.6rem', fontWeight: 500,
          letterSpacing: '.12em', textTransform: 'uppercase',
          color: 'var(--ink-soft)', opacity: 0.7, textAlign: 'center',
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
            breakSeconds={state.breakSeconds}
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

      {/* Pro modal — purchase pitch or rhythm settings */}
      <AnimatePresence>
        {showPro && (
          <ProModal
            language={language}
            pro={pro}
            workSeconds={state.workSeconds}
            breakSeconds={state.breakSeconds}
            onApply={handleSetIntervals}
            onClose={() => setShowPro(false)}
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
            className="neu"
            style={{
              position: 'fixed',
              bottom: 'max(20px, env(safe-area-inset-bottom))',
              insetInlineStart: 20,
              zIndex: 45,
              background: 'var(--bg)',
              borderRadius: 'var(--r-ctrl)',
              padding: '12px 18px',
              fontFamily: F_UI,
              fontSize: '.85rem',
              color: 'var(--ink)',
              maxWidth: 'calc(100vw - 40px)',
              '--offset': '4px', '--blur': '10px',
            } as React.CSSProperties}
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

const footerLinkStyle: React.CSSProperties = {
  fontFamily: F_UI,
  fontSize: '.6875rem', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase',
  color: 'var(--ink-soft)', textDecoration: 'none',
  background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
};

// Shared round icon-button footprint — a small raised control on the material.
const ICON_BTN: React.CSSProperties = {
  width: 42, height: 42, borderRadius: '50%',
  display: 'grid', placeItems: 'center',
  color: 'var(--ink-soft)', fontFamily: F_MONO, fontSize: '.75rem',
  '--offset': '3px', '--blur': '6px',
} as React.CSSProperties;

// ─── Break overlay ────────────────────────────────────────────────────────

function BreakOverlay({
  language, breakRemaining, breakSeconds, vigil, onSkip,
}: {
  language: Language;
  breakRemaining: number;
  breakSeconds: number;
  vigil: boolean;
  onSkip: () => void;
}) {
  const t = translations[language];
  const elapsed = breakSeconds - breakRemaining;
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
      className="shadow-console"
      data-theme={vigil ? 'dark' : 'light'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="dialog"
      aria-label={t.restYourEyes}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'var(--bg)', color: 'var(--ink)',
        display: 'flex', flexDirection: 'column',
        containerType: 'inline-size',
      }}
    >
      <div
        className="px-5 py-4 flex justify-between items-center"
        style={{
          fontFamily: F_UI,
          fontSize: '.75rem', fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase',
          color: 'var(--ink-soft)',
        }}
      >
        <span style={{ color: 'var(--ink)' }}>{vigil ? '☾ ' : ''}EYE&nbsp;CARE</span>
        <span style={{ letterSpacing: '.06em', textTransform: 'none' }}>
          {t.restYourEyes?.toLowerCase?.() ?? t.restYourEyes}
        </span>
      </div>

      <div className="flex-1 grid place-items-center relative">
        {/* Breathing disc — a raised convex form on the material */}
        <motion.div
          aria-hidden
          className="neu"
          animate={{ scale }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'absolute',
            width: 'min(46vh, 360px)', height: 'min(46vh, 360px)',
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, color-mix(in srgb, var(--accent) 12%, var(--bg)), var(--bg))',
            '--offset': '12px', '--blur': '28px',
          } as React.CSSProperties}
        />
        {/* Recessed inner ring — the still eye at the center of the breath */}
        <div
          aria-hidden
          className="neu-pressed"
          style={{
            position: 'absolute',
            width: 'min(30vh, 232px)', height: 'min(30vh, 232px)',
            borderRadius: '50%',
            '--offset': '6px', '--blur': '14px',
          } as React.CSSProperties}
        />

        <div className="text-center relative">
          <div style={{
            fontFamily: F_MONO, fontWeight: 400,
            fontSize: 'clamp(3rem, 20cqw, 7rem)', lineHeight: 1,
            letterSpacing: '-0.01em', color: 'var(--ink)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {String(breakRemaining).padStart(2, '0')}
          </div>
          <motion.div
            key={phaseText}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: F_UI,
              fontSize: '1.05rem', color: 'var(--ink)', marginTop: 14, lineHeight: lh,
            }}
          >
            {phaseText}
          </motion.div>
          <div style={{
            fontFamily: F_UI,
            fontSize: '.625rem', fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase',
            color: 'var(--ink-soft)', marginTop: 18,
          }}>
            {t.lookAway}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="flex justify-center mb-4">
          <button
            onClick={onSkip}
            disabled={elapsed < 3}
            className={elapsed < 3 ? '' : 'neu neu-btn'}
            style={{
              fontFamily: F_UI, fontSize: '.6875rem', fontWeight: 500,
              letterSpacing: '.14em', textTransform: 'uppercase',
              color: 'var(--ink-soft)', background: 'var(--bg)',
              border: 0, padding: '11px 24px', borderRadius: 'var(--r-ctrl)',
              cursor: elapsed < 3 ? 'not-allowed' : 'pointer',
              opacity: elapsed < 3 ? 0.4 : 1,
              boxShadow: elapsed < 3 ? 'none' : undefined,
              ['--offset' as string]: '4px', ['--blur' as string]: '9px',
            } as React.CSSProperties}
          >
            {t.skipBreak?.toLowerCase?.() ?? t.skipBreak}
          </button>
        </div>
        {BREAK_AD_SLOT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: adVisible ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="neu-pressed"
            style={{
              paddingTop: 14, textAlign: 'center', borderRadius: 'var(--r-card)',
              padding: '16px 14px',
              '--offset': '3px', '--blur': '8px',
            } as React.CSSProperties}
          >
            <div style={{
              fontFamily: F_UI,
              fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase',
              color: 'var(--ink-soft)', marginBottom: 10,
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

// ─── Pro modal ────────────────────────────────────────────────────────────

function ProModal({
  language, pro, workSeconds, breakSeconds, onApply, onClose,
}: {
  language: Language;
  pro: boolean;
  workSeconds: number;
  breakSeconds: number;
  onApply: (workSeconds: number, breakSeconds: number) => void;
  onClose: () => void;
}) {
  const [selWork, setSelWork] = useState(workSeconds);
  const [selBreak, setSelBreak] = useState(breakSeconds);
  const dirty = selWork !== workSeconds || selBreak !== breakSeconds;

  const presetBtn = (active: boolean, children: React.ReactNode, onClick: () => void, key: React.Key) => (
    <motion.button
      key={key}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={active ? 'neu-pressed' : 'neu neu-btn'}
      style={{
        fontFamily: F_MONO, fontSize: '.8rem',
        padding: '11px 0', flex: 1, cursor: 'pointer', border: 0,
        borderRadius: 'var(--r-sm)', background: 'var(--bg)',
        color: active ? 'var(--accent)' : 'var(--ink)',
        fontWeight: active ? 700 : 400,
        '--offset': '3px', '--blur': '7px',
      } as React.CSSProperties}
    >
      {children}
    </motion.button>
  );

  const laterBtn = (
    <button
      onClick={onClose}
      style={{
        fontFamily: F_UI, fontSize: '.6875rem', fontWeight: 500,
        letterSpacing: '.12em', textTransform: 'uppercase',
        color: 'var(--ink-soft)', background: 'transparent', border: 0,
        padding: 12, cursor: 'pointer',
      }}
    >
      {tKey(language, 'later')}
    </button>
  );

  const sectionLabel = (text: string, extra?: React.CSSProperties): React.ReactElement => (
    <div style={{
      fontFamily: F_UI, fontSize: '.7rem', fontWeight: 500,
      letterSpacing: '.12em', textTransform: 'uppercase',
      color: 'var(--ink-soft)', marginBottom: 10, ...extra,
    }}>
      {text}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 70, display: 'grid', placeItems: 'center',
        background: 'color-mix(in srgb, var(--bg) 72%, transparent)',
        backdropFilter: 'blur(2px)', padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="neu"
        style={{
          background: 'var(--bg)', borderRadius: 'var(--r-card)',
          padding: '32px 28px', maxWidth: 420, width: '100%',
          '--offset': '10px', '--blur': '26px',
        } as React.CSSProperties}
      >
        <div style={{
          fontFamily: F_UI, fontSize: '.7rem', fontWeight: 500,
          letterSpacing: '.16em', textTransform: 'uppercase',
          color: 'var(--accent)', marginBottom: 16,
        }}>
          {pro ? tKey(language, 'rhythm') : tKey(language, 'proTitle')}
          {!pro && (
            <span style={{ marginInlineStart: 8, color: 'var(--ink-soft)' }}>
              · {tKey(language, 'proPrice')}
            </span>
          )}
        </div>

        {/* Free users get the same pickers — they can taste the feature
            before the paywall. The selection becomes the pitch. */}
        {!pro && (
          <div style={{
            fontFamily: F_UI,
            fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.45, marginBottom: 20,
          }}>
            {tKey(language, 'proLockedHint')}
          </div>
        )}

        {sectionLabel(tKey(language, 'rhythmWork'))}
        <div className="flex gap-3">
          {WORK_PRESETS.map((w) => presetBtn(selWork === w, w / 60, () => setSelWork(w), w))}
        </div>
        {sectionLabel(tKey(language, 'rhythmBreak'), { margin: '20px 0 10px' })}
        <div className="flex gap-3">
          {BREAK_PRESETS.map((b) => presetBtn(selBreak === b, b, () => setSelBreak(b), b))}
        </div>

        {pro && (
          <>
            <div style={{
              fontFamily: F_UI,
              fontSize: '.82rem', color: 'var(--ink-soft)', marginTop: 18, lineHeight: 1.5,
            }}>
              {tKey(language, 'rhythmNote')}
            </div>
            <div className="flex gap-3 mt-6 items-center">
              <motion.button
                whileTap={{ scale: dirty ? 0.97 : 1 }}
                onClick={() => onApply(selWork, selBreak)}
                disabled={!dirty}
                className={dirty ? 'neu-primary' : 'neu-pressed'}
                style={{
                  fontFamily: F_UI, fontSize: '.7rem', fontWeight: 500,
                  letterSpacing: '.14em', textTransform: 'uppercase',
                  color: dirty ? '#fff' : 'var(--ink-soft)',
                  background: dirty ? undefined : 'var(--bg)',
                  border: 0, borderRadius: 'var(--r-ctrl)',
                  padding: '13px 26px', cursor: dirty ? 'pointer' : 'not-allowed',
                  '--offset': '3px', '--blur': '7px',
                } as React.CSSProperties}
              >
                {tKey(language, 'rhythmApply')}
              </motion.button>
              {laterBtn}
            </div>
          </>
        )}

        {!pro && (
          <>
            {/* What you actually get, listed concretely. */}
            <ul style={{
              listStyle: 'none', margin: '24px 0 0', padding: 0,
              fontFamily: F_UI,
              fontSize: '.95rem', color: 'var(--ink)', lineHeight: 1.7,
            }}>
              {(['proBenefitRhythm', 'proBenefitAds', 'proBenefitForever'] as const).map((k) => (
                <li key={k} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ color: 'var(--accent)' }}>—</span>
                  {tKey(language, k)}
                </li>
              ))}
            </ul>
            <div className="flex gap-3 mt-6 items-center">
              <motion.a
                whileTap={{ scale: 0.97 }}
                href={PRO_PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('pro_unlock_clicked', { language })}
                className="neu-primary"
                style={{
                  fontFamily: F_UI, fontSize: '.7rem', fontWeight: 500,
                  letterSpacing: '.14em', textTransform: 'uppercase',
                  color: '#fff', borderRadius: 'var(--r-ctrl)',
                  padding: '14px 28px', textDecoration: 'none',
                  '--offset': '5px', '--blur': '12px',
                } as React.CSSProperties}
              >
                {tKey(language, 'proUnlockPrice')}
              </motion.a>
              {laterBtn}
            </div>
            <div style={{
              fontFamily: F_UI,
              fontSize: '.78rem', color: 'var(--ink-soft)', marginTop: 18, lineHeight: 1.5,
            }}>
              {tKey(language, 'proAlready')}
            </div>
          </>
        )}
      </motion.div>
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
        background: 'color-mix(in srgb, var(--bg) 78%, transparent)',
        backdropFilter: 'blur(2px)',
        display: 'grid', placeItems: 'center', padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="neu"
        style={{
          background: 'var(--bg)', borderRadius: 'var(--r-card)',
          padding: '24px 12px', minWidth: 280, maxWidth: 360, width: '100%',
          '--offset': '10px', '--blur': '26px',
        } as React.CSSProperties}
      >
        <div style={{
          fontFamily: F_UI, fontSize: '.7rem', fontWeight: 500,
          letterSpacing: '.16em', textTransform: 'uppercase',
          color: 'var(--ink-soft)', textAlign: 'center', marginBottom: 16,
        }}>
          Language
        </div>
        {SUPPORTED_LANGS.map((code) => {
          const active = code === current;
          return (
            <button
              key={code}
              onClick={() => onPick(code as Language)}
              className={active ? 'neu-pressed' : ''}
              style={{
                display: 'block', width: '100%', textAlign: 'start',
                background: 'var(--bg)', border: 0,
                padding: '12px 16px', margin: '2px 0', cursor: 'pointer',
                borderRadius: 'var(--r-ctrl)',
                fontFamily: F_UI, fontSize: '1rem',
                fontWeight: active ? 500 : 400,
                color: active ? 'var(--accent)' : 'var(--ink)',
                ['--offset' as string]: '3px', ['--blur' as string]: '7px',
              } as React.CSSProperties}
            >
              {LANG_NATIVE[code]}
            </button>
          );
        })}
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
        background: 'color-mix(in srgb, var(--bg) 72%, transparent)',
        backdropFilter: 'blur(2px)', padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="neu"
        style={{
          background: 'var(--bg)', borderRadius: 'var(--r-card)',
          padding: '36px 32px', maxWidth: 420, textAlign: 'center',
          '--offset': '10px', '--blur': '26px',
        } as React.CSSProperties}
      >
        <div style={{
          fontFamily: F_UI, fontSize: '.7rem', fontWeight: 500,
          letterSpacing: '.12em', textTransform: 'uppercase',
          color: 'var(--ink-soft)', marginBottom: 16,
        }}>
          <span style={{ fontFamily: F_MONO, letterSpacing: '.04em', textTransform: 'none' }}>
            {roman(sessionsCompleted)}
          </span>{' '}
          · {t.totalSessions?.toLowerCase?.() ?? t.totalSessions}
        </div>
        <div style={{
          fontFamily: F_UI, fontSize: '1.35rem', lineHeight: 1.4,
          color: 'var(--ink)', textWrap: 'balance' as never,
        }}>
          {ask}
        </div>
        <div className="flex gap-3 justify-center mt-8 items-center">
          <motion.a
            whileTap={{ scale: 0.97 }}
            href="https://buymeacoffee.com/shokawamoto"
            target="_blank"
            rel="noopener noreferrer"
            className="neu-primary"
            style={{
              fontFamily: F_UI, fontSize: '.7rem', fontWeight: 500,
              letterSpacing: '.14em', textTransform: 'uppercase',
              color: '#fff', borderRadius: 'var(--r-ctrl)',
              padding: '13px 26px', textDecoration: 'none',
              ['--offset' as string]: '5px', ['--blur' as string]: '12px',
            } as React.CSSProperties}
          >
            {t.supportWithCoffee}
          </motion.a>
          <button
            onClick={onClose}
            style={{
              fontFamily: F_UI, fontSize: '.6875rem', fontWeight: 500,
              letterSpacing: '.12em', textTransform: 'uppercase',
              color: 'var(--ink-soft)', background: 'transparent', border: 0, padding: 12,
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
