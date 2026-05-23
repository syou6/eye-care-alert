import { languages, type Language } from './translations';

export const SUPPORTED_LANGS = languages.map((l) => l.code) as readonly Language[];
export const DEFAULT_LANG: Language = 'en';

export const LANG_TO_LOCALE: Record<Language, string> = {
  en: 'en_US',
  ja: 'ja_JP',
  zh: 'zh_CN',
  ko: 'ko_KR',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  pt: 'pt_BR',
  ru: 'ru_RU',
  ar: 'ar_SA',
  hi: 'hi_IN',
  it: 'it_IT',
};

// hreflang values (e.g., 'ja' or 'pt-BR')
export const LANG_TO_HREFLANG: Record<Language, string> = {
  en: 'en',
  ja: 'ja',
  zh: 'zh-CN',
  ko: 'ko',
  es: 'es',
  fr: 'fr',
  de: 'de',
  pt: 'pt-BR',
  ru: 'ru',
  ar: 'ar',
  hi: 'hi',
  it: 'it',
};

export function isLanguage(value: string): value is Language {
  return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

export function detectLanguageFromAcceptLanguage(header: string | null | undefined): Language {
  if (!header) return DEFAULT_LANG;
  // Parse Accept-Language header (e.g., "ja,en-US;q=0.9,en;q=0.8")
  const candidates = header
    .split(',')
    .map((part) => part.split(';')[0].trim().toLowerCase());
  for (const candidate of candidates) {
    const base = candidate.split('-')[0];
    if (isLanguage(base)) return base;
  }
  return DEFAULT_LANG;
}
