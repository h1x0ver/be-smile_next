"use client";

import Link from "next/link";
import PageHeading from "@/components/PageHeading";
import { ArrowUpRight, MapPin, Phone, Mail, Instagram, MessageCircle, Clock, CalendarDays, Navigation } from "lucide-react";
import styles from "./contact.module.css";

type Lang = "ru" | "en" | "az";
const MAP_URL = "https://www.google.com/maps?cid=15329295648517687907";
const DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=40.3976936340332%2C49.836185455322266";
const MAP_EMBED = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3038.503579803598!2d49.836185455322266!3d40.3976936340332!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307dc383638a31%3A0xd4bc992c9ad68a63!2zQmVTbWlsZSDQodGC0L7QvNCw0YLQvtC70L7Qs9C40YfQtdGB0LrQsNGPINC60LvQuNC90LjQutCw!5e0!3m2!1sru!2saz!4v1765093947765!5m2!1sru!2saz";

const COPY = {
  ru: {
    home: "Главная", title: "Контакты", eyebrow: "BESMILE DENTAL CLINIC · BAKU",
    intro: "Есть вопрос или хотите записаться на приём? Свяжитесь с нами удобным способом — мы поможем с выбором врача и временем визита.",
    book: "Записаться на приём", directions: "Построить маршрут", call: "Позвонить нам", callNote: "Обсудим ваш вопрос и подберём время визита.",
    whatsapp: "Написать в WhatsApp", whatsappNote: "Вопросы, запись и связь с администратором.", email: "Электронная почта", emailNote: "Для ваших вопросов и документов.",
    instagramNote: "Жизнь клиники, наша команда и истории улыбок.", instagramCta: "Перейти в Instagram", addressLabel: "Ждём вас в клинике", address: "ул. Хана Шушинского, 24", city: "Баку, Азербайджан · AZ1007",
    hours: "Часы работы", days: "Понедельник — суббота", visit: "Спланируйте ваш визит", visitNote: "Рекомендуем записаться заранее, чтобы выбрать удобное время и подходящего специалиста.",
    map: "BeSmile на карте", location: "Как нас найти", mapNote: "Откройте карту, чтобы спланировать маршрут до клиники.",
    closing: "Будем рады знакомству.", closingNote: "Начните с консультации — обсудим ваши пожелания и дальнейший план лечения.", consultation: "Записаться на консультацию",
  },
  en: {
    home: "Home", title: "Contact", eyebrow: "BESMILE DENTAL CLINIC · BAKU",
    intro: "Have a question or planning your first visit? Get in touch your way — we will help you choose a dentist and a convenient appointment time.",
    book: "Book an appointment", directions: "Get directions", call: "Give us a call", callNote: "Let’s discuss your question and find a time to visit.",
    whatsapp: "Message on WhatsApp", whatsappNote: "Questions, appointments and our reception team.", email: "Email us", emailNote: "For your questions and documents.",
    instagramNote: "Life at the clinic, our team and smile stories.", instagramCta: "Visit Instagram", addressLabel: "Visit our clinic", address: "24 Khan Shushinski Street", city: "Baku, Azerbaijan · AZ1007",
    hours: "Opening hours", days: "Monday — Saturday", visit: "Plan your visit", visitNote: "We recommend booking ahead to choose a convenient time and the right specialist.",
    map: "BeSmile on the map", location: "Find us", mapNote: "Open the map to plan your route to the clinic.",
    closing: "We look forward to meeting you.", closingNote: "Start with a consultation — we will discuss your wishes and your treatment plan.", consultation: "Book a consultation",
  },
  az: {
    home: "Ana səhifə", title: "Əlaqə", eyebrow: "BESMILE DENTAL CLINIC · BAKU",
    intro: "Sualınız var və ya ilk vizitinizi planlaşdırırsınız? Bizimlə sizə uyğun üsulla əlaqə saxlayın — həkim və qəbul vaxtını seçməyə kömək edərik.",
    book: "Qəbula yazılın", directions: "Marşrut qurun", call: "Bizə zəng edin", callNote: "Sualınızı müzakirə edək və uyğun qəbul vaxtını seçək.",
    whatsapp: "WhatsApp-da yazın", whatsappNote: "Suallar, qeydiyyat və administratorla əlaqə.", email: "Elektron poçt", emailNote: "Suallarınız və sənədləriniz üçün.",
    instagramNote: "Klinikamızın həyatı, komandamız və gülüş hekayələri.", instagramCta: "Instagram-a keçin", addressLabel: "Klinikamıza gəlin", address: "Xan Şuşinski küçəsi, 24", city: "Bakı, Azərbaycan · AZ1007",
    hours: "İş saatları", days: "Bazar ertəsi — şənbə", visit: "Vizitinizi planlaşdırın", visitNote: "Uyğun vaxtı və mütəxəssisi seçmək üçün əvvəlcədən qeydiyyatdan keçməyi tövsiyə edirik.",
    map: "Xəritədə BeSmile", location: "Bizi necə tapmaq olar", mapNote: "Klinikaya marşrutunuzu planlaşdırmaq üçün xəritəni açın.",
    closing: "Sizinlə tanış olmağa şad olarıq.", closingNote: "Konsultasiyadan başlayın — istəklərinizi və müalicə planınızı müzakirə edək.", consultation: "Konsultasiyaya yazılın",
  },
} as const;

export default function ContactClient({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const contacts = [
    { label: t.call, value: "+994 70 421 02 04", note: t.callNote, href: "tel:+994704210204", Icon: Phone },
    { label: "WhatsApp", value: "+994 70 421 02 04", note: t.whatsappNote, href: "https://wa.me/994704210204", Icon: MessageCircle },
    { label: t.email, value: "info@besmile.az", note: t.emailNote, href: "mailto:info@besmile.az", Icon: Mail },
    { label: "Instagram", value: "@besmile_dental", note: t.instagramNote, href: "https://www.instagram.com/besmile_dental/", Icon: Instagram },
  ];
  return <div className={styles.page} data-contact-page>
    <div className={styles.container}>
      <nav className={styles.breadcrumb} aria-label={t.title}><Link href={`/${lang}`}>{t.home}</Link><span aria-hidden="true">/</span><span>{t.title}</span></nav>
      <header className={styles.hero}>
        <div><span className={styles.eyebrow}><span />{t.eyebrow}</span><PageHeading>{t.title}</PageHeading></div>
        <div className={styles.heroIntro}><p>{t.intro}</p><div className={styles.heroActions}><Link href={`/${lang}/book-online`} className={styles.primary}><span>{t.book}</span><ArrowUpRight size={18} aria-hidden="true" /></Link><a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className={styles.route}><Navigation size={15} aria-hidden="true" />{t.directions}</a></div></div>
      </header>

      <section className={styles.contactGrid} aria-label={t.title}>
        {contacts.map(({ label, value, note, href, Icon }) => <a key={href} href={href} target={href.startsWith("https") ? "_blank" : undefined} rel={href.startsWith("https") ? "noopener noreferrer" : undefined} className={styles.contactCard} aria-label={`${label}: ${value}`}>
          <div className={styles.cardTop}><span className={styles.icon}><Icon size={22} strokeWidth={1.4} aria-hidden="true" /></span><ArrowUpRight className={styles.cardArrow} size={18} strokeWidth={1.4} aria-hidden="true" /></div>
          <span className={styles.label}>{label}</span><h2>{value}</h2><p>{note}</p>
        </a>)}
      </section>

      <section className={styles.locationSection} aria-labelledby="clinic-location">
        <header className={styles.sectionHeading}><div><span className={styles.eyebrow}>BESMILE · BAKU</span><h2 id="clinic-location">{t.location}</h2></div><span>{t.mapNote}</span></header>
        <div className={styles.locationGrid}>
          <div className={styles.mapCard}>
            <div className={styles.mapTop}><span><MapPin size={16} aria-hidden="true" />{t.map}</span><a href={MAP_URL} target="_blank" rel="noopener noreferrer">Google Maps<ArrowUpRight size={15} aria-hidden="true" /></a></div>
            <div className={styles.map}><iframe src={MAP_EMBED.replaceAll("!1sru!2saz", `!1s${lang}!2saz`)} title={t.map} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div>
            <div className={styles.mapBottom}><span>{t.address}</span><a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">{t.directions}<ArrowUpRight size={16} aria-hidden="true" /></a></div>
          </div>
          <div className={styles.visitCard}>
            <span className={styles.eyebrow}>{t.addressLabel}</span><div className={styles.address}><MapPin size={23} strokeWidth={1.3} aria-hidden="true" /><address><h3>{t.address}</h3><p>{t.city}</p></address></div>
            <div className={styles.hours}><div className={styles.hoursLabel}><Clock size={17} strokeWidth={1.4} aria-hidden="true" />{t.hours}</div><div className={styles.schedule}><span>{t.days}</span><strong>09:00 — 19:00</strong></div></div>
            <div className={styles.visitNote}><h3>{t.visit}</h3><p>{t.visitNote}</p></div>
            <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className={styles.mapRoute}><span>{t.directions}</span><Navigation size={17} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className={styles.closing} aria-labelledby="contact-booking"><span className={styles.closingIcon}><CalendarDays size={28} strokeWidth={1.2} aria-hidden="true" /></span><div><h2 id="contact-booking">{t.closing}</h2><p>{t.closingNote}</p></div><Link href={`/${lang}/book-online`} className={styles.primary}><span>{t.consultation}</span><ArrowUpRight size={19} aria-hidden="true" /></Link></section>
    </div>
  </div>;
}
