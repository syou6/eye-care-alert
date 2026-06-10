import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

// Brand mark: ink-stroke almond eye with terracotta iris on paper,
// matching the editorial palette in lib/hours.ts and opengraph-image.tsx.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f1ea',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.5 16C9 7.5 23 7.5 28.5 16C23 24.5 9 24.5 3.5 16Z"
            stroke="#1c1b18"
            strokeWidth="1.8"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="16" cy="16" r="4.8" fill="#c47d56" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
