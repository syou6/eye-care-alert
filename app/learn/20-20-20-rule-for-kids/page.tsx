import type { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

const meta = {
  title: 'The 20-20-20 Rule for Kids: A Parent\'s Guide to Screen Time and Eye Health',
  description:
    'Children are spending more time on screens than ever. Here\'s how the 20-20-20 rule (and the 20-20-2 variant) helps protect young eyes from digital strain and slows myopia progression.',
  slug: '20-20-20-rule-for-kids',
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
        If your child spends hours on a tablet, laptop, or Chromebook each day, you&rsquo;re not alone &mdash; and
        you&rsquo;re right to be paying attention. Pediatric eye doctors have flagged a sharp rise in screen-related
        eye strain and a generation-wide acceleration of myopia (nearsightedness). The good news: a simple,
        evidence-backed habit can make a real difference.
      </p>

      <h2>What is the 20-20-20 rule?</h2>
      <p>
        Coined by California optometrist Dr. Jeffrey Anshel in the 1990s, the 20-20-20 rule says:{' '}
        <strong>every 20 minutes, look at something at least 20 feet away for 20 seconds.</strong> The American
        Optometric Association (AOA) has long recommended it as a baseline habit for anyone using digital screens.
      </p>
      <p>
        It works because focusing on something far away forces the ciliary muscle inside the eye to relax. After
        20 continuous minutes of close focus, that muscle is fatigued &mdash; the source of the burning, tired
        feeling many kids describe as &ldquo;sore eyes.&rdquo;
      </p>

      <h2>Why kids need it more than adults</h2>
      <ul>
        <li>
          <strong>Their eyes are still developing.</strong> Up to about age 12, the eye is actively elongating.
          Prolonged close-up focus during this window is one of the strongest known risk factors for myopia
          progression.
        </li>
        <li>
          <strong>They blink less.</strong> Adults blink about 15 times a minute. Kids absorbed in a video or game
          can drop to 4&ndash;5, drying out the tear film and irritating the cornea.
        </li>
        <li>
          <strong>They don&rsquo;t self-report.</strong> A child rarely says &ldquo;my eyes hurt because the focal
          distance is too close.&rdquo; They just get cranky, rub their eyes, or stop paying attention.
        </li>
      </ul>

      <h2>How to actually make it stick</h2>
      <p>
        Telling a focused 8-year-old to &ldquo;look away every 20 minutes&rdquo; without a system will not work.
        Three things that do:
      </p>
      <ol>
        <li>
          <strong>Use a timer they can see.</strong> A visible countdown is much more effective than an abstract
          rule. The free{' '}
          <a href="/en">20-20-20 timer</a> handles the cadence and shows a 20-second break overlay automatically.
        </li>
        <li>
          <strong>Give them something specific to look at.</strong> &ldquo;Look out the window and count three
          birds&rdquo; works better than &ldquo;look at something far.&rdquo;
        </li>
        <li>
          <strong>Pair it with a posture reset.</strong> Have them stand up, stretch, and take 3 breaths during the
          20 seconds. It tackles the slouch problem at the same time.
        </li>
      </ol>

      <h2>The upgrade: 20-20-2</h2>
      <p>
        For school-age children, leading pediatric eye-care groups now recommend layering an additional rule on
        top: <strong>at least 2 hours of outdoor time every day.</strong> Sunlight exposure is one of the few
        interventions with strong evidence for slowing myopia progression in kids. The 20-20-20 rule manages
        short-term eye strain; the &ldquo;2&rdquo; protects long-term vision development. See our deep dive on the{' '}
        <a href="/learn/20-20-2-rule">20-20-2 rule</a> for the research and how to fit it into a school week.
      </p>

      <h2>Warning signs that screen time is hurting your child&rsquo;s eyes</h2>
      <ul>
        <li>Squinting at the TV or whiteboard at school</li>
        <li>Eye rubbing, especially after homework or gaming</li>
        <li>Headaches in the late afternoon or evening</li>
        <li>Moving devices closer and closer to the face</li>
        <li>Avoiding reading or written homework</li>
      </ul>
      <p>
        Any of these warrant a pediatric eye exam &mdash; not a Google search. Early intervention (the right
        glasses, a myopia-management plan, or just better screen habits) prevents bigger problems later.
      </p>

      <h2>A realistic daily plan</h2>
      <ul>
        <li><strong>Homework / iPad time:</strong> 20-20-20 timer running in a corner of the screen</li>
        <li><strong>After school:</strong> 2 hours outside (or as close as weather allows)</li>
        <li><strong>Before bed:</strong> Screens off 30 minutes before lights out</li>
        <li><strong>Yearly:</strong> Comprehensive eye exam &mdash; not just a school vision screening</li>
      </ul>
      <p>
        The 20-20-20 rule is not a cure. It&rsquo;s a low-friction habit that, paired with outdoor time and regular
        eye exams, gives your child&rsquo;s eyes the best shot at developing well in a screen-heavy world.
      </p>
    </ArticleLayout>
  );
}
