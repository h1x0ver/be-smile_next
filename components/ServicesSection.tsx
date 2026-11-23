import Link from "next/link";
import Image from "next/image";
import { getServices } from "@/lib/directus";
import { directusImage } from "@/lib/directusImage";
import { decodeHtmlEntities } from "@/lib/displayText";
import styles from "./home-services.module.css";

type Lang = "en" | "ru" | "az";
const COPY = {
 ru: { label:"ЗАБОТА О ВАШЕЙ УЛЫБКЕ", title:"НАШИ", accent:"УСЛУГИ", intro:"От первого обследования до восстановления улыбки. Найдите подходящее направление и узнайте больше о лечении.", all:"Все услуги", more:"О лечении" },
 az: { label:"TƏBƏSSÜMÜNÜZƏ QAYĞI", title:"BİZİM", accent:"XİDMƏTLƏR", intro:"İlk müayinədən təbəssümün bərpasına qədər. Uyğun istiqaməti seçin və müalicə haqqında ətraflı məlumat alın.", all:"Bütün xidmətlər", more:"Müalicə haqqında" },
 en: { label:"CARE FOR YOUR SMILE", title:"OUR", accent:"SERVICES", intro:"From your first examination to restoring your smile. Explore our treatments and find the right direction for your care.", all:"All services", more:"Explore treatment" },
};
export default async function ServicesSection({ lang = "az" }: { lang?: Lang }) {
 const t = COPY[lang];
 const services = await getServices(lang);
 const items = services.flatMap(service => {
  const translation = service.translations?.find((tr: {language?:string;languages_code?:string}) => (tr.language || tr.languages_code) === lang);
  if (!service.slug || !translation?.title) return [];
  return [{ id:service.id, slug:service.slug, title:decodeHtmlEntities(translation.title), image:directusImage(service.cover,800,78) }];
 });
 if (!items.length) return null;
 return <section className={styles.section} data-home="services" aria-labelledby="home-services-title"><div className={styles.container}>
  <header className={styles.heading} data-home="section-header"><div><p className={styles.label}>{t.label}</p><h2 id="home-services-title">[ {t.title} <span>{t.accent}</span> ]</h2></div><div className={styles.intro}><p>{t.intro}</p><Link href={`/${lang}/services`} prefetch={false}>{t.all}</Link></div></header>
  <div className={styles.grid}>{items.map(item => <Link key={item.id} href={`/${lang}/services/${item.slug}`} prefetch={false} className={styles.card}>
   <div className={styles.image}>{item.image ? <Image src={item.image} alt={item.title} fill sizes="(max-width:600px) 100vw, (max-width:1000px) 50vw, 33vw" quality={78} /> : <div className={styles.placeholder} aria-hidden="true"><span>be<span>smile.</span></span></div>}<span className={styles.imageMark} aria-hidden="true">BeSmile</span></div>
   <div className={styles.info}><h3>{item.title}</h3><span className={styles.more}>{t.more}<svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.4"/></svg></span></div>
  </Link>)}</div>
 </div></section>;
}
