import DoctorsCarousel from "./TestimonialsCarousel";
import { getDoctors } from "@/lib/directus";

export type Lang = "en" | "ru" | "az";

const SECTION_LABEL: Record<Lang, string> = {
  en: "BeSmile doctors section",
  ru: "Секция врачей BeSmile",
  az: "BeSmile həkimlər bölməsi",
};

export default async function Doctors({ lang }: { lang: Lang }) {
  const rows = (await getDoctors(lang)) as Array<{
    id: string | number;
    image?: { id?: string } | null;
    image_position?: string;
    translations?: unknown[];
  }>;

  // Only send the client what the carousel renders (keeps the page payload small)
  const doctors = rows.map((d) => ({
    id: d.id,
    image: d.image?.id ? { id: d.image.id } : undefined,
    image_position: d.image_position,
    translations: d.translations,
  }));

  return (
    <section
      id="home-doctors"
      aria-label={SECTION_LABEL[lang]}
      className="mt-0 sm:mt-4 md:mt-4 lg:mt-4"
    >
      <DoctorsCarousel lang={lang} doctors={doctors} />
    </section>
  );
}
