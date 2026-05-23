import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import PWAInstaller from "@/components/PWAInstaller";
import { DEFAULT_LANG, isLanguage } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-6158728857323077";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-5EEDHCB7VD";
const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION;
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN; // e.g. "eyecare.love"
const PLAUSIBLE_SRC =
  process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? "https://plausible.io/js/script.js";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export const metadata: Metadata = {
  title: "EYE CARE - 20-20-20 Rule Timer | Protect Your Vision",
  description:
    "Free eye care app using the 20-20-20 rule. Available in 12 languages. Protect your vision from digital eye strain.",
  keywords:
    "eye care, 20-20-20 rule, eye strain, digital eye strain, eye health, vision protection, free app",
  authors: [{ name: "Sho Kawamoto" }],
  creator: "Sho Kawamoto",
  publisher: "EYE CARE",
  applicationName: "EYE CARE",
  metadataBase: new URL("https://eyecare.love"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EYE CARE - Protect Your Vision",
    description:
      "Free eye care app using the 20-20-20 rule. Take regular breaks to protect your eyes from digital strain.",
    url: "https://eyecare.love",
    siteName: "EYE CARE",
    images: [
      {
        url: "https://eyecare.love/opengraph-image",
        width: 1200,
        height: 630,
        alt: "EYE CARE - 20-20-20 Rule Timer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EYE CARE - 20-20-20 Rule Timer",
    description: "Free eye care app. Protect your vision from digital eye strain.",
    creator: "@K8292288065827",
    images: ["https://eyecare.love/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    ...(GSC_VERIFICATION ? { google: GSC_VERIFICATION } : {}),
    other: {
      "google-adsense-account": ADSENSE_CLIENT,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "EYE CARE",
  url: "https://eyecare.love",
  description:
    "Free 20-20-20 rule timer that helps prevent digital eye strain. Available in 12 languages.",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any (Web Browser)",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  inLanguage: ["en", "ja", "zh", "ko", "es", "fr", "de", "pt", "ru", "ar", "hi", "it"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Sho Kawamoto",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "/";
  const candidate = pathname.split("/")[1] ?? "";
  const lang = isLanguage(candidate) ? candidate : DEFAULT_LANG;
  const dir = lang === "ar" ? "rtl" : "ltr";
  return (
    <html lang={lang} dir={dir}>
      <head>
        <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <PWAInstaller />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        {PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={PLAUSIBLE_DOMAIN}
            src={PLAUSIBLE_SRC}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
