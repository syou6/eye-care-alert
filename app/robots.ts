import type { MetadataRoute } from 'next';

const BASE_URL = 'https://eyecare.love';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: open to all crawlers.
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/embed/'],
      },
      // Explicit allow for the major AI crawlers — keeps EYE CARE indexable
      // and citable by AI search engines.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
