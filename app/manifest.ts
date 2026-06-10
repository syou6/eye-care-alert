import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EYE CARE - 20-20-20 Rule Timer',
    short_name: 'EYE CARE',
    description:
      'Free 20-20-20 rule timer to protect your eyes from digital eye strain. Works offline.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f5f1ea',
    theme_color: '#f5f1ea',
    categories: ['health', 'productivity', 'utilities'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
