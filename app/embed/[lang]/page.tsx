import { notFound } from 'next/navigation';
import EmbedTimer from '@/components/EmbedTimer';
import { isLanguage, SUPPORTED_LANGS } from '@/lib/i18n';
import type { Metadata } from 'next';

export const dynamicParams = false;

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return <EmbedTimer lang={lang} />;
}
