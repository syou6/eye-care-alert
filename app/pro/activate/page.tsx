import { Suspense } from 'react';
import type { Metadata } from 'next';
import ActivateClient from './ActivateClient';

export const metadata: Metadata = {
  title: 'Activate Pro | EYE CARE',
  description: 'Activate your EYE CARE Pro purchase.',
  robots: { index: false },
};

export default function ProActivatePage() {
  return (
    <Suspense fallback={null}>
      <ActivateClient />
    </Suspense>
  );
}
