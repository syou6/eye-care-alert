'use client';

import { useEffect, useRef } from 'react';
import { mountScrollWorld } from '@/lib/scrollWorldEngine';

// A scroll-scrubbed "fly through the world" landing page for eyecare.love.
// Built on the scroll-world engine (scroll drives a zoom-in + cross-dissolve
// through hand-authored SVG scenes). No video, no external services — the
// stills path of the engine is fully self-contained.
//
// Narrative arc: the strain → what happens in the eye → the 20-20-20 rule →
// the relief of looking away → the timer that keeps the rhythm (CTA to /).

const SECTIONS = [
  {
    id: 'strain',
    label: 'The strain',
    still: '/tour/scene-1.svg',
    accent: '#7fbdec',
    scroll: 1.4,
    linger: 0.35,
    eyebrow: 'Digital eye strain',
    title: 'Your eyes weren’t built for this.',
    body: 'Hours locked on a glowing rectangle, focus frozen at one distance. The ache behind your eyes has a name — and a small, proven fix.',
  },
  {
    id: 'eye',
    label: 'The eye',
    still: '/tour/scene-2.svg',
    accent: '#ff8a5a',
    scroll: 1.5,
    linger: 0.45,
    eyebrow: 'What’s happening',
    title: 'Up close, the eye never lets go.',
    body: 'Staring near keeps the focusing muscle clenched. Tears evaporate, blinking halves, and the strain quietly builds all day.',
  },
  {
    id: 'rule',
    label: 'The rule',
    still: '/tour/scene-3.svg',
    accent: '#c47d56',
    scroll: 1.6,
    linger: 0.5,
    eyebrow: 'The 20·20·20 rule',
    title: 'Every 20 minutes, look 20 feet away, for 20 seconds.',
    body: 'One small rhythm, recommended by eye doctors. It lets the focusing muscle relax before the strain ever sets in.',
  },
  {
    id: 'relief',
    label: 'Relief',
    still: '/tour/scene-4.svg',
    accent: '#6fa46b',
    scroll: 1.5,
    linger: 0.45,
    eyebrow: 'Look away',
    title: 'Twenty feet away, your eyes unclench.',
    body: 'Rest the muscle. Blink. Let the distance do the work. Twenty seconds is all it takes to feel it soften.',
  },
  {
    id: 'timer',
    label: 'The timer',
    still: '/tour/scene-5.svg',
    accent: '#c47d56',
    scroll: 1.4,
    linger: 0.3,
    eyebrow: 'Eye care',
    title: 'One quiet timer keeps the rhythm.',
    body: 'It runs in your browser and taps you on the shoulder every 20 minutes. Free, no sign-up, twelve languages.',
    tags: ['Free forever', '12 languages', 'No sign-up', 'Works offline'],
    cta: {
      primary: { label: 'Start the timer', href: '/' },
      secondary: { label: 'Read the science', href: '/learn' },
    },
  },
];

export default function TourExperience() {
  const ref = useRef<HTMLDivElement | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!ref.current || mounted.current) return;
    mounted.current = true;
    mountScrollWorld(ref.current, {
      brand: { name: 'Eye Care', href: '/' },
      hint: 'scroll to fly in',
      nav: true,
      atmosphere: true,
      diveScroll: 1.4,
      cta: { label: 'Open the timer', href: '/' },
      sections: SECTIONS,
      connectors: [], // no video connectors — scenes cross-dissolve directly
    });
  }, []);

  return (
    <div
      ref={ref}
      style={{
        // eyecare theme tokens consumed by the engine (unlayered → they win)
        ['--sw-bg' as string]: '#0d1020',
        ['--sw-ink' as string]: '#eef1f8',
        ['--sw-ink-soft' as string]: '#9aa3bd',
        ['--sw-accent' as string]: '#c47d56',
        ['--sw-font-display' as string]: 'var(--font-grotesk), ui-sans-serif, system-ui, sans-serif',
        ['--sw-font-body' as string]: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
      } as React.CSSProperties}
    />
  );
}
