import Link from "next/link";
import styles from "./hero.module.css";
import SmileSculpture from "./SmileSculpture";
import { ArrowUpRight } from "lucide-react";

type Lang = "ru" | "en" | "az";

const HERO_CONTENT: Record<
  Lang,
  {
    badge: string;
    eyebrow: string;
    titleDesktop1: string;
    titleDesktop2: string;
    titleDesktop3?: string;
    titleMobile1: string;
    titleMobile2: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    plaqueLabel: string;
    plaqueTitle: string;
    plaqueText: string;
    topLeftLabel: string;
    topRightLabel: string;
    imageAlt: string;
    stats: {
      value: string;
      label: string;
    }[];
  }
> = {
  ru: {
    badge: "СТОМАТОЛОГИЯ В БАКУ · BESMILE DENTAL CLINIC",
    eyebrow: "Эстетика здоровой улыбки",
    titleDesktop1: "Стоматология",
    titleDesktop2: "в Баку",
    titleMobile1: "Стоматология",
    titleMobile2: "в Баку",
    description:
      "Современная стоматология в Баку с premium-подходом: точная диагностика, лечение зубов, имплантация, виниры, коронки и естественная эстетика улыбки.",
    primaryCta: "ЗАПИСАТЬСЯ НА ПРИЁМ",
    secondaryCta: "ПОСМОТРЕТЬ УСЛУГИ",
    plaqueLabel: "BESPOKE EXPERIENCE",
    plaqueTitle: "Эстетика здоровой улыбки",
    plaqueText:
      "Индивидуальный план лечения, аккуратная диагностика и результат, который выглядит естественно.",
    topLeftLabel: "BESMILE",
    topRightLabel: "BAKU · PREMIUM DENTAL",
    imageAlt:
      "Стоматология в Баку BeSmile Dental Clinic — эстетика здоровой улыбки",
    stats: [
      { value: "10+", label: "лет опыта" },
      { value: "5000+", label: "счастливых улыбок" },
      { value: "3D", label: "цифровая диагностика" },
    ],
  },
  en: {
    badge: "DENTIST IN BAKU · BESMILE DENTAL CLINIC",
    eyebrow: "The art of a healthy smile",
    titleDesktop1: "Dentist",
    titleDesktop2: "in Baku",
    titleMobile1: "Dentist",
    titleMobile2: "in Baku",
    description:
      "BeSmile Dental Clinic in Baku offers dental treatment, implants, veneers, crowns, whitening and cosmetic dentistry with a precise, premium and personal approach.",
    primaryCta: "BOOK AN APPOINTMENT",
    secondaryCta: "EXPLORE SERVICES",
    plaqueLabel: "BESPOKE EXPERIENCE",
    plaqueTitle: "The art of a healthy smile",
    plaqueText:
      "Comfort-first diagnostics, precise care, and an aesthetic result that feels truly individual.",
    topLeftLabel: "BESMILE",
    topRightLabel: "BAKU · PREMIUM DENTAL",
    imageAlt:
      "Dentist in Baku BeSmile Dental Clinic — healthy smile aesthetics",
    stats: [
      { value: "10+", label: "years of experience" },
      { value: "5000+", label: "happy smiles" },
      { value: "3D", label: "digital diagnostics" },
    ],
  },
  az: {
    badge: "BAKIDA STOMATOLOGIYA · BESMILE DENTAL CLINIC",
    eyebrow: "Sağlam təbəssüm estetikası",
    titleDesktop1: "Bakıda",
    titleDesktop2: "stomatologiya",
    titleMobile1: "Bakıda",
    titleMobile2: "stomatologiya",
    description:
      "BeSmile Dental Clinic Bakıda diş müalicəsi, implantasiya, vinirlər, diş qapaqları, ağartma və estetik stomatologiya xidmətlərini fərdi yanaşma ilə təqdim edir.",
    primaryCta: "QƏBULA YAZILIN",
    secondaryCta: "XİDMƏTLƏRƏ BAXIN",
    plaqueLabel: "BESPOKE EXPERIENCE",
    plaqueTitle: "Sağlam təbəssüm estetikası",
    plaqueText:
      "Rahat diaqnostika, dəqiq müalicə və standart görünməyən estetik nəticə.",
    topLeftLabel: "BESMILE",
    topRightLabel: "BAKU · PREMIUM DENTAL",
    imageAlt:
      "Bakıda stomatologiya BeSmile Dental Clinic — sağlam təbəssüm estetikası",
    stats: [
      { value: "10+", label: "il təcrübə" },
      { value: "5000+", label: "xoş təbəssüm" },
      { value: "3D", label: "rəqəmsal diaqnostika" },
    ],
  },
};

function normalizeLang(lang?: string): Lang {
  if (lang === "ru" || lang === "en" || lang === "az") return lang;
  return "az";
}

export default function Hero({ lang }: { lang?: Lang }) {
  const safeLang = normalizeLang(lang);
  const t = HERO_CONTENT[safeLang];
  return (
    <section className={styles.hero} data-home="hero-v2" aria-labelledby="home-hero-title">
      <div className={styles.container}>
        <div className={styles.masthead}><span>{t.badge}</span><span aria-hidden="true">[ BeSmile ]</span></div>
        <h1 id="home-hero-title" className={styles.title}><span>{t.titleDesktop1}</span><span>{t.titleDesktop2}</span></h1>
        <div className={styles.composition}>
          <div className={styles.copy}>
            <div><p className={styles.eyebrow}>{t.eyebrow}</p><p className={styles.description}>{t.description}</p></div>
            <div className={styles.actions}>
              <Link href={`/${safeLang}/book-online`} prefetch={false} className={styles.primary}><span>{t.primaryCta}</span><ArrowUpRight size={19} aria-hidden="true" /></Link>
              <Link href={`/${safeLang}/services`} className={styles.secondary}><span>{t.secondaryCta}</span><ArrowUpRight size={18} aria-hidden="true" /></Link>
            </div>
          </div>
          <figure className={styles.media}>
            <div className={styles.sculpture}><SmileSculpture /></div>
            <figcaption><span>{t.topLeftLabel} · DENTAL CLINIC</span><span>{safeLang === "ru" ? "Художественный образ" : safeLang === "az" ? "Bədii obraz" : "Campaign image"}</span></figcaption>
          </figure>
        </div>
        <div className={styles.stats}>{t.stats.map(item => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>
      </div>
    </section>
  );
}
