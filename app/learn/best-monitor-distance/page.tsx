import type { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

const meta = {
  title: 'Best Monitor Distance for Eye Health: A Practical Setup Guide',
  description:
    'The right monitor distance reduces eye fatigue more than almost any other ergonomic change. Here are the numbers backed by research and an easy way to measure yours.',
  slug: 'best-monitor-distance',
  publishedAt: '2026-05-24',
  readingMinutes: 5,
};

export const metadata: Metadata = {
  title: `${meta.title} | EYE CARE`,
  description: meta.description,
  alternates: { canonical: `https://eyecare.love/learn/${meta.slug}` },
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: `https://eyecare.love/learn/${meta.slug}`,
    type: 'article',
  },
};

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <p>
        Monitor distance is the single most-cited ergonomic factor in digital eye strain, and
        it is also the one most people get wrong. Most laptops sit 16-18 inches from the user&rsquo;s
        face; most ergonomic guidelines suggest 25-30 inches. That gap explains a measurable
        fraction of late-afternoon eye fatigue.
      </p>

      <h2>The short answer</h2>
      <p>
        For a typical desktop monitor: <strong>arm&rsquo;s length away</strong> (about
        20-30 inches / 50-75 cm) with the top of the screen at or just below eye level.
        Tilt the screen back 10-20 degrees. That is the entire baseline.
      </p>

      <h2>Why distance matters</h2>
      <p>
        Three reasons your eyes care about how far away the screen is:
      </p>
      <ul>
        <li>
          <strong>Accommodation load.</strong> The closer the screen, the harder your ciliary
          muscle works to focus. Move from 16 to 24 inches and you reduce focal effort by roughly
          a third.
        </li>
        <li>
          <strong>Convergence.</strong> Both eyes have to angle inward more for closer targets.
          Sustained convergence is one of the drivers of eye-strain headaches.
        </li>
        <li>
          <strong>Text size threshold.</strong> Most people unconsciously lean toward the
          monitor when text is too small. Increasing distance forces you to bump up the font
          size, which is also easier on your eyes.
        </li>
      </ul>

      <h2>How to measure your current distance</h2>
      <p>
        Sit in your normal working posture. Reach your arm out toward the monitor. If your
        fingertips touch the screen, you are around 25 inches away (the rough length of a
        forearm plus an outstretched hand). If your knuckles touch, you are closer to 20 inches.
        If you cannot reach without leaning forward, you are at 30+ inches.
      </p>
      <p>
        For most monitors and visual acuities, the sweet spot is "fingertips touch the screen"
        &mdash; about 25 inches.
      </p>

      <h2>Monitor height</h2>
      <p>
        Top of the screen at or just below eye level. The eyes naturally look slightly downward
        at rest; positioning the screen too high forces upward gaze, which strains the levator
        palpebrae muscle that holds your upper lid open and increases evaporative dry eye (the
        more eye surface exposed, the faster the tear film evaporates).
      </p>
      <p>
        For laptops, this almost always means a laptop stand plus an external keyboard. A laptop
        on the desk at typing distance puts the screen too low; raising the laptop puts the
        keyboard too high. Pick one.
      </p>

      <h2>Tilt and angle</h2>
      <p>
        Tilt the screen back 10-20 degrees so the surface is roughly perpendicular to your line
        of sight. This reduces glare from overhead lighting (more important than people realize)
        and ensures even focus across the screen surface.
      </p>

      <h2>For multi-monitor setups</h2>
      <ul>
        <li>Primary monitor directly in front of you, at the standard distance and height.</li>
        <li>Secondary monitors within 15 degrees of horizontal sweep from the primary.</li>
        <li>
          Match the distance of secondary monitors to the primary; mismatched depths force your
          eyes to refocus every time you switch screens, which is measurably more fatiguing.
        </li>
      </ul>

      <h2>For ultrawide and 4K monitors</h2>
      <p>
        Larger monitors require slightly more distance &mdash; aim for a position where you can
        see the full screen with peripheral vision without rotating your head significantly. For
        a 34-inch ultrawide, that is roughly 30-36 inches away.
      </p>

      <h2>The check-in habit</h2>
      <p>
        Even with a correct setup, posture drifts during the workday. Most people lean forward
        when they get tired or absorbed. The fix is the same one that solves digital eye strain:
        a regular interrupt. The free <a href="/en">20-20-20 timer</a> gives you a 20-second
        break every 20 minutes &mdash; use the first three seconds to sit back to your starting
        distance.
      </p>
    </ArticleLayout>
  );
}
