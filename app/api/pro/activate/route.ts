// POST /api/pro/activate
// Exchanges a paid Stripe Checkout session for a signed Pro license.
// No database — the license is the session id plus an HMAC signature, so the
// purchase receipt URL doubles as a cross-device activation link.

import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';

const SESSION_ID_PATTERN = /^cs_[A-Za-z0-9_]{10,250}$/;

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

function json<T>(body: ApiResponse<T>, status: number) {
  return NextResponse.json(body, { status });
}

function sign(sessionId: string, secret: string): string {
  return createHmac('sha256', secret).update(sessionId).digest('hex');
}

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const licenseSecret = process.env.PRO_LICENSE_SECRET;
  if (!stripeKey || !licenseSecret) {
    console.error('Pro activation misconfigured: missing STRIPE_SECRET_KEY or PRO_LICENSE_SECRET');
    return json({ success: false, error: 'Pro activation is not configured' }, 503);
  }

  let sessionId: string;
  try {
    const body = (await req.json()) as { session_id?: unknown };
    if (typeof body.session_id !== 'string' || !SESSION_ID_PATTERN.test(body.session_id)) {
      return json({ success: false, error: 'Invalid session id' }, 400);
    }
    sessionId = body.session_id;
  } catch {
    return json({ success: false, error: 'Invalid JSON body' }, 400);
  }

  try {
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      { headers: { Authorization: `Bearer ${stripeKey}` } },
    );
    if (res.status === 404) {
      return json({ success: false, error: 'Unknown checkout session' }, 404);
    }
    if (!res.ok) {
      console.error('Stripe session lookup failed:', res.status, await res.text());
      return json({ success: false, error: 'Could not verify the purchase' }, 502);
    }
    const session = (await res.json()) as { payment_status?: string; status?: string };
    if (session.payment_status !== 'paid') {
      return json({ success: false, error: 'This checkout session has not been paid' }, 402);
    }

    const license = `${sessionId}.${sign(sessionId, licenseSecret)}`;
    return json({ success: true, data: { license } }, 200);
  } catch (error) {
    console.error('Pro activation failed:', error);
    return json({ success: false, error: 'Could not verify the purchase' }, 502);
  }
}

// GET /api/pro/activate?license=... — optional integrity check used by tests
// and future cross-device restore. Verifies the HMAC without touching Stripe.
export async function GET(req: NextRequest) {
  const licenseSecret = process.env.PRO_LICENSE_SECRET;
  if (!licenseSecret) {
    return json({ success: false, error: 'Pro activation is not configured' }, 503);
  }
  const license = req.nextUrl.searchParams.get('license') ?? '';
  const [sessionId, sig] = license.split('.');
  if (!sessionId || !sig || !SESSION_ID_PATTERN.test(sessionId) || !/^[a-f0-9]{64}$/.test(sig)) {
    return json({ success: false, error: 'Malformed license' }, 400);
  }
  const expected = sign(sessionId, licenseSecret);
  const valid =
    expected.length === sig.length &&
    timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(sig, 'hex'));
  return json({ success: valid, ...(valid ? {} : { error: 'Invalid signature' }) }, valid ? 200 : 401);
}
