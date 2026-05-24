'use client';

// StatsClient — personal session history + streak dashboard.
// Reads daily session counts from localStorage (written by EyeCareGlobal).
// Pure client component — no server, no analytics, just your own data.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadStreak } from '@/lib/streak';

const HISTORY_KEY = 'eyeCareDailyHistory';

type DailyEntry = { date: string; count: number };

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dayKey(offsetDays: number) {
  const d = new Date(Date.now() - offsetDays * 86_400_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadHistory(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export default function StatsClient() {
  const [history, setHistory] = useState<Record<string, number>>({});
  const [streak, setStreak] = useState({ streak: 0, lastDate: '' });
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    setHistory(loadHistory());
    setStreak(loadStreak());
    try {
      const prefs = window.localStorage.getItem('eyeCarePreferences');
      if (prefs) {
        const parsed = JSON.parse(prefs);
        if (typeof parsed?.sessionsCompleted === 'number') {
          setTotalSessions(parsed.sessionsCompleted);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Build last 30 days for chart, last 365 for heatmap-ish summary
  const last30: DailyEntry[] = [];
  for (let i = 29; i >= 0; i--) {
    const k = dayKey(i);
    last30.push({ date: k, count: history[k] ?? 0 });
  }
  const max30 = Math.max(1, ...last30.map((d) => d.count));

  const last7 = last30.slice(-7);
  const week7Total = last7.reduce((s, d) => s + d.count, 0);
  const week7Avg = week7Total / 7;

  // Heatmap last 365
  const last365: DailyEntry[] = [];
  for (let i = 364; i >= 0; i--) {
    const k = dayKey(i);
    last365.push({ date: k, count: history[k] ?? 0 });
  }
  const activeDays365 = last365.filter((d) => d.count > 0).length;

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#f5f1ea',
        color: '#1c1b18',
        fontFamily: 'var(--font-geist-sans, "Geist Sans", ui-sans-serif, system-ui, sans-serif)',
      }}
    >
      <header
        style={{
          borderBottom: '1px solid rgba(28,27,24,.14)',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/en" style={chromeLink}>EYE&nbsp;CARE</Link>
        <Link href="/en" style={chromeLinkSerif}>Open timer →</Link>
      </header>

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 96px' }}>
        <div style={eyebrowStyle}>Your stats · stored locally</div>
        <h1 style={h1Style}>How your eyes have been doing.</h1>
        <p style={leadStyle}>
          Everything below comes from your browser&rsquo;s localStorage. Nothing is sent to a
          server. If you clear your browser data, this resets.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 40 }}>
          <StatCard label="Current streak" value={`${streak.streak} d`} sub={streak.streak >= 7 ? 'on a roll' : 'building it'} />
          <StatCard label="7-day total" value={String(week7Total)} sub={`${week7Avg.toFixed(1)} avg`} />
          <StatCard label="All-time" value={String(totalSessions)} sub="sessions" />
        </div>

        <Section heading="Last 30 days">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(30, 1fr)',
              gap: 4,
              alignItems: 'end',
              height: 140,
              marginTop: 12,
            }}
          >
            {last30.map((d) => {
              const h = d.count === 0 ? 4 : Math.max(6, Math.round((d.count / max30) * 130));
              const op = d.count === 0 ? 0.25 : 0.45 + (d.count / max30) * 0.55;
              return (
                <div
                  key={d.date}
                  title={`${d.date}: ${d.count}`}
                  style={{
                    height: h,
                    background: '#c47d56',
                    opacity: op,
                    borderRadius: 2,
                  }}
                />
              );
            })}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
              fontSize: '.625rem',
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              color: '#7a7568',
              marginTop: 8,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>30 days ago</span>
            <span>today</span>
          </div>
        </Section>

        <Section heading="Last year — at a glance">
          <p style={pStyle}>
            <strong>{activeDays365}</strong> active days out of the last 365. That works out to{' '}
            roughly <strong>{((activeDays365 / 365) * 100).toFixed(0)}%</strong> consistency.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(53, 1fr)',
              gap: 2,
              marginTop: 16,
            }}
          >
            {last365.map((d) => {
              const op = d.count === 0 ? 0.12 : 0.35 + Math.min(1, d.count / 10) * 0.6;
              return (
                <div
                  key={d.date}
                  title={`${d.date}: ${d.count}`}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    background: '#c47d56',
                    opacity: op,
                    borderRadius: 1.5,
                  }}
                />
              );
            })}
          </div>
        </Section>

        <Section heading="What counts as a session?">
          <p style={pStyle}>
            One completed 20-minute work cycle followed by the 20-second break. Skipping the
            break still counts the cycle. Resetting the timer mid-cycle does not.
          </p>
        </Section>

        <Section heading="Privacy">
          <p style={pStyle}>
            All numbers shown here are read from your browser&rsquo;s localStorage and never
            leave your device. Open your browser dev tools and search Application →
            localStorage → eyecare.love for the raw keys (<code>eyeCarePreferences</code>,{' '}
            <code>eyeCareStreak</code>, <code>eyeCareDailyHistory</code>).
          </p>
        </Section>

        <aside style={ctaStyle}>
          <div style={ctaEyebrowStyle}>EYE CARE</div>
          <div style={ctaTitleStyle}>Add to today&rsquo;s count →</div>
          <div style={{ marginTop: 18 }}>
            <Link href="/en" style={ctaButtonStyle}>Open the timer</Link>
          </div>
        </aside>
      </article>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div
      style={{
        background: '#fbf8f2',
        border: '1px solid rgba(28,27,24,.14)',
        padding: '20px 16px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
          fontSize: '.625rem',
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          color: '#7a7568',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
          fontStyle: 'italic',
          fontSize: '2.4rem',
          color: '#1c1b18',
          marginTop: 8,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
          fontStyle: 'italic',
          fontSize: '.85rem',
          color: '#7a7568',
          marginTop: 4,
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 40 }}>
      <h2 style={h2Style}>{heading}</h2>
      {children}
    </section>
  );
}

const chromeLink: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
  fontSize: '.6875rem', fontWeight: 500, letterSpacing: '.16em',
  textTransform: 'uppercase', color: '#1c1b18', textDecoration: 'none',
};
const chromeLinkSerif: React.CSSProperties = {
  fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
  fontStyle: 'italic', fontSize: '.95rem', color: '#1c1b18',
  textDecoration: 'none', borderBottom: '1px dotted rgba(28,27,24,.18)', paddingBottom: 1,
};
const eyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
  fontSize: '.625rem', letterSpacing: '.12em', textTransform: 'uppercase',
  color: '#7a7568', marginBottom: 18,
};
const h1Style: React.CSSProperties = {
  fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
  fontStyle: 'italic', fontWeight: 400,
  fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)', lineHeight: 1.05,
  letterSpacing: '-0.015em', margin: 0, color: '#1c1b18',
};
const h2Style: React.CSSProperties = {
  fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
  fontStyle: 'italic', fontWeight: 400, fontSize: '1.5rem',
  margin: '0 0 14px', color: '#1c1b18',
};
const leadStyle: React.CSSProperties = {
  fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
  fontStyle: 'italic', fontSize: '1.15rem', color: '#5a564a',
  marginTop: 22, lineHeight: 1.6,
};
const pStyle: React.CSSProperties = {
  fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
  fontSize: '1.0625rem', color: '#3a352d', lineHeight: 1.7, margin: '0 0 1em',
};
const ctaStyle: React.CSSProperties = {
  marginTop: 56, padding: '32px 28px',
  border: '1px solid rgba(28,27,24,.14)', background: '#fbf8f2',
};
const ctaEyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
  fontSize: '.6875rem', letterSpacing: '.16em', textTransform: 'uppercase',
  color: '#c47d56', marginBottom: 6,
};
const ctaTitleStyle: React.CSSProperties = {
  fontFamily: 'ui-serif, Charter, "Iowan Old Style", Georgia, serif',
  fontStyle: 'italic', fontSize: '1.4rem', color: '#1c1b18',
};
const ctaButtonStyle: React.CSSProperties = {
  display: 'inline-block',
  fontFamily: 'var(--font-geist-mono, "Geist Mono", ui-monospace, monospace)',
  fontSize: '.75rem', letterSpacing: '.16em', textTransform: 'uppercase',
  background: '#1c1b18', color: '#f5f1ea', padding: '12px 22px',
  textDecoration: 'none', minHeight: 44,
};
