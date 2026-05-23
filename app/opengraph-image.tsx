import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'EYE CARE - 20-20-20 Rule Timer';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              background: '#A8D5C7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 40,
            }}
          >
            <svg
              width="140"
              height="140"
              viewBox="0 0 140 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M70 20C40 20 15 70 15 70C15 70 40 120 70 120C100 120 125 70 125 70C125 70 100 20 70 20Z"
                stroke="#1F3A5F"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="#FFFFFF"
              />
              <circle cx="70" cy="70" r="28" fill="#5B8DBE" />
              <circle cx="70" cy="70" r="14" fill="#1F3A5F" />
              <circle cx="62" cy="62" r="7" fill="#FFFFFF" opacity="0.9" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 80, fontWeight: 'bold', letterSpacing: 8 }}>
              EYE CARE
            </div>
            <div style={{ fontSize: 32, opacity: 0.9, marginTop: 10 }}>
              20-20-20 Rule Timer
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.8,
            maxWidth: 800,
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          Every 20 minutes, look at something 20 feet away for 20 seconds
        </div>
        <div
          style={{
            fontSize: 24,
            opacity: 0.7,
            marginTop: 30,
            display: 'flex',
            gap: 20,
          }}
        >
          <span>🌍 12 Languages</span>
          <span>•</span>
          <span>💯 Free Forever</span>
          <span>•</span>
          <span>👁️ Protect Your Vision</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}