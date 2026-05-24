// Dynamic OG image for milestone shares.
// /api/og/milestone?n=100 → 1200×630 PNG ready for Twitter/X / Open Graph

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const n = Math.max(1, Math.min(99999, Number(searchParams.get('n') || 1)));
  const label =
    n === 1
      ? 'First session'
      : n === 7
        ? 'Seven days'
        : n === 30
          ? 'A month of breaks'
          : n === 100
            ? 'One hundred sessions'
            : n >= 1000
              ? 'A thousand sessions'
              : `${n} sessions`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#f5f1ea',
          color: '#1c1b18',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderBottom: '1px solid rgba(28,27,24,0.18)',
            paddingBottom: 18,
            fontSize: 18,
            letterSpacing: 4,
            color: '#7a7568',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ fontWeight: 600 }}>EYE CARE</span>
          <span style={{ fontStyle: 'italic', textTransform: 'none', letterSpacing: 0, color: '#c47d56' }}>
            milestone
          </span>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontStyle: 'italic',
              color: '#7a7568',
              marginBottom: 12,
            }}
          >
            {label}.
          </div>
          <div
            style={{
              fontStyle: 'italic',
              fontSize: 320,
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: -10,
              color: '#1c1b18',
            }}
          >
            {n}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderTop: '1px solid rgba(28,27,24,0.18)',
            paddingTop: 18,
            fontSize: 16,
            letterSpacing: 3,
            color: '#7a7568',
            textTransform: 'uppercase',
          }}
        >
          <span>eyecare.love · 20-20-20 rule</span>
          <span style={{ fontStyle: 'italic', textTransform: 'none', letterSpacing: 0, color: '#1c1b18' }}>
            quietly remarkable
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
