// lib/analytics.ts — typed helpers for emitting analytics events.
// Routes through Plausible (cookieless, adblock-resistant when available)
// and falls back to GA4 dataLayer if Plausible is not loaded.
// Safe to call from anywhere; no-ops on the server.

type EventName =
  | 'timer_start'
  | 'timer_pause'
  | 'timer_reset'
  | 'break_started'
  | 'break_skipped'
  | 'break_completed'
  | 'language_changed'
  | 'theme_changed'
  | 'sound_muted'
  | 'sound_unmuted'
  | 'welcome_completed'
  | 'welcome_skipped'
  | 'install_prompt_shown'
  | 'install_accepted'
  | 'install_dismissed'
  | 'donation_modal_shown'
  | 'donation_clicked'
  | 'help_opened'
  | 'embed_loaded'
  | 'ics_downloaded'
  | 'streak_milestone'
  | 'intervals_change'
  | 'pro_modal_shown'
  | 'pro_unlock_clicked'
  | 'pro_activated';

type EventProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: EventProps }) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: EventName, props?: EventProps) {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.plausible === 'function') {
      window.plausible(event, props ? { props } : undefined);
    }
    if (window.dataLayer) {
      window.dataLayer.push({ event, ...(props ?? {}) });
    }
  } catch {
    // never let analytics throw
  }
}

// ─── Lightweight A/B test framework ────────────────────────────────────────
// Pure localStorage assignment, no server. Each test gets a unique key,
// each user is assigned to a variant once and remembered. Variant is
// emitted as part of every event under variant_<test>=<variant>.

const AB_PREFIX = 'eyeCareAB:';

export function variant<T extends string>(
  test: string,
  variants: readonly T[],
): T {
  if (typeof window === 'undefined') return variants[0];
  const key = `${AB_PREFIX}${test}`;
  try {
    const stored = window.localStorage.getItem(key);
    if (stored && (variants as readonly string[]).includes(stored)) {
      return stored as T;
    }
    const pick = variants[Math.floor(Math.random() * variants.length)];
    window.localStorage.setItem(key, pick);
    return pick;
  } catch {
    return variants[0];
  }
}
