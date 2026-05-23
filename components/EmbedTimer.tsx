'use client';

// EmbedTimer — minimal iframe-friendly timer.
// No PWA install prompt, no welcome modal, no language picker, no help modal,
// no analytics scripts. Pure timer + small attribution badge. Designed to be
// embedded on third-party sites via the /embed.js loader.

import { useEffect, useReducer, useRef, useState, useCallback } from 'react';
import { translations, type Language } from '@/lib/translations';
import {
  effectivePalette, paletteVars,
  isRTL as hoursIsRTL, langLineHeight, FONT_SERIF,
} from '@/lib/hours';
import { unlockAudio, chimeBreakStart, chimeBreakEnd, chimeWarning } from '@/lib/audio';

const SESSION_SECONDS = 20 * 60;
const BREAK_SECONDS = 20;

type Phase = 'idle' | 'work' | 'break';

type State = {
  phase: Phase;
  endTime: number | null;
  remaining: number;
  workRemaining: number;
  sessionsCompleted: number;
};

const initial: State = {
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
  | { type: 'END_BREAK' };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'START': {
      const rem = s.workRemaining > 0 ? s.workRemaining : SESSION_SECONDS;
      return { ...s, phase: 'work', endTime: Date.now() + rem * 1000, remaining: rem, workRemaining: rem };
    }
    case 'PAUSE':
      return { ...s, phase: 'idle', endTime: null, workRemaining: s.remaining };
    case 'RESET':
      return { ...initial, sessionsCompleted: s.sessionsCompleted };
    case 'TICK': {
      if (s.endTime == null) return s;
      const rem = Math.max(0, Math.ceil((s.endTime - a.now) / 1000));
      if (rem === s.remaining) return s;
      return { ...s, remaining: rem };
    }
    case 'START_BREAK':
      return {
        ...s,
        phase: 'break',
        endTime: Date.now() + BREAK_SECONDS * 1000,
        remaining: BREAK_SECONDS,
        workRemaining: SESSION_SECONDS,
        sessionsCompleted: s.sessionsCompleted + 1,
      };
    case 'END_BREAK':
      return {
        ...s,
        phase: 'work',
        endTime: Date.now() + SESSION_SECONDS * 1000,
        remaining: SESSION_SECONDS,
        workRemaining: SESSION_SECONDS,
      };
    default:
      return s;
  }
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function EmbedTimer({ lang }: { lang: Language }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const t = translations[lang];
  const dir: 'ltr' | 'rtl' = hoursIsRTL(lang) ? 'rtl' : 'ltr';
  const lh = langLineHeight(lang);
  const warnedAt5sRef = useRef(false);

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

  const palette = effectivePalette(hour, 'auto');

  useEffect(() => {
    if (state.endTime == null) return;
    const tick = () => dispatch({ type: 'TICK', now: Date.now() });
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [state.endTime]);

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

  useEffect(() => {
    if (state.remaining !== 0) return;
    if (state.phase === 'work') {
      chimeBreakStart();
      dispatch({ type: 'START_BREAK' });
    } else if (state.phase === 'break') {
      chimeBreakEnd();
      dispatch({ type: 'END_BREAK' });
    }
  }, [state.phase, state.remaining]);

  const handleStartPause = useCallback(() => {
    if (state.phase === 'idle') {
      void unlockAudio();
      dispatch({ type: 'START' });
    } else {
      dispatch({ type: 'PAUSE' });
    }
  }, [state.phase]);

  const isActive = state.endTime !== null && state.phase === 'work';
  const showBreak = state.phase === 'break';
  const last60 = isActive && state.remaining <= 60;
  const progress =
    state.phase === 'work'
      ? Math.min(1, (SESSION_SECONDS - state.remaining) / SESSION_SECONDS)
      : 0;

  return (
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
      }}
    >
      <div style={{ height: 1, background: 'var(--c-rule)', position: 'relative' }}>
        <div
          style={{
            position: 'absolute', insetInlineStart: 0, top: -0.5, height: 2,
            background: last60 ? 'var(--c-warn)' : 'var(--c-primary)',
            width: `${progress * 100}%`,
            transition: 'width 800ms linear',
          }}
        />
      </div>

      <main className="flex-1" style={{ display: 'grid', placeItems: 'center', padding: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: FONT_SERIF, fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(3rem, 22vw, 8rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'lining-nums tabular-nums',
              color: showBreak ? 'var(--c-primary)' : 'var(--c-ink)',
            }}
          >
            {showBreak ? String(state.remaining).padStart(2, '0') : formatTime(state.remaining)}
          </div>
          <div
            style={{
              fontFamily: FONT_SERIF, fontStyle: 'italic',
              fontSize: '.95rem', color: 'var(--c-mute)',
              marginTop: 8, lineHeight: lh,
            }}
          >
            {showBreak ? t.restYourEyes : isActive ? t.tracking.toLowerCase() : t.subtitle}
          </div>

          <button
            onClick={handleStartPause}
            style={{
              marginTop: 18,
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: '.6875rem', letterSpacing: '.16em', textTransform: 'uppercase',
              border: '1px solid var(--c-ink)', color: 'var(--c-ink)',
              background: 'transparent', padding: '10px 18px',
              minHeight: 40, cursor: 'pointer',
            }}
          >
            {isActive ? t.pause : t.start}
          </button>
        </div>
      </main>

      <a
        href={`https://eyecare.love/${lang}?utm_source=embed`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textAlign: 'center',
          padding: '8px 12px',
          borderTop: '1px solid var(--c-rule)',
          fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
          fontSize: '.6rem', letterSpacing: '.12em', textTransform: 'uppercase',
          color: 'var(--c-mute)', textDecoration: 'none',
        }}
      >
        Powered by eyecare.love →
      </a>
    </div>
  );
}
