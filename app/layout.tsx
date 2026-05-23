import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EYE CARE - 20-20-20 Rule Timer | Protect Your Vision",
  description: "Free eye care app using the 20-20-20 rule. Available in 12 languages. Protect your vision from digital eye strain.",
  keywords: "eye care, 20-20-20 rule, eye strain, digital eye strain, eye health, vision protection, free app",
  authors: [{ name: "Sho Kawamoto" }],
  creator: "Sho Kawamoto",
  publisher: "EYE CARE",
  applicationName: "EYE CARE",
  metadataBase: new URL('https://eyecare.love'),
  openGraph: {
    title: "EYE CARE - Protect Your Vision",
    description: "Free eye care app using the 20-20-20 rule. Take regular breaks to protect your eyes from digital strain.",
    url: 'https://eyecare.love',
    siteName: 'EYE CARE',
    images: [
      {
        url: 'https://eyecare.love/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'EYE CARE - 20-20-20 Rule Timer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EYE CARE - 20-20-20 Rule Timer',
    description: 'Free eye care app. Protect your vision from digital eye strain.',
    creator: '@K8292288065827',
    images: ['https://eyecare.love/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE", // Google Search Console
    other: {
      "google-adsense-account": "ca-pub-6158728857323077", // Google AdSense
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-6158728857323077" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6158728857323077"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
