import { notFound } from 'next/navigation';
import EyeCareGlobal from '@/components/EyeCareGlobal';
import { isLanguage, SUPPORTED_LANGS } from '@/lib/i18n';

export const dynamicParams = false;

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export default async function LangHome({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return <EyeCareGlobal initialLanguage={lang} />;
}
