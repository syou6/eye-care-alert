import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

// Brand mark: ink-stroke almond eye with terracotta iris on paper,
// matching the editorial palette in lib/hours.ts and opengraph-image.tsx.
// iOS applies its own corner mask, so the background is full bleed.
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
          width="180"
          height="180"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.5 16C9.5 8.2 22.5 8.2 27.5 16C22.5 23.8 9.5 23.8 4.5 16Z"
            stroke="#1c1b18"
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="16" cy="16" r="4.4" fill="#c47d56" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
