
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Phone, Mail, Clock3, Facebook } from "lucide-react";

type Lang = "ru" | "en" | "az";

const T = {
  badge: {
    en: "PREMIUM DENTAL CLINIC",
    ru: "ПРЕМИАЛЬНАЯ СТОМАТОЛОГИЯ",
    az: "PREMIUM STOMATOLOJİ KLİNİKA",
  },
  title: {
    en: "A confident smile begins with the right care.",
    ru: "Уверенная улыбка начинается с правильной заботы.",
    az: "İnamlı gülüş düzgün qayğı ilə başlayır.",
  },
  description: {
    en: "BeSmile combines modern dentistry, aesthetic precision, and attentive care to create a refined patient experience in Baku.",
    ru: "BeSmile объединяет современную стоматологию, эстетическую точность и внимательное отношение, создавая премиальный опыт для пациентов в Баку.",
    az: "BeSmile Bakıda müasir stomatologiyanı, estetik dəqiqliyi və diqqətli yanaşmanı birləşdirərək premium pasiyent təcrübəsi yaradır.",
  },

  navTitle: {
    en: "Navigation",
    ru: "Навигация",
    az: "Naviqasiya",
  },
  servicesTitle: {
    en: "Services",
    ru: "Услуги",
    az: "Xidmətlər",
  },
  contactTitle: {
    en: "Contact",
    ru: "Контакты",
    az: "Əlaqə",
  },

  nav: {
    en: [
      { label: "Home", href: "" },
      { label: "About", href: "/about" },
      { label: "Doctors", href: "/doctors" },
      { label: "Before / After", href: "/before-after" },
      { label: "Prices", href: "/prices" },
      { label: "Contact", href: "/contact" },
    ],
    ru: [
      { label: "Главная", href: "" },
      { label: "О нас", href: "/about" },
      { label: "Врачи", href: "/doctors" },
      { label: "Before / After", href: "/before-after" },
      { label: "Цены", href: "/prices" },
      { label: "Контакты", href: "/contact" },
    ],
    az: [
      { label: "Əsas səhifə", href: "" },
      { label: "Haqqımızda", href: "/about" },
      { label: "Həkimlər", href: "/doctors" },
      { label: "Before / After", href: "/before-after" },
      { label: "Qiymətlər", href: "/prices" },
      { label: "Əlaqə", href: "/contact" },
    ],
  },

  services: {
    en: [
      "General Dentistry",
      "Dental Hygiene",
      "Dental Surgery",
      "Cosmetic Dentistry",
      "Implantology",
    ],
    ru: [
      "Общая стоматология",
      "Гигиена зубов",
      "Стоматологическая хирургия",
      "Косметическая стоматология",
      "Имплантология",
    ],
    az: [
      "Ümumi stomatologiya",
      "Diş gigiyenası",
      "Diş cərrahiyyəsi",
      "Kosmetik stomatologiya",
      "İmplantologiya",
    ],
  },

  cta: {
    en: "Book an appointment",
    ru: "Записаться",
    az: "Qəbula yazıl",
  },
  explore: {
    en: "Explore clinic",
    ru: "О клинике",
    az: "Klinika haqqında",
  },

  addressLabel: {
    en: "Address",
    ru: "Адрес",
    az: "Ünvan",
  },
  phoneLabel: {
    en: "Phone",
    ru: "Телефон",
    az: "Telefon",
  },
  emailLabel: {
    en: "Email",
    ru: "Email",
    az: "Email",
  },
  hoursLabel: {
    en: "Hours",
    ru: "Часы работы",
    az: "İş saatları",
  },

  address: {
    en: "24 Khan Shushinski St., Baku",
    ru: "Баку, ул. Хана Шушинского, 24",
    az: "Bakı, Xan Şuşinski küçəsi, 24",
  },
  hours: {
    en: "Mon – Sat / 09:00 – 19:00",
    ru: "Пн – Сб / 09:00 – 19:00",
    az: "B.e. – Ş. / 09:00 – 19:00",
  },

  bottomText: {
    en: "Modern dentistry with precision, aesthetics, and care.",
    ru: "Современная стоматология с точностью, эстетикой и заботой.",
    az: "Dəqiqlik, estetika və qayğı ilə müasir stomatologiya.",
  },

  footerNote: {
    en: "Built for precision, aesthetics, and trust.",
    ru: "Создано для точности, эстетики и доверия.",
    az: "Dəqiqlik, estetika və etibar üçün yaradılıb.",
  },
} as const;
function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.768.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.787-1.48-1.76-1.653-2.058-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.496.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.273.297-1.04 1.015-1.04 2.479 0 1.463 1.064 2.877 1.213 3.075.149.198 2.095 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.414.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347Z"
      />
      <path
        fill="currentColor"
        d="M12.004 2.003a9.92 9.92 0 0 0-8.6 14.88L2 22l5.27-1.38a9.92 9.92 0 0 0 4.734 1.204h.004c5.514 0 9.995-4.482 9.995-9.996 0-2.668-1.04-5.176-2.93-7.066a9.93 9.93 0 0 0-7.07-2.759Zm.004 18.13h-.003a8.27 8.27 0 0 1-4.215-1.153l-.302-.18-3.127.819.835-3.05-.197-.313a8.273 8.273 0 0 1 1.276-10.532 8.275 8.275 0 0 1 5.726-2.364c4.56 0 8.271 3.711 8.271 8.272 0 4.56-3.712 8.271-8.264 8.271Z"
      />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.55a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z"
      />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M13.615 21v-8.03h2.692l.403-3.13h-3.095V7.84c0-.907.252-1.525 1.553-1.525H16.8V3.51c-.283-.038-1.254-.122-2.384-.122-2.358 0-3.973 1.439-3.973 4.08v2.372H7.77v3.13h2.673V21h3.172Z"
      />
    </svg>
  );
}

const cardBase =
  "relative overflow-hidden rounded-[28px] border border-white/70 bg-white/56 shadow-[0_18px_60px_rgba(17,17,17,0.06)]";

const labelClass =
  "text-[14px] uppercase tracking-[0.34em]  font-[400] font-sans";

const bodyClass =
  "font-sans text-[15px] leading-[1.65] tracking-[-0.012em] text-black/74";

const itemClass =
  "font-sans text-[15px] leading-[1.5] tracking-[-0.012em] text-black/76";

export default function Footer({ lang }: { lang: Lang }) {

  return (
    <footer data-home-footer className="relative overflow-hidden bg-[#f8f6f1] px-4 pb-6 pt-10 text-[#111111] font-sans sm:px-6 lg:px-10 lg:pt-14">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#f8f6f1_0%,#f5f1ea_36%,#f7f4ee_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(231,216,190,0.82),transparent_26%),radial-gradient(circle_at_86%_10%,rgba(198,166,113,0.24),transparent_24%),radial-gradient(circle_at_74%_78%,rgba(255,255,255,0.92),transparent_28%),radial-gradient(circle_at_18%_88%,rgba(224,210,183,0.42),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.65)_0%,rgba(255,255,255,0.06)_38%,rgba(255,255,255,0.34)_100%)]" />
        <div className="absolute -left-[8%] top-[4%] h-[260px] w-[260px] rounded-full bg-[radial-gradient(closest-side,rgba(234,220,194,0.525),transparent)] scale-[1.6]" />
        <div className="absolute right-[2%] top-[8%] h-[240px] w-[240px] rounded-full bg-[radial-gradient(closest-side,rgba(206,176,123,0.135),transparent)] scale-[1.6]" />
        <div className="absolute bottom-[-6%] left-[22%] h-[240px] w-[240px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.675),transparent)] scale-[1.6]" />
        <div className="absolute bottom-[0%] right-[12%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(closest-side,rgba(230,214,188,0.21),transparent)] scale-[1.6]" />
        <div className="absolute inset-0 opacity-[0.24] [background:radial-gradient(circle_at_center,rgba(255,255,255,0.36)_0,rgba(255,255,255,0)_62%)]" />
      </div>

      <div data-home-footer-container className="relative mx-auto max-w-[1520px]">
        <div className="relative overflow-hidden rounded-[34px] border border-white/12 bg-[#111111] px-6 py-7 shadow-[0_26px_90px_rgba(0,0,0,0.16)] sm:px-8 sm:py-8 lg:px-10 lg:py-9">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_22%,rgba(201,174,123,0.24),transparent_19%),radial-gradient(circle_at_16%_78%,rgba(255,255,255,0.08),transparent_22%),linear-gradient(90deg,rgba(255,255,255,0.02),transparent_32%,rgba(196,162,110,0.06)_100%)]" />
          <div className="relative z-10 grid gap-7 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 ">
                <span className="h-2 w-2 rounded-full bg-[#c9ae7b]" />
                <span className="font-sans text-[10px] uppercase tracking-[0.34em] text-white/62">
                  {T.badge[lang]}
                </span>
              </div>

              <h2 className="mt-5 max-w-[820px] text-balance font-sans text-[34px] font-[300] leading-[0.98] tracking-[-0.05em] text-white sm:text-[48px] lg:text-[62px]">
                {T.title[lang]}
              </h2>

              <p className="mt-4 max-w-[700px] font-sans text-[15px] font-[350] leading-[1.72] tracking-[-0.012em] text-white/68 sm:text-[15px] lg:text-[16px]">
                {T.description[lang]}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                href={`/${lang}/book-online`} prefetch={false}
                className="inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-white px-6 text-[14px] font-[500] tracking-[-0.01em] text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f2ede5]"
              >
                {T.cta[lang]}
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href={`/${lang}/about`}
                className="inline-flex h-[50px] items-center justify-center gap-2 rounded-full border border-white/12 bg-white px-6 text-[14px] font-[500] tracking-[-0.01em] text-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f2ede5]"
              >
                {T.explore[lang]}
              </Link>
            </div>
          </div>
        </div>

        <div data-home-footer-grid className="mt-5 grid gap-4 lg:grid-cols-[1.06fr_0.74fr_0.74fr_0.96fr]">
          <div className={`${cardBase} p-6 sm:p-7`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.72),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(217,199,162,0.1),transparent_30%)]" />
            <div className="relative z-10">
              <Image
                src="/logo2.svg"
                alt="BeSmile Logo"
                width={150}
                height={62}
                className="h-auto w-[136px]"
              />

              <div className="mt-5 h-px w-full bg-[linear-gradient(to_right,rgba(17,17,17,0.08),rgba(17,17,17,0.03))]" />

              <p className="mt-5 max-w-[360px] text-balance font-sans text-[17px] font-[300] leading-[1.58] tracking-[-0.024em] text-black/76 sm:text-[18px]">
                {T.bottomText[lang]}
              </p>

            <div className="mt-6 flex items-center gap-3">
  <Link
    href="https://wa.me/994704210204"
    target="_blank"
    aria-label="WhatsApp"
    className="group flex h-[46px] w-[46px] items-center justify-center rounded-full border border-black/8 bg-white/85 text-black/72 shadow-[0_8px_24px_rgba(17,17,17,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#111111] hover:text-white"
  >
    <WhatsAppIcon className="h-[18px] w-[18px]" />
  </Link>

  <Link
    href="https://www.instagram.com/besmile_dental/"
    target="_blank"
    aria-label="Instagram"
    className="group flex h-[46px] w-[46px] items-center justify-center rounded-full border border-black/8 bg-white/85 text-black/72 shadow-[0_8px_24px_rgba(17,17,17,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#111111] hover:text-white"
  >
    <InstagramIcon className="h-[18px] w-[18px]" />
  </Link>

  <Link
    href="https://www.facebook.com/p/BeSmile-Dental-Clinic-100057466744487"
    target="_blank"
    aria-label="Facebook"
    className="group flex h-[46px] w-[46px] items-center justify-center rounded-full border border-black/8 bg-white/85 text-black/72 shadow-[0_8px_24px_rgba(17,17,17,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#111111] hover:text-white"
  >
    <FacebookIcon className="h-[18px] w-[18px]" />
  </Link>
</div>
            </div>
          </div>

          <div className={`${cardBase} p-6 sm:p-7`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_38%)]" />
            <div className="relative z-10">
              <p className={labelClass}>{T.navTitle[lang]}</p>
              <div className="mt-5 h-px w-full bg-[linear-gradient(to_right,rgba(17,17,17,0.08),rgba(17,17,17,0.03))]" />

              <ul className="mt-5 space-y-3.5">
                {T.nav[lang].map((item) => (
                  <li key={item.href + item.label}>
                    <Link
                      href={`/${lang}${item.href}`}
                      className="group inline-flex items-center gap-2 font-sans text-[15px] font-[350] leading-[1.45] tracking-[-0.012em] text-black/76 transition-all duration-300 hover:text-black"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="h-4 w-4 translate-y-[1px] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`${cardBase} p-6 sm:p-7`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,199,162,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.72),transparent_36%)]" />
            <div className="relative z-10">
              <p className={labelClass}>{T.servicesTitle[lang]}</p>
              <div className="mt-5 h-px w-full bg-[linear-gradient(to_right,rgba(17,17,17,0.08),rgba(17,17,17,0.03))]" />

              <ul className="mt-5 space-y-3.5">
                {T.services[lang].map((service) => (
                  <li key={service} className={itemClass}>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`${cardBase} p-6 sm:p-7`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.72),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(217,199,162,0.12),transparent_30%)]" />
            <div className="relative z-10">
              <p className={labelClass}>{T.contactTitle[lang]}</p>
              <div className="mt-5 h-px w-full bg-[linear-gradient(to_right,rgba(17,17,17,0.08),rgba(17,17,17,0.03))]" />

              <div className="mt-5 space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-[2px] h-[16px] w-[16px] shrink-0 text-black/38" strokeWidth={1.7} />
                  <div>
                    <p className={labelClass}>{T.addressLabel[lang]}</p>
                    <p className="mt-1.5 font-sans text-[15px] font-[350] leading-[1.6] tracking-[-0.012em] text-black/74">
                      {T.address[lang]}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-[2px] h-[16px] w-[16px] shrink-0 text-black/38" strokeWidth={1.7} />
                  <div>
                    <p className={labelClass}>{T.phoneLabel[lang]}</p>
                    <Link
                      href="tel:+994704210204"
                      className="mt-1.5 block font-sans text-[15px] font-[350] leading-[1.6] tracking-[-0.012em] text-black/74 transition-colors duration-300 hover:text-black"
                    >
                      +994 70 421 02 04
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-[2px] h-[16px] w-[16px] shrink-0 text-black/38" strokeWidth={1.7} />
                  <div>
                    <p className={labelClass}>{T.emailLabel[lang]}</p>
                    <Link
                      href="mailto:info@besmile.az"
                      className="mt-1.5 block font-sans text-[15px] font-[350] leading-[1.6] tracking-[-0.012em] text-black/74 transition-colors duration-300 hover:text-black"
                    >
                      info@besmile.az
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock3 className="mt-[2px] h-[16px] w-[16px] shrink-0 text-black/38" strokeWidth={1.7} />
                  <div>
                    <p className={labelClass}>{T.hoursLabel[lang]}</p>
                    <p className="mt-1.5 font-sans text-[15px] font-[350] leading-[1.6] tracking-[-0.012em] text-black/74">
                      {T.hours[lang]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 border-t border-black/7 px-1 pt-5 text-[12px] font-[350] tracking-[0.01em] text-black/42 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans">© {new Date().getFullYear()} BeSmile Dental Clinic</p>
          <p className="font-sans">{T.footerNote[lang]}</p>
        </div>
      </div>
    </footer>
  );
}
