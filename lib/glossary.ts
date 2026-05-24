// Glossary terms for /glossary/[term].
// Short, citation-friendly entries optimized for AI engine retrieval +
// featured snippet capture.

export type GlossaryEntry = {
  slug: string;
  term: string;
  short: string;
  full: string;
  related?: { href: string; title: string }[];
  alsoKnown?: string[];
};

export const GLOSSARY: GlossaryEntry[] = [
  {
    slug: 'digital-eye-strain',
    term: 'Digital eye strain',
    alsoKnown: ['Computer vision syndrome', 'DES'],
    short:
      'A cluster of vision-related symptoms caused by prolonged use of digital devices — eyes that feel tired, dry, blurred, or sore, often accompanied by headaches and neck/shoulder tension.',
    full:
      'Digital eye strain (also called computer vision syndrome) is the modern label for the set of symptoms that emerge after extended close-up screen work. The American Optometric Association lists tired or burning eyes, blurred or double vision, dry eyes, headaches, and neck or shoulder pain as the core symptoms. Mechanisms include sustained ciliary-muscle contraction (focus fatigue), reduced blink rate (tear-film disruption), glare and contrast strain, and posture-driven musculoskeletal load. Treatment is primarily behavioral — regular breaks (the 20-20-20 rule), proper ergonomics, adequate room lighting, and corrected refractive error.',
    related: [
      { href: '/learn/does-the-20-20-20-rule-work', title: 'Does the 20-20-20 rule actually work?' },
      { href: '/learn/screen-break-statistics', title: 'Screen break statistics' },
    ],
  },
  {
    slug: 'computer-vision-syndrome',
    term: 'Computer vision syndrome',
    alsoKnown: ['CVS', 'Digital eye strain'],
    short:
      'A clinical term used interchangeably with digital eye strain, describing the constellation of eye, vision, and musculoskeletal symptoms from extended screen use.',
    full:
      'Computer vision syndrome (CVS) is the original clinical label coined by optometrist Dr. Jeffrey Anshel before the smartphone era widened it to all digital devices. The American Optometric Association estimates 50 to 90 percent of regular computer users experience at least one CVS symptom. Risk increases with daily screen hours, near-focus distance, uncorrected presbyopia or astigmatism, poor monitor positioning, and inadequate room lighting. The 20-20-20 rule and a comprehensive eye exam are the two first-line interventions.',
    related: [
      { href: '/learn/does-the-20-20-20-rule-work', title: 'Does the 20-20-20 rule actually work?' },
      { href: '/learn/20-20-20-rule-for-kids', title: 'The 20-20-20 rule for kids' },
    ],
  },
  {
    slug: 'ciliary-muscle',
    term: 'Ciliary muscle',
    short:
      'The small ring of smooth muscle inside the eye that contracts to change the lens shape for near focus and relaxes for distance vision.',
    full:
      'The ciliary muscle drives accommodation — the eye\'s ability to switch focus between near and far targets. Sustained near focus (reading, screens, detail work) keeps the muscle contracted; over 20 or more continuous minutes, this produces the burning, fatigued feeling at the heart of digital eye strain. Looking at something at least 20 feet away allows the muscle to relax, which is the mechanism behind the 20-20-20 rule. Age-related stiffness of the ciliary apparatus is the root cause of presbyopia.',
    related: [
      { href: '/learn/does-the-20-20-20-rule-work', title: 'Does the 20-20-20 rule actually work?' },
      { href: '/glossary/accommodation', title: 'Accommodation' },
    ],
  },
  {
    slug: 'myopia',
    term: 'Myopia',
    alsoKnown: ['Nearsightedness', 'Short-sightedness'],
    short:
      'A refractive error in which distant objects appear blurred while near objects remain sharp, caused by an elongated eyeball or excess corneal curvature.',
    full:
      'Myopia is the most common refractive error worldwide; global prevalence has roughly doubled in the past 30 years and is projected to affect half the global population by 2050. In children, the eye is still elongating, and prolonged near-focus combined with insufficient outdoor light exposure are the strongest modifiable risk factors. The 20-20-20 rule helps with day-to-day eye strain but is not a primary myopia control intervention; the 20-20-2 rule (2 hours of daily outdoor time) has the strongest evidence for slowing progression in children.',
    related: [
      { href: '/learn/20-20-2-rule', title: 'The 20-20-2 rule (kids + outdoor time)' },
      { href: '/learn/20-20-20-rule-for-kids', title: 'The 20-20-20 rule for kids' },
    ],
  },
  {
    slug: 'presbyopia',
    term: 'Presbyopia',
    alsoKnown: ['Age-related farsightedness'],
    short:
      'The progressive loss of near focus that begins in the early forties, caused by stiffening of the eye\'s lens and ciliary apparatus.',
    full:
      'Presbyopia is universal — everyone develops it, typically starting between 40 and 45 years of age, because the crystalline lens loses elasticity and the ciliary muscle weakens. The result is difficulty focusing on close objects, especially in low light. Reading glasses, bifocals, progressives, or contact lenses correct it. Presbyopia also amplifies digital eye strain: the lens cannot accommodate as effectively, so the same screen hours produce more end-of-day fatigue. Regular breaks become more important after 45.',
    related: [
      { href: '/glossary/ciliary-muscle', title: 'Ciliary muscle' },
      { href: '/for/seniors', title: 'Eye-strain timer for seniors' },
    ],
  },
  {
    slug: 'dry-eye-syndrome',
    term: 'Dry eye syndrome',
    alsoKnown: ['Keratoconjunctivitis sicca', 'DES', 'DED'],
    short:
      'A chronic condition in which insufficient or poor-quality tears fail to keep the ocular surface lubricated, producing a burning, gritty, or scratchy sensation.',
    full:
      'Dry eye syndrome ranges from mild screen-related dryness to chronic dysfunction requiring clinical treatment. Screen use accelerates symptoms because blink rate drops by roughly 60 percent during focused close work, leaving the tear film unrenewed. Age (tear production declines), certain medications (antihistamines, antidepressants, blood pressure drugs), contact lens wear, and Sjögren\'s syndrome all increase risk. The 20-20-20 rule helps by naturally restoring blink rate during breaks. Preservative-free artificial tears, warm compresses, and a clinical evaluation are next-line.',
    related: [
      { href: '/learn/does-the-20-20-20-rule-work', title: 'Does the 20-20-20 rule actually work?' },
      { href: '/glossary/blink-rate', title: 'Blink rate' },
    ],
  },
  {
    slug: 'accommodation',
    term: 'Accommodation',
    short:
      'The eye\'s ability to change focus between objects at different distances, achieved by the ciliary muscle reshaping the crystalline lens.',
    full:
      'Accommodation is what lets you switch focus from this screen to the wall across the room without conscious effort — most of the time. Sustained near accommodation fatigues the ciliary muscle within 20 or so minutes; the 20-20-20 rule\'s remedy is to force a brief far-focus episode so the muscle can relax. With age (presbyopia), accommodative range diminishes, which is why reading glasses become necessary in the forties. Disorders of accommodation include accommodative spasm and accommodative insufficiency, both treatable with a comprehensive eye exam.',
    related: [
      { href: '/glossary/ciliary-muscle', title: 'Ciliary muscle' },
      { href: '/glossary/presbyopia', title: 'Presbyopia' },
    ],
  },
  {
    slug: 'blink-rate',
    term: 'Blink rate',
    short:
      'The number of times the eye blinks per minute; normally around 15 in adults, dropping to 4 to 5 during focused screen use.',
    full:
      'A normal resting blink rate is roughly 12 to 18 blinks per minute. During focused screen work — reading, gaming, coding, video editing — blink rate drops by 50 to 60 percent, sometimes lower for highly focused tasks. The result: the tear film evaporates between blinks, the cornea is exposed, and the eye develops the burning, gritty feeling characteristic of screen-related dry eye. The 20-20-20 rule\'s short break naturally resets blink rate; consciously blinking several times during the break amplifies the effect.',
    related: [
      { href: '/glossary/dry-eye-syndrome', title: 'Dry eye syndrome' },
      { href: '/learn/screen-break-statistics', title: 'Screen break statistics' },
    ],
  },
];

export const GLOSSARY_SLUGS = GLOSSARY.map((g) => g.slug);
export function getGlossaryEntry(slug: string) {
  return GLOSSARY.find((g) => g.slug === slug);
}
