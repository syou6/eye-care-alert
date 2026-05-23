import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

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
          background: '#A8D5C7',
          borderRadius: '50%',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Eye Outline */}
          <path
            d="M12 5C7 5 3 12 3 12C3 12 7 19 12 19C17 19 21 12 21 12C21 12 17 5 12 5Z"
            stroke="#1F3A5F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#FFFFFF"
          />
          
          {/* Iris */}
          <circle cx="12" cy="12" r="4" fill="#5B8DBE" />
          
          {/* Pupil */}
          <circle cx="12" cy="12" r="2" fill="#1F3A5F" />
          
          {/* Light Reflection */}
          <circle cx="11" cy="11" r="1" fill="#FFFFFF" opacity="0.9" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}