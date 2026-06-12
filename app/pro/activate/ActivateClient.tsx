'use client';

// Landing page for the Stripe Payment Link redirect:
//   https://eyecare.love/pro/activate?session_id={CHECKOUT_SESSION_ID}
// Verifies the session server-side, stores the license, and tells the user
// to keep this URL — it re-activates Pro on any other device.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { activateLicense, isPro } from '@/lib/pro';

type Status = 'working' | 'done' | 'already' | 'error' | 'missing';

const PAPER = '#f5f1ea';
const INK = '#1c1b18';
const MUTE = '#7a7568';
const TERRA = '#c47d56';
const SERIF = 'ui-serif, Charter, "Iowan Old Style", Georgia, serif';
const MONO = 'ui-monospace, "SF Mono", Menlo, monospace';

export default function ActivateClient() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  const [status, setStatus] = useState<Status>('working');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setStatus(isPro() ? 'already' : 'missing');
      return;
    }
    let cancelled = false;
    activateLicense(sessionId).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setStatus('done');
      } else {
        setStatus('error');
        setError(result.error ?? 'Activation failed');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const headline =
    status === 'working'
      ? 'Activating…'
      : status === 'done'
        ? 'Pro is yours.'
        : status === 'already'
          ? 'Pro is already active here.'
          : status === 'missing'
            ? 'No purchase found in this link.'
            : 'Activation failed.';

  const body =
    status === 'done'
      ? 'Ads are gone and custom intervals are unlocked. Bookmark this page — opening this same link on another device activates Pro there too.'
      : status === 'already'
        ? 'This browser already has a Pro license.'
        : status === 'missing'
          ? 'Open the link from your Stripe receipt email — it contains your activation code.'
          : status === 'error'
            ? error
            : '';

  return (
    <div
      style={{
        minHeight: '100dvh', background: PAPER, color: INK,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 24, textAlign: 'center',
      }}
    >
      <div style={{
        fontFamily: MONO, fontSize: '.6875rem', fontWeight: 500,
        letterSpacing: '.16em', textTransform: 'uppercase', color: MUTE,
        marginBottom: 28,
      }}>
        EYE CARE · PRO
      </div>
      <h1 style={{
        fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
        fontSize: 'clamp(2rem, 7vw, 3.5rem)', lineHeight: 1.1, margin: 0,
        color: status === 'done' || status === 'already' ? TERRA : INK,
      }}>
        {headline}
      </h1>
      {body && (
        <p style={{
          fontFamily: SERIF, fontStyle: 'italic', fontSize: '1.0625rem',
          color: MUTE, maxWidth: 460, lineHeight: 1.6, marginTop: 20,
        }}>
          {body}
        </p>
      )}
      <Link
        href="/"
        style={{
          marginTop: 40, padding: '12px 28px',
          fontFamily: MONO, fontSize: '.6875rem', letterSpacing: '.16em',
          textTransform: 'uppercase', textDecoration: 'none',
          background: INK, color: PAPER,
        }}
      >
        Open the timer
      </Link>
    </div>
  );
}
