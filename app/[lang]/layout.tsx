import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  SUPPORTED_LANGS,
  LANG_TO_LOCALE,
  LANG_TO_HREFLANG,
  isLanguage,
  DEFAULT_LANG,
} from '@/lib/i18n';
import { translations } from '@/lib/translations';

const SITE_URL = 'https://eyecare.love';

const PER_LANG_DESCRIPTION: Record<string, string> = {
  en: 'Free online 20-20-20 rule timer to protect your eyes from digital strain. Take a 20-second break every 20 minutes to look at something 20 feet away.',
  ja: '無料のオンライン20-20-20ルールタイマー。20分ごとに20秒間、6メートル先を見て目のデジタル疲労を防ぎましょう。',
  zh: '免费的在线20-20-20法则计时器。每20分钟休息20秒,远眺6米外的物体,保护视力免受数字疲劳。',
  ko: '무료 온라인 20-20-20 규칙 타이머. 20분마다 20초씩 6미터 떨어진 곳을 바라보고 디지털 안구피로를 예방하세요.',
  es: 'Temporizador gratuito de la regla 20-20-20 para proteger tus ojos de la fatiga visual digital. Cada 20 minutos, mira algo a 6 metros durante 20 segundos.',
  fr: 'Minuteur gratuit en ligne pour la règle 20-20-20 contre la fatigue oculaire numérique. Toutes les 20 minutes, regardez à 6 mètres pendant 20 secondes.',
  de: 'Kostenloser Online-Timer für die 20-20-20-Regel gegen digitale Augenermüdung. Alle 20 Minuten 20 Sekunden in 6 Meter Entfernung schauen.',
  pt: 'Cronômetro online gratuito da regra 20-20-20 para proteger seus olhos da fadiga visual digital. A cada 20 minutos, olhe para algo a 6 metros por 20 segundos.',
  ru: 'Бесплатный онлайн-таймер правила 20-20-20 для защиты глаз от цифрового напряжения. Каждые 20 минут смотрите 20 секунд на объект в 6 метрах.',
  ar: 'مؤقت مجاني عبر الإنترنت لقاعدة 20-20-20 لحماية عينيك من إجهاد الشاشات. كل 20 دقيقة، انظر إلى شيء على بعد 6 أمتار لمدة 20 ثانية.',
  hi: '20-20-20 नियम का मुफ्त ऑनलाइन टाइमर डिजिटल आँखों के तनाव से बचाव के लिए। हर 20 मिनट में 20 सेकंड के लिए 6 मीटर दूर देखें।',
  it: 'Timer online gratuito per la regola 20-20-20 contro l\'affaticamento visivo digitale. Ogni 20 minuti, guarda qualcosa a 6 metri per 20 secondi.',
};

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  if (!isLanguage(rawLang)) return {};
  const lang = rawLang;
  const t = translations[lang];
  const title = `${t.title} — ${t.subtitle}`;
  const description = PER_LANG_DESCRIPTION[lang] ?? PER_LANG_DESCRIPTION[DEFAULT_LANG];

  const alternates: Record<string, string> = {};
  for (const code of SUPPORTED_LANGS) {
    alternates[LANG_TO_HREFLANG[code]] = `${SITE_URL}/${code}`;
  }
  alternates['x-default'] = `${SITE_URL}/${DEFAULT_LANG}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}`,
      siteName: 'EYE CARE',
      locale: LANG_TO_LOCALE[lang],
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return <>{children}</>;
}
