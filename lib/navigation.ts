import { cache } from "react";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus/client";

export type Lang = "az" | "ru" | "en";

export type NavService = {
  slug: string;
  title: string;
  cover: string | null;
};

export type NavServiceGroup = {
  key: string;
  title: string;
  items: NavService[];
};

// Menu categories. Services not listed here (e.g. newly added in Directus)
// land in the first group automatically.
const GROUPS: Array<{ key: string; title: Record<Lang, string>; slugs: string[] }> = [
  {
    key: "treatment",
    title: { ru: "Лечение и диагностика", en: "Treatment & diagnostics", az: "Müalicə və diaqnostika" },
    slugs: [
      "diagnostics",
      "dental-treatment",
      "microscope-dental-treatment",
      "oral-hygiene",
      "pediatric-dentistry",
    ],
  },
  {
    key: "aesthetics",
    title: { ru: "Эстетика улыбки", en: "Smile aesthetics", az: "Estetik təbəssüm" },
    slugs: ["veneers", "teeth-whitening", "orthodontics"],
  },
  {
    key: "restoration",
    title: { ru: "Имплантация и протезирование", en: "Implants & prosthetics", az: "İmplantasiya və protezləmə" },
    slugs: ["Dental-implants", "dental-crowns", "dental-prosthetics", "dental-surgery"],
  },
  {
    key: "international",
    title: { ru: "Иностранным пациентам", en: "International patients", az: "Xarici pasiyentlər" },
    slugs: ["dental-tourism"],
  },
];

const LOCALE: Record<Lang, string> = { ru: "ru", en: "en", az: "az" };

// CMS titles are sometimes typed in CAPS ("ВИНИРЫ") — show them in sentence case
function toSentenceCase(value: string, lang: Lang) {
  const text = value.trim();
  if (!text || text !== text.toLocaleUpperCase(LOCALE[lang])) return text;
  const lower = text.toLocaleLowerCase(LOCALE[lang]);
  return lower.charAt(0).toLocaleUpperCase(LOCALE[lang]) + lower.slice(1);
}

type ServiceRow = {
  slug?: string;
  cover?: string | null;
  is_active?: boolean | null;
  translations?: Array<{ language?: string; title?: string }>;
};

export const getNavServiceGroups = cache(async (lang: Lang): Promise<NavServiceGroup[]> => {
  let rows: ServiceRow[] = [];
  try {
    // Navigation needs no treatment descriptions, rich text or SEO fields.
    // Share the mapped result between the layout and page in the same render.
    rows = await directus.request(readItems("services", {
      fields: ["slug", "cover", "is_active", "translations.language", "translations.title"],
      limit: -1,
    })) as ServiceRow[];
  } catch {
    return [];
  }

  const services = rows
    .filter((row) => row?.slug && row.is_active !== false)
    .map((row) => {
      const tr =
        row.translations?.find((t) => t.language === lang) ||
        row.translations?.find((t) => t.language === "en") ||
        row.translations?.[0];

      return {
        slug: row.slug as string,
        title: toSentenceCase(tr?.title || row.slug || "", lang),
        cover: row.cover || null,
      };
    });

  const bySlug = new Map(services.map((s) => [s.slug, s]));
  const used = new Set<string>();

  const groups = GROUPS.map((group) => ({
    key: group.key,
    title: group.title[lang],
    items: group.slugs
      .map((slug) => bySlug.get(slug))
      .filter((s): s is NavService => {
        if (!s) return false;
        used.add(s.slug);
        return true;
      }),
  }));

  const rest = services.filter((s) => !used.has(s.slug));
  if (rest.length) groups[0].items.push(...rest);

  return groups.filter((group) => group.items.length > 0);
});
