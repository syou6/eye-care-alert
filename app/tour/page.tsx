import type { Metadata } from 'next';
import TourExperience from './TourExperience';

export const metadata: Metadata = {
  title: 'A flight through digital eye strain — Eye Care',
  description:
    'Scroll through the story of digital eye strain and the 20-20-20 rule, then start the free timer that keeps the rhythm for you.',
  alternates: { canonical: '/tour' },
  openGraph: {
    title: 'A flight through digital eye strain — Eye Care',
    description:
      'The 20-20-20 rule, told as a scroll-through flight. Then a free timer that keeps the rhythm.',
    url: 'https://eyecare.love/tour',
    type: 'website',
  },
};

export default function TourPage() {
  return <TourExperience />;
}
