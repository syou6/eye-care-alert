import type { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

const meta = {
  title: 'The 20-20-2 Rule: How Outdoor Time Slows Childhood Myopia',
  description:
    'The 20-20-2 rule is the pediatric upgrade to 20-20-20. It adds 2 hours of daily outdoor time to combat childhood myopia. Here is the evidence and how to make it work in a school week.',
  slug: '20-20-2-rule',
  publishedAt: '2026-05-23',
  readingMinutes: 6,
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
        Childhood myopia (nearsightedness) is rising globally. Some projections estimate that by 2050, half the
        world&rsquo;s population will be myopic. Screens get blamed, but the most-studied protective factor
        isn&rsquo;t a screen rule &mdash; it&rsquo;s sunlight.
      </p>
      <p>
        The <strong>20-20-2 rule</strong> is the pediatric eye-care community&rsquo;s answer: layer 2 hours of
        daily outdoor time on top of the standard 20-20-20 screen-break protocol.
      </p>

      <h2>What does the &ldquo;2&rdquo; stand for?</h2>
      <p>
        <strong>Two hours of outdoor time, every day.</strong> Not 2 hours of running around at sports practice
        once a week. Sustained, daily, outside-the-house time, ideally in daylight.
      </p>
      <p>
        Activity intensity does not matter much. Walking to school, eating lunch outside, reading on the porch,
        playing in the yard &mdash; all count. The active ingredient is sunlight exposure on the eye.
      </p>

      <h2>Why outdoor time matters for vision</h2>
      <ul>
        <li>
          <strong>Dopamine release in the retina.</strong> Bright outdoor light stimulates retinal dopamine
          release, which appears to slow the elongation of the eyeball &mdash; the physical change that causes
          myopia to worsen.
        </li>
        <li>
          <strong>Distance focus.</strong> Outdoors, there is naturally more far-distance viewing. Indoors,
          almost everything is within 6 meters &mdash; near-focus territory.
        </li>
        <li>
          <strong>Higher light intensity.</strong> Even a cloudy day outside is 5&ndash;10x brighter than a
          well-lit indoor room.
        </li>
      </ul>

      <h2>What the evidence shows</h2>
      <p>
        Multiple cohort studies and a smaller number of randomized trials have shown that increasing daily outdoor
        time in children reduces the incidence of new myopia by roughly 30&ndash;50%. The largest effect sizes
        come from studies in Taiwan, Singapore, and Australia, where targeted outdoor-time school interventions
        have been implemented at scale.
      </p>
      <p>
        Once myopia has already developed, outdoor time slows further progression but does not reverse it. Earlier
        is better.
      </p>

      <h2>20-20-2 in practice: a real week</h2>
      <p>The 2-hour daily target is harder than it sounds in a school week. Some strategies that work:</p>
      <ul>
        <li>
          <strong>Bundle it with the commute.</strong> Walking or biking to and from school often covers 30&ndash;60
          minutes alone.
        </li>
        <li>
          <strong>Outdoor lunch + recess.</strong> Many schools have outdoor lunch areas; advocate for keeping
          recess outdoors year-round.
        </li>
        <li>
          <strong>Convert one indoor activity per day.</strong> Reading on the porch, calling a friend while
          walking the neighborhood, homework at a park bench.
        </li>
        <li>
          <strong>Make it a weekend default.</strong> If weekdays only get to 60&ndash;90 minutes, banking 3&ndash;4
          hours on Saturday and Sunday brings the weekly average up.
        </li>
        <li>
          <strong>Layer it with the 20-20-20 timer.</strong> Indoor screen time still benefits from the standard
          break protocol &mdash; use the free <a href="/en">EYE CARE timer</a> for those sessions.
        </li>
      </ul>

      <h2>What about UV exposure?</h2>
      <p>
        Sunlight is the active ingredient, but UV protection still matters. Sunglasses with UV400 protection are
        recommended for prolonged outdoor time, especially during midday hours in summer. Tinted lenses still
        admit enough light to trigger the dopamine pathway &mdash; you don&rsquo;t need to stare into the bare sun
        to get the protective effect.
      </p>

      <h2>For parents: the realistic goal</h2>
      <p>
        Aiming for a perfect 2-hour daily target sets you up to give up. Aim for <strong>directionally
        more</strong> than your child currently gets. If they&rsquo;re at 30 minutes outdoors per day, doubling to
        60 minutes is meaningful. If they&rsquo;re at 90, getting consistently above 2 hours is the gold
        standard.
      </p>
      <p>
        Combined with a comprehensive yearly eye exam and the 20-20-20 rule for indoor screen time, you&rsquo;ve
        covered the highest-evidence levers available. See also our breakdown of{' '}
        <a href="/learn/20-20-20-rule-for-kids">the 20-20-20 rule for kids</a> and the research on{' '}
        <a href="/learn/does-the-20-20-20-rule-work">whether 20-20-20 actually works</a>.
      </p>
    </ArticleLayout>
  );
}
