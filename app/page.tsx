'use client';

import dynamic from 'next/dynamic';

const EyeCareGlobal = dynamic(() => import('@/components/EyeCareGlobal'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-xl font-light text-gray-400 tracking-widest">
        Loading...
      </div>
    </div>
  ),
});

export default function Home() {
  return <EyeCareGlobal />;
}
