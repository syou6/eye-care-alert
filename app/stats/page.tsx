import type { Metadata } from 'next';
import StatsClient from '@/components/StatsClient';

const SITE_URL = 'https://eyecare.love';

export const metadata: Metadata = {
  title: 'Your stats | EYE CARE',
  description:
    'Your personal eye-care timer stats — daily sessions, weekly chart, current streak. Stored locally on your device; nothing leaves the browser.',
  alternates: { canonical: `${SITE_URL}/stats` },
  robots: { index: false, follow: true },
};

export default function StatsPage() {
  return <StatsClient />;
}
