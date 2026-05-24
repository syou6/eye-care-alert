import type { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

const meta = {
  title: 'Dry Eye from Screens: Why It Happens and What Actually Helps',
  description:
    'Screens drop your blink rate by about 60%, which is the root cause of most digital dry-eye symptoms. Here is the practical hierarchy of interventions, from free to clinical.',
  slug: 'dry-eye-from-screens',
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
        If your eyes feel gritty, burning, or scratchy by the end of a long screen day, you are
        almost certainly experiencing screen-induced dry eye. It is one of the most common
        chronic complaints in modern office workers and one of the easiest to address
        progressively, from free behavior changes up to clinical treatment.
      </p>

      <h2>Why screens dry your eyes</h2>
      <p>
        The mechanism is straightforward and well-documented:
      </p>
      <ul>
        <li>
          A normal resting blink rate is roughly 15 blinks per minute. During focused screen use,
          that drops to 5-7, sometimes lower.
        </li>
        <li>
          Each blink spreads the tear film across the cornea. Without it, the tear film
          evaporates within seconds, exposing the cornea.
        </li>
        <li>
          Exposed cornea triggers the burning, gritty, scratchy sensation that people describe
          as "screen fatigue" but is actually evaporative dry eye.
        </li>
      </ul>

      <h2>What makes it worse</h2>
      <ul>
        <li><strong>Air conditioning and central heating</strong> that blow on your face</li>
        <li><strong>Contact lens wear</strong> &mdash; lenses interfere with tear film stability</li>
        <li><strong>Age</strong> &mdash; tear production declines steadily after 40</li>
        <li><strong>Medications</strong> &mdash; antihistamines, antidepressants, blood pressure drugs, diuretics, and hormonal contraceptives all reduce tear production</li>
        <li><strong>Hormonal changes</strong> &mdash; pregnancy, menopause</li>
        <li><strong>Autoimmune conditions</strong> &mdash; Sjögren&rsquo;s syndrome, rheumatoid arthritis, lupus</li>
        <li><strong>Dehydration</strong> &mdash; if you forget to drink water for hours, your eyes pay first</li>
      </ul>

      <h2>The practical fix list (free to clinical)</h2>
      <h3>1. Conscious blinking + 20-20-20 breaks (free)</h3>
      <p>
        Every 20 minutes, look at something at least 20 feet away for 20 seconds, and
        consciously blink several times during the break. This restores the tear film and lets
        the cornea re-wet. The free <a href="/en">EYE CARE timer</a> handles the cadence.
      </p>

      <h3>2. Environmental fixes (free)</h3>
      <ul>
        <li>Point AC vents and heaters away from your face.</li>
        <li>Use a desk-side humidifier if your office runs dry (under 30% humidity is rough on tear film).</li>
        <li>Lower your monitor slightly so your eyes look more downward, exposing less corneal surface.</li>
        <li>Take contact lenses out for the last hour of screen work if you can.</li>
      </ul>

      <h3>3. Hydration (free)</h3>
      <p>
        Drink water through the day. Tear production is responsive to systemic hydration; a
        chronically dehydrated body is a chronically dry-eyed body. Keep a glass within reach
        and refill it twice during the workday.
      </p>

      <h3>4. Preservative-free artificial tears ($10-20/month)</h3>
      <p>
        Over-the-counter preservative-free artificial tears (single-use vials are best) restore
        tear film mid-day. Look for "preservative-free" specifically &mdash; preservatives in
        multi-use bottles can themselves irritate the cornea with chronic use. One to two drops
        in each eye, two to four times daily as needed.
      </p>

      <h3>5. Warm compresses ($0-30)</h3>
      <p>
        Apply a warm compress to closed eyes for 5-10 minutes daily. This helps the meibomian
        glands (the tiny glands along the lid margin that secrete the oily component of the
        tear film) function properly. Many cases of screen-related dry eye are actually
        meibomian gland dysfunction, and warm compresses are the first-line treatment.
      </p>

      <h3>6. Comprehensive dry eye exam ($)</h3>
      <p>
        If the above does not produce noticeable improvement within 4-6 weeks, see an
        optometrist or ophthalmologist for a dry eye evaluation. They can measure tear film
        stability (TBUT), tear production (Schirmer test), and meibomian gland health, and
        prescribe targeted treatment.
      </p>

      <h3>7. Clinical treatment ($$)</h3>
      <p>
        If clinical evaluation confirms chronic dry eye, treatments range from prescription
        anti-inflammatory drops (Restasis, Cequa, Xiidra) to in-office procedures (LipiFlow,
        IPL, punctal plugs) to autologous serum drops in severe cases. None of this is necessary
        for most screen-related dry eye, but the option exists.
      </p>

      <h2>When to see a doctor sooner rather than later</h2>
      <ul>
        <li>Burning or gritty sensation that persists overnight</li>
        <li>Vision blurs that resolves with a blink (a classic tear-film instability sign)</li>
        <li>Eyes that look noticeably red most days</li>
        <li>Light sensitivity that is new or worsening</li>
        <li>Discomfort with contact lenses you previously tolerated</li>
      </ul>

      <p>
        Dry eye from screens is one of the conditions where progressive escalation works really
        well. Start with breaks and conscious blinking, add artificial tears if needed, see a
        doctor if those do not move the needle. Most people resolve at step 1 or 2.
      </p>
    </ArticleLayout>
  );
}
