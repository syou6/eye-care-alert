// lib/pro.ts
// Client-side Pro license. The license is issued by /api/pro/activate after a
// verified Stripe Checkout session and stored in localStorage. The client only
// checks shape/presence — real validation happens server-side at activation.

const LICENSE_KEY = 'eyeCareProLicense';

// "cs_xxx.hexsig" — Stripe checkout session id + HMAC signature.
const LICENSE_PATTERN = /^cs_[A-Za-z0-9_]+\.[a-f0-9]{64}$/;

export function loadLicense(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LICENSE_KEY);
    return raw && LICENSE_PATTERN.test(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function saveLicense(license: string): boolean {
  if (typeof window === 'undefined') return false;
  if (!LICENSE_PATTERN.test(license)) return false;
  try {
    window.localStorage.setItem(LICENSE_KEY, license);
    return true;
  } catch {
    return false;
  }
}

export function isPro(): boolean {
  return loadLicense() !== null;
}

export async function activateLicense(sessionId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/pro/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    });
    const data = (await res.json()) as { success: boolean; data?: { license: string }; error?: string };
    if (!res.ok || !data.success || !data.data?.license) {
      return { ok: false, error: data.error ?? 'Activation failed' };
    }
    if (!saveLicense(data.data.license)) {
      return { ok: false, error: 'Could not store the license in this browser' };
    }
    return { ok: true };
  } catch (error) {
    console.error('Pro activation failed:', error);
    return { ok: false, error: 'Network error — please try again' };
  }
}
