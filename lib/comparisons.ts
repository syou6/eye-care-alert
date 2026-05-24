// Comparison pages — capture "X vs Y" search intent.

export type Row = { feature: string; us: string; them: string };

export type Comparison = {
  slug: string;
  vs: string;
  vsUrl?: string;
  metaTitle: string;
  metaDescription: string;
  oneLiner: string;
  whenToUseUs: string;
  whenToUseThem: string;
  ourPitch: string;
  rows: Row[];
  verdict: string;
};

export const COMPARISONS: Comparison[] = [
  {
    slug: 'pomodoro',
    vs: 'Pomodoro',
    metaTitle: 'EYE CARE vs Pomodoro — Which Timer for Long Screen Days?',
    metaDescription:
      'Pomodoro and 20-20-20 solve different problems. Pomodoro manages attention. EYE CARE protects your eyes. Most knowledge workers benefit from running both.',
    oneLiner:
      'Pomodoro (25 min focus / 5 min break) manages attention. EYE CARE (20 min focus / 20 sec break) protects your eyes. They target different problems and layer cleanly.',
    whenToUseUs:
      'When the goal is reducing end-of-day eye fatigue, dry eye, or screen-related headaches. Or when you want a quiet ambient timer that does not pull you out of flow every 25 minutes.',
    whenToUseThem:
      'When the goal is splitting work into atomic units, managing context switching, or building focus discipline. Pomodoro is a productivity protocol, not an eye-care one.',
    ourPitch:
      'You do not have to choose. The 20-second EYE CARE break is short enough to live inside any Pomodoro work block without interrupting it; the 5-minute Pomodoro break naturally satisfies several EYE CARE cycles at once.',
    rows: [
      { feature: 'Primary purpose', us: 'Reduce digital eye strain', them: 'Manage attention & flow' },
      { feature: 'Work interval', us: '20 minutes (fixed)', them: '25 minutes (Pomodoro classic)' },
      { feature: 'Break duration', us: '20 seconds (eye reset)', them: '5 minutes (rest)' },
      { feature: 'Long break', us: 'Implicit (your own pace)', them: '15-30 min every 4 cycles' },
      { feature: 'Recommended by', us: 'American Optometric Association', them: 'Francesco Cirillo (creator)' },
      { feature: 'Evidence base', us: 'Controlled studies for eye strain reduction', them: 'Anecdotal + productivity research' },
      { feature: 'Forces a full-screen overlay break', us: 'Yes (guided 4-2-4 breath cycle)', them: 'Varies by app' },
      { feature: 'Free, no signup', us: 'Yes', them: 'Many free Pomodoro tools exist' },
      { feature: 'Works offline', us: 'Yes (PWA)', them: 'Depends on app' },
      { feature: 'Multi-language', us: '12 languages with hreflang', them: 'Varies' },
      { feature: 'Open source', us: 'Yes (MIT)', them: 'Varies' },
    ],
    verdict:
      'Run both. Use Pomodoro to structure your day, use EYE CARE to keep your eyes working by 5 PM. They are complementary, not competitive.',
  },
  {
    slug: 'eyerestreminder',
    vs: 'eyerestreminder.com',
    vsUrl: 'https://eyerestreminder.com',
    metaTitle: 'EYE CARE vs eyerestreminder.com — Free 20-20-20 Timer Comparison',
    metaDescription:
      'Both are free browser-based 20-20-20 timers. Here is what differs: language support, design, PWA, offline, monetization, and content.',
    oneLiner:
      'Both implement the 20-20-20 rule in a browser. EYE CARE adds 12 languages, a PWA install path, an editorial design, and an evidence-cited content library.',
    whenToUseUs:
      'When you want a polished, multi-language timer that you can install to your home screen, with deep articles on the science and persona-specific guidance for your profession.',
    whenToUseThem:
      'When you want the simplest possible English-only timer with no chrome at all. eyerestreminder.com is a long-running classic of the genre.',
    ourPitch:
      'Both work. EYE CARE goes further on internationalization, accessibility, articles, and PWA polish — useful if you are non-English-speaking, want to install it as an app, or care about the underlying research.',
    rows: [
      { feature: 'Free', us: 'Yes', them: 'Yes' },
      { feature: 'Browser-based', us: 'Yes', them: 'Yes' },
      { feature: 'Languages', us: '12 (with hreflang)', them: 'English' },
      { feature: 'RTL support (Arabic)', us: 'Yes', them: 'No' },
      { feature: 'PWA / installable', us: 'Yes', them: 'No' },
      { feature: 'Works offline', us: 'Yes (service worker)', them: 'No' },
      { feature: 'Editorial design', us: 'Time-of-day palette + italic serif', them: 'Plain' },
      { feature: 'Welcome onboarding', us: 'Yes (with language switcher upfront)', them: 'No' },
      { feature: 'Audio chimes', us: 'Yes (Web Audio, mute toggle)', them: 'Yes' },
      { feature: 'Articles / glossary', us: '4+ articles, 8 glossary terms, persona pages', them: 'No' },
      { feature: 'Open source', us: 'Yes (MIT)', them: 'Closed' },
      { feature: 'Calendar (.ics) download', us: 'Yes', them: 'No' },
      { feature: 'Embed widget', us: 'Yes (drop-in <script>)', them: 'No' },
    ],
    verdict:
      'EYE CARE is the broader product. If English-only and minimal is what you want, eyerestreminder.com is fine. If you want translations, PWA, articles, or to install it on your phone, EYE CARE wins.',
  },
  {
    slug: '202020',
    vs: '202020.io',
    vsUrl: 'https://202020.io',
    metaTitle: 'EYE CARE vs 202020.io — Two 20-20-20 Timer Tools Compared',
    metaDescription:
      '202020.io is a three-phase eye care timer with an affiliate-funded blog. EYE CARE focuses on translation breadth, PWA polish, and an open-source codebase.',
    oneLiner:
      '202020.io ships a three-phase break (look-away + slow-blink) and an affiliate blog. EYE CARE focuses on internationalization, PWA, and an evidence-cited content library.',
    whenToUseUs:
      'When you want the broadest language coverage, an installable PWA, and an open-source codebase with persona-specific guidance.',
    whenToUseThem:
      'When you want a three-phase break protocol (look-away then guided slow blink) or are looking for blue-light-glasses affiliate reviews.',
    ourPitch:
      'EYE CARE chose breadth: 12 languages, RTL, PWA, articles, glossary, persona pages, embed widget. 202020.io chose depth on the break protocol itself. Different bets.',
    rows: [
      { feature: 'Free', us: 'Yes', them: 'Yes' },
      { feature: 'Browser-based', us: 'Yes', them: 'Yes' },
      { feature: 'Languages', us: '12', them: 'English-focused' },
      { feature: 'PWA / installable', us: 'Yes', them: 'No' },
      { feature: 'Break style', us: 'Guided 4-2-4 breath', them: 'Three-phase (look + slow blink)' },
      { feature: 'Affiliate links', us: 'Footer strip (Amazon)', them: 'Embedded reviews' },
      { feature: 'Articles', us: '4 long-form + 8 glossary terms', them: 'Blog (varies)' },
      { feature: 'Persona pages', us: '12 (developers, gamers, kids etc.)', them: 'No' },
      { feature: 'Embed widget', us: 'Yes', them: 'No' },
      { feature: 'Open source', us: 'Yes (MIT)', them: 'Closed' },
    ],
    verdict:
      'Either works for the core 20-20-20 use case. EYE CARE goes wider on languages, installability, and content; 202020.io goes deeper on the break protocol mechanics and product reviews.',
  },
];

export const COMPARISON_SLUGS = COMPARISONS.map((c) => c.slug);
export function getComparison(slug: string) {
  return COMPARISONS.find((c) => c.slug === slug);
}
