import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'EYE CARE — A quiet 20-20-20 timer for your eyes';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
            morning
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
            a quiet timer for your eyes.
          </div>
          <div
            style={{
              fontStyle: 'italic',
              fontSize: 260,
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: -8,
              color: '#1c1b18',
            }}
          >
            20:00
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
          <span>eyecare.love · 12 languages · pwa · free</span>
          <span style={{ fontStyle: 'italic', textTransform: 'none', letterSpacing: 0, color: '#1c1b18' }}>
            20-20-20 rule
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
