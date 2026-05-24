import type { MetadataRoute } from 'next';
import { SUPPORTED_LANGS, LANG_TO_HREFLANG, DEFAULT_LANG } from '@/lib/i18n';
import { PERSONA_SLUGS } from '@/lib/personas';
import { GLOSSARY_SLUGS } from '@/lib/glossary';
import { COMPARISON_SLUGS } from '@/lib/comparisons';

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
    'computer-vision-syndrome',
    'best-monitor-distance',
    'blue-light-glasses-vs-20-20-20',
    'dark-mode-and-eye-strain',
    'dry-eye-from-screens',
    'eye-strain-headaches',
  ];
  const articleSlugsWithJP = new Set([
    '20-20-20-rule-for-kids',
    'does-the-20-20-20-rule-work',
    '20-20-2-rule',
    'screen-break-statistics',
  ]);
  const articleEntries: MetadataRoute.Sitemap = articleSlugs.flatMap((slug) => {
    const hasJP = articleSlugsWithJP.has(slug);
    const articleAlternates = hasJP
      ? {
          en: `${BASE_URL}/learn/${slug}`,
          ja: `${BASE_URL}/ja/learn/${slug}`,
          'x-default': `${BASE_URL}/learn/${slug}`,
        }
      : undefined;
    const entries: MetadataRoute.Sitemap = [
      {
        url: `${BASE_URL}/learn/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        ...(articleAlternates ? { alternates: { languages: articleAlternates } } : {}),
      },
    ];
    if (hasJP) {
      entries.push({
        url: `${BASE_URL}/ja/learn/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        alternates: { languages: articleAlternates! },
      });
    }
    return entries;
  });

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

  const utilityEntries: MetadataRoute.Sitemap = ['about', 'privacy', 'terms'].map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.4,
  }));

  const glossaryHubEntry: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/glossary`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
  const glossaryEntries: MetadataRoute.Sitemap = GLOSSARY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/glossary/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.55,
  }));

  const vsEntries: MetadataRoute.Sitemap = COMPARISON_SLUGS.map((slug) => ({
    url: `${BASE_URL}/vs/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    ...homeEntries,
    ...learnHubEntry,
    ...articleEntries,
    ...personaEntries,
    ...glossaryHubEntry,
    ...glossaryEntries,
    ...vsEntries,
    ...utilityEntries,
  ];
}
