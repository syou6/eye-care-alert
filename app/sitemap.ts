import type { MetadataRoute } from 'next';
import { SUPPORTED_LANGS, LANG_TO_HREFLANG, DEFAULT_LANG } from '@/lib/i18n';
import { PERSONA_SLUGS } from '@/lib/personas';

const BASE_URL = 'https://eyecare.love';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const languageAlternates = Object.fromEntries(
    SUPPORTED_LANGS.map((lang) => [LANG_TO_HREFLANG[lang], `${BASE_URL}/${lang}`]),
  );
  languageAlternates['x-default'] = `${BASE_URL}/${DEFAULT_LANG}`;

  const homeEntries: MetadataRoute.Sitemap = SUPPORTED_LANGS.map((lang) => ({
    url: `${BASE_URL}/${lang}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: lang === DEFAULT_LANG ? 1 : 0.9,
    alternates: { languages: languageAlternates },
  }));

  const articleSlugs = [
    '20-20-20-rule-for-kids',
    'does-the-20-20-20-rule-work',
    '20-20-2-rule',
    'screen-break-statistics',
  ];
  const articleEntries: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${BASE_URL}/learn/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const learnHubEntry: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/learn`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const personaEntries: MetadataRoute.Sitemap = PERSONA_SLUGS.map((slug) => ({
    url: `${BASE_URL}/for/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...homeEntries, ...learnHubEntry, ...articleEntries, ...personaEntries];
}
