// lib/streak.ts
// Daily-session streak tracking. localStorage only — no server.

const KEY = 'eyeCareStreak';

export type StreakState = { lastDate: string; streak: number };

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function yesterdayKey() {
  const d = new Date(Date.now() - 86_400_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function loadStreak(): StreakState {
  if (typeof window === 'undefined') return { lastDate: '', streak: 0 };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { lastDate: '', streak: 0 };
    const parsed = JSON.parse(raw) as Partial<StreakState>;
    return {
      lastDate: typeof parsed.lastDate === 'string' ? parsed.lastDate : '',
      streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
    };
  } catch {
    return { lastDate: '', streak: 0 };
  }
}

// Call when the user completes their first session of a calendar day.
// Returns the new state plus a flag indicating whether the streak advanced.
export function tickStreak(): { state: StreakState; advanced: boolean } {
  const today = todayKey();
  const prev = loadStreak();
  if (prev.lastDate === today) return { state: prev, advanced: false };
  const next: StreakState =
    prev.lastDate === yesterdayKey()
      ? { lastDate: today, streak: prev.streak + 1 }
      : { lastDate: today, streak: 1 };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return { state: next, advanced: true };
}

export function isFirstSessionToday(): boolean {
  return loadStreak().lastDate !== todayKey();
}

export type StreakMilestone = 'first' | 'week' | 'month' | 'hundred' | null;

export function milestoneFor(streak: number): StreakMilestone {
  if (streak === 100) return 'hundred';
  if (streak === 30) return 'month';
  if (streak === 7) return 'week';
  if (streak === 1) return 'first';
  return null;
}
