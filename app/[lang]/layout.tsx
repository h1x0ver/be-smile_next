import "../globals.css";
import { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LayoutClientComponents } from '../../components/LayoutClientComponents';
import { getNavServiceGroups } from '@/lib/navigation';
import PageLoader from '@/components/PageLoader';
import NavigationWarmup from '@/components/NavigationWarmup.client';
import { INTRO_BOOTSTRAP } from '@/lib/intro';
import { notFound } from 'next/navigation';

type Lang = 'ru' | 'en' | 'az';

const LANGS: Lang[] = ['az', 'ru', 'en'];
const SITE_URL = 'https://besmile.az';

function normalizeLang(lang?: string): Lang {
  if (lang === 'ru' || lang === 'en' || lang === 'az') return lang;
  return 'az';
}

// Prerender every language at build time; pages are then served from cache (ISR)
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#f8f6f1',
};

const DEFAULT_SEO: Record<Lang, { title: string; description: string }> = {
  ru: {
    title: 'Стоматология в Баку | BeSmile Dental Clinic',
    description:
      'Стоматология в Баку BeSmile Dental Clinic: лечение зубов, имплантация, виниры, коронки, отбеливание и эстетическая стоматология.',
  },
  en: {
    title: 'Dentist in Baku | BeSmile Dental Clinic',
    description:
      'BeSmile Dental Clinic in Baku: dental treatment, implants, veneers, crowns, whitening and cosmetic dentistry.',
  },
  az: {
    title: 'Bakıda stomatologiya | BeSmile Dental Clinic',
    description:
      'BeSmile Dental Clinic Bakıda: diş müalicəsi, implantasiya, vinirlər, qapaqlar, ağartma və estetik stomatologiya.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = normalizeLang(lang);
  const seo = DEFAULT_SEO[safeLang];

  // Pages override these; this is the fallback for pages without their own metadata
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.title,
      template: '%s',
    },
    description: seo.description,
    applicationName: 'BeSmile Dental Clinic',
    icons: {
      icon: [
        { url: '/favicon.ico?v=tooth-1', type: 'image/x-icon' },
        { url: '/icon.svg?v=tooth-1', type: 'image/svg+xml', sizes: 'any' },
      ],
      shortcut: '/favicon.ico?v=tooth-1',
      apple: { url: '/apple-icon.png?v=tooth-1', sizes: '180x180', type: 'image/png' },
    },
    authors: [{ name: 'BeSmile Dental Clinic', url: SITE_URL }],
    creator: 'BeSmile Dental Clinic',
    publisher: 'BeSmile Dental Clinic',
    formatDetection: { telephone: true, address: true, email: true },
    openGraph: {
      type: 'website',
      siteName: 'BeSmile Dental Clinic',
      locale: safeLang === 'ru' ? 'ru_RU' : safeLang === 'az' ? 'az_AZ' : 'en_US',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: seo.title }],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/og-image.jpg'],
    },
    other: {
      'geo.region': 'AZ-BA',
      'geo.placename': 'Baku',
      'geo.position': '40.397694;49.836185',
      ICBM: '40.397694, 49.836185',
    },
  };
}

// 🎨 Skeleton Fallback для Footer

// 🎯 Root layout (one per language, so <html lang> is always correct)
export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const safeLang = normalizeLang(lang);
  if (!LANGS.includes(lang as Lang)) notFound();
  const serviceGroups = await getNavServiceGroups(safeLang);

  return (
    <html lang={safeLang} className="font-manrope" suppressHydrationWarning>
      <head>
        <script id="besmile-intro-bootstrap" dangerouslySetInnerHTML={{ __html: INTRO_BOOTSTRAP }} />
        <link rel="preload" href="/fonts/a343f882a40d2cc9-s.p.07ce798a.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {safeLang === "ru" && <link rel="preload" href="/fonts/d3fe2f289711ac3f-s.p.5cf2134c.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />}
        {safeLang === "az" && <link rel="preload" href="/fonts/6ab0db14f70d8ed6-s.p.7d02fb04.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />}
        {/* Doctor / case photos are loaded straight from the CMS */}
        <link rel="preconnect" href="https://portal.besmile.az" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body>
        <PageLoader lang={safeLang} />
        <Header lang={safeLang} serviceGroups={serviceGroups} />
        <main className="min-h-screen overflow-x-clip">{children}</main>
        <Footer lang={safeLang} />
        <LayoutClientComponents />
        <NavigationWarmup />

        {/* Google Ads — loads when the browser is idle, never blocks rendering */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-305152670"
          strategy="lazyOnload"
        />
        <Script id="google-ads-gtag" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-305152670');
          `}
        </Script>
      </body>
    </html>
  );
}
