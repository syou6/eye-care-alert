'use client';

import { useEffect, useRef, useState } from 'react';
import { isPro } from '@/lib/pro';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-6158728857323077';

export default function AdSlot({
  slot,
  format = 'auto',
  responsive = true,
  reservedHeight = 100,
  className = '',
}: {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'fluid';
  responsive?: boolean;
  reservedHeight?: number;
  className?: string;
}) {
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  // Pro removes all ads. Checked in an effect so SSR markup stays stable.
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (isPro()) {
      setHidden(true);
      return;
    }
    if (pushedRef.current) return;
    if (typeof window === 'undefined') return;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
      pushedRef.current = true;
    } catch {
      // adsbygoogle.push can throw if the script blocks or the slot is
      // double-initialized in dev; non-fatal.
    }
  }, []);

  if (hidden) return null;

  return (
    <div
      className={className}
      style={{ minHeight: reservedHeight }}
      aria-label="Sponsored"
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
