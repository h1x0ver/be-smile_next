import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Lang = 'en' | 'ru' | 'az';

type ServiceCardItem = {
  label: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  imagePosition?: string;
};

const COPY: Record<
  Lang,
  {
    eyebrow: string;
    title: string;
    allServices: string;
    allServicesHref: string;
    cards: {
      diagnostics: ServiceCardItem;
      veneers: ServiceCardItem;
    };
  }
> = {
  en: {
    eyebrow: 'Services',
    title: 'Core Services',
    allServices: 'All Services',
    allServicesHref: '/en/services',
    cards: {
      diagnostics: {
        label: 'Diagnostics',
        title: 'Diagnostics',
        subtitle: 'Precision-led treatment planning',
        href: '/en/services/diagnostics',
        image: '/diagnostika.png',
        imagePosition: 'center center',
      },
      veneers: {
        label: 'Veneers',
        title: 'Veneers',
        subtitle: 'Refined aesthetic smile design',
        href: '/en/services/veneers',
        image: '/vinir.png',
        imagePosition: 'center center',
      },
    },
  },

  ru: {
    eyebrow: 'Услуги',
    title: 'Основные услуги',
    allServices: 'Все услуги',
    allServicesHref: '/ru/services',
    cards: {
      diagnostics: {
        label: 'Диагностика',
        title: 'Диагностика',
        subtitle: 'Точное планирование лечения',
        href: '/ru/services/diagnostics',
        image: '/diagnostika.png',
        imagePosition: 'center center',
      },
      veneers: {
        label: 'Виниры',
        title: 'Виниры',
        subtitle: 'Эстетика и дизайн улыбки',
        href: '/ru/services/veneers',
        image: '/vinir.png',
        imagePosition: 'center center',
      },
    },
  },

  az: {
    eyebrow: 'Xidmətlər',
    title: 'Əsas xidmətlər',
    allServices: 'Bütün xidmətlər',
    allServicesHref: '/az/services',
    cards: {
      diagnostics: {
        label: 'Diaqnostika',
        title: 'Diaqnostika',
        subtitle: 'Dəqiq müalicə planlaması',
        href: '/az/services/diagnostics',
        image: '/diagnostika.png',
        imagePosition: 'center center',
      },
      veneers: {
        label: 'Vinirlər',
        title: 'Vinirlər',
        subtitle: 'Estetik və təbii gülüş dizaynı',
        href: '/az/services/veneers',
        image: '/vinir.png',
        imagePosition: 'center center',
      },
    },
  },
};
function ArrowUpRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    >
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ServiceCard({ item }: { item: ServiceCardItem }) {
  return (
    <div className="motion-safe:transition-transform motion-safe:duration-500 motion-safe:hover:-translate-y-1">
      <Link
        href={item.href}
        className="group relative block overflow-hidden rounded-[28px] border border-white/60 bg-[#ece7dc] shadow-[0_18px_60px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_40px_100px_rgba(0,0,0,0.15)] sm:rounded-[32px]"
      >
      <div className="relative h-[360px] sm:h-[460px] lg:h-[620px]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          quality={78}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          style={{ objectPosition: item.imagePosition || 'center center' }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(20,20,20,0.08)_38%,rgba(10,10,10,0.52)_74%,rgba(10,10,10,0.78)_100%)]" />

        <div className="absolute inset-0">
          <div className="absolute left-[-8%] top-[-10%] h-[180px] w-[180px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.075),transparent)] scale-[1.6]" />
          <div className="absolute right-[-10%] bottom-[-14%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(closest-side,rgba(217,194,154,0.105),transparent)] scale-[1.6]" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-5 lg:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/20 px-3 py-2 ">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d5ba87]" />
              <span className="text-[9px] uppercase tracking-[0.28em] text-black/82">
                {item.label}
              </span>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/20 text-white transition-all duration-500 group-hover:bg-white group-hover:text-[#111111] sm:h-11 sm:w-11">
              <ArrowUpRightIcon />
            </div>
          </div>

          <div className="max-w-[85%] sm:max-w-[75%]">
            <div className="rounded-[22px] border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] p-4 sm:rounded-[24px] sm:p-5 lg:p-6">
              <h3 className="text-[22px] font-[300] uppercase leading-[0.95] tracking-[0.14em] text-white sm:text-[30px] lg:text-[42px]">
                {item.title}
              </h3>

              <div className="mt-3 h-px w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.34),rgba(255,255,255,0.08),transparent)]" />

              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-white/72 sm:text-[12px] lg:text-[13px]">
                {item.subtitle}
              </p>
            </div>
          </div>
        </div>
        </div>
      </Link>
    </div>
  );
}

export default function ServicesSection({ lang = 'az' }: { lang?: Lang }) {
  const copy = COPY[lang];

  return (
    <section className="relative overflow-hidden py-12 sm:py-14 lg:py-20">
      <div className="absolute inset-0 -z-10 bg-[#f8f6f1]" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-8%] top-[6%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.075),transparent)] scale-[1.6]" />
        <div className="absolute right-[-8%] top-[14%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(closest-side,rgba(238,227,207,0.488),transparent)] scale-[1.6]" />
      </div>

      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-[70px]">
        <div className="mb-5 sm:mb-6 lg:mb-8">
          <div className="relative overflow-hidden rounded-[24px] border border-white/60 bg-white/60 px-4 py-4 shadow-[0_14px_40px_rgba(0,0,0,0.05)] sm:rounded-[28px] sm:px-5 sm:py-5 lg:px-7 lg:py-6">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-[-8%] top-[-45%] h-[160px] w-[160px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.09),transparent)] scale-[1.6]" />
              <div className="absolute right-[-5%] top-[12%] h-[160px] w-[160px] rounded-full bg-[radial-gradient(closest-side,rgba(237,226,207,0.525),transparent)] scale-[1.6]" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.14))]" />
            </div>

            <div className="relative z-10 flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[520px]">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/78 px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c9ae7b]" />
                  <span className="text-[9px] uppercase tracking-[0.28em] text-black/45">
                    {copy.eyebrow}
                  </span>
                </div>

                <h2 className="mt-3 text-[20px] font-[300] uppercase leading-[1] tracking-[0.14em] text-[#111111] sm:text-[24px] lg:text-[30px]">
                  {copy.title}
                </h2>
              </div>

              <Link href={copy.allServicesHref} className="w-full sm:w-auto">
                <Button className="w-full rounded-full border border-[#111111] bg-[#111111] px-5 py-4 text-[9px] uppercase tracking-[0.28em] text-white shadow-[0_12px_30px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-black sm:w-auto">
                  {copy.allServices}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
          <ServiceCard item={copy.cards.diagnostics} />
          <ServiceCard item={copy.cards.veneers} />
        </div>
      </div>
    </section>
  );
}
