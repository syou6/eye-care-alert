import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
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
          borderRadius: '25%',
        }}
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Eye Outline */}
          <path
            d="M70 20C40 20 15 70 15 70C15 70 40 120 70 120C100 120 125 70 125 70C125 70 100 20 70 20Z"
            stroke="#1F3A5F"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#FFFFFF"
          />
          
          {/* Iris */}
          <circle cx="70" cy="70" r="28" fill="#5B8DBE" />
          
          {/* Pupil */}
          <circle cx="70" cy="70" r="14" fill="#1F3A5F" />
          
          {/* Light Reflection */}
          <circle cx="62" cy="62" r="7" fill="#FFFFFF" opacity="0.9" />
          
          {/* Radiating Lines */}
          <path d="M70 5L70 15" stroke="#1F3A5F" strokeWidth="6" strokeLinecap="round" />
          <path d="M70 125L70 135" stroke="#1F3A5F" strokeWidth="6" strokeLinecap="round" />
          <path d="M20 20L30 30" stroke="#1F3A5F" strokeWidth="6" strokeLinecap="round" />
          <path d="M110 110L120 120" stroke="#1F3A5F" strokeWidth="6" strokeLinecap="round" />
          <path d="M5 70L15 70" stroke="#1F3A5F" strokeWidth="6" strokeLinecap="round" />
          <path d="M125 70L135 70" stroke="#1F3A5F" strokeWidth="6" strokeLinecap="round" />
          <path d="M20 120L30 110" stroke="#1F3A5F" strokeWidth="6" strokeLinecap="round" />
          <path d="M110 30L120 20" stroke="#1F3A5F" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}