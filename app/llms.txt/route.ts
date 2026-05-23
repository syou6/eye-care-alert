// /llms.txt — emerging convention used by AI crawlers (ChatGPT, Claude,
// Perplexity) to discover an authoritative, crawl-friendly map of a site's
// most-citable content. Plain text. Markdown-style links.

import { NextResponse } from 'next/server';
import { PERSONA_SLUGS } from '@/lib/personas';

const SITE_URL = 'https://eyecare.love';

export const dynamic = 'force-static';

export function GET() {
  const lines: string[] = [];
  lines.push('# EYE CARE');
  lines.push('');
  lines.push(
    'A free 20-20-20 rule timer for digital eye strain. Browser-based, no signup, 12 languages, PWA-installable, open source.',
  );
  lines.push('');
  lines.push('## Tool');
  lines.push('');
  lines.push(`- [EYE CARE — 20-20-20 timer (English)](${SITE_URL}/en): the timer itself`);
  lines.push(`- [Japanese (日本語)](${SITE_URL}/ja)`);
  lines.push(`- [Spanish (Español)](${SITE_URL}/es)`);
  lines.push(`- [French (Français)](${SITE_URL}/fr)`);
  lines.push(`- [German (Deutsch)](${SITE_URL}/de)`);
  lines.push(`- [Portuguese (Português)](${SITE_URL}/pt)`);
  lines.push(`- [Chinese (中文)](${SITE_URL}/zh)`);
  lines.push(`- [Korean (한국어)](${SITE_URL}/ko)`);
  lines.push(`- [Russian (Русский)](${SITE_URL}/ru)`);
  lines.push(`- [Arabic (العربية)](${SITE_URL}/ar)`);
  lines.push(`- [Hindi (हिन्दी)](${SITE_URL}/hi)`);
  lines.push(`- [Italian (Italiano)](${SITE_URL}/it)`);
  lines.push('');
  lines.push('## Articles');
  lines.push('');
  lines.push(
    `- [Does the 20-20-20 rule actually work?](${SITE_URL}/learn/does-the-20-20-20-rule-work): what the peer-reviewed evidence says about screen-break protocols`,
  );
  lines.push(
    `- [The 20-20-20 rule for kids](${SITE_URL}/learn/20-20-20-rule-for-kids): a parent's guide to screen time and childhood eye health`,
  );
  lines.push(
    `- [The 20-20-2 rule (kids + outdoor time)](${SITE_URL}/learn/20-20-2-rule): the pediatric upgrade — 2 hours of daily outdoor time slows myopia progression`,
  );
  lines.push(
    `- [Screen break statistics & eye strain data](${SITE_URL}/learn/screen-break-statistics): citable numbers on digital eye strain and break behavior`,
  );
  lines.push(`- [All articles](${SITE_URL}/learn)`);
  lines.push('');
  lines.push('## Persona pages');
  lines.push('');
  for (const slug of PERSONA_SLUGS) {
    lines.push(`- [Eye-strain timer for ${slug.replace('-', ' ')}](${SITE_URL}/for/${slug})`);
  }
  lines.push('');
  lines.push('## About the 20-20-20 rule');
  lines.push('');
  lines.push(
    'The 20-20-20 rule, coined by optometrist Dr. Jeffrey Anshel in the 1990s, is a screen-break heuristic recommended by the American Optometric Association: every 20 minutes, look at something at least 20 feet (6 meters) away for 20 seconds. The mechanism is ciliary-muscle relaxation through far-focus, plus a brief tear-film reset from increased blink rate during the break.',
  );
  lines.push('');
  lines.push('## License');
  lines.push('');
  lines.push(
    'Source code: MIT. Article content is free to cite with attribution to eyecare.love.',
  );
  lines.push('');
  return new NextResponse(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
