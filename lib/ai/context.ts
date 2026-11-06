import { getServices, getDoctors, getPrices } from "@/lib/directus";

export type Lang = "ru" | "en" | "az";

const DEFAULT_LANG: Lang = "ru";

const MAX_SERVICES = 100;
const MAX_DOCTORS = 50;
const MAX_PRICES = 500;

export type BotService = {
  id?: string | number;
  title: string;
  description: string;
  slug: string;
};

export type BotDoctor = {
  id?: string | number;
  name: string;
  specialty: string;
  bio: string;
};

export type BotPrice = {
  id?: string | number;
  title: string;
  price: string;
  description: string;
  slug: string;
};

export type BotContext = {
  services: BotService[];
  doctors: BotDoctor[];
  prices: BotPrice[];
};

type DirectusTranslation = {
  language?: string | null;
  title?: string | null;
  content?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  profession?: string | null;
  description?: string | null;
  service_name?: string | null;
};

type DirectusService = {
  id?: string | number;
  slug?: string | null;
  translations?: DirectusTranslation[] | null;
};

type DirectusDoctor = {
  id?: string | number;
  slug?: string | null;
  translations?: DirectusTranslation[] | null;
};

type DirectusPrice = {
  id?: string | number;
  slug?: string | null;
  price?: string | number | null;
  translations?: DirectusTranslation[] | null;
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function safeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function safeNumberString(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string") return value.trim();
  return "";
}

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string, maxLength: number): string {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength).trim();
}

function stripHtml(input: unknown, maxLength = 220): string {
  if (typeof input !== "string" || !input.trim()) return "";

  const decoded = input
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

  return truncate(collapseWhitespace(decoded), maxLength);
}

function getLanguagePriority(lang: Lang): Lang[] {
  switch (lang) {
    case "az":
      return ["az", "ru", "en"];
    case "en":
      return ["en", "ru", "az"];
    case "ru":
    default:
      return ["ru", "en", "az"];
  }
}

function pickTranslation<T extends DirectusTranslation>(
  translations: T[] | null | undefined,
  lang: Lang
): T | null {
  const list = asArray<T>(translations);
  if (!list.length) return null;

  const priorities = getLanguagePriority(lang);

  for (const preferred of priorities) {
    const found = list.find((tr) => safeString(tr.language) === preferred);
    if (found) return found;
  }

  return list[0] ?? null;
}

function uniqueBy<T>(items: T[], getKey: (item: T) => string): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    const key = getKey(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  return result;
}

function normalizeService(item: DirectusService, lang: Lang): BotService | null {
  const t = pickTranslation(item.translations, lang);

  const slug = safeString(item.slug);
  const title = safeString(t?.title) || slug || "Услуга";
  const description = stripHtml(t?.content, 260);

  if (!title) return null;

  return {
    id: item.id,
    title,
    description,
    slug,
  };
}

function normalizeDoctor(item: DirectusDoctor, lang: Lang): BotDoctor | null {
  const t = pickTranslation(item.translations, lang);

  const firstName = safeString(t?.firstname);
  const lastName = safeString(t?.lastname);
  const fullName = collapseWhitespace(`${firstName} ${lastName}`);
  const specialty = safeString(t?.profession);
  const bio = stripHtml(t?.description, 220);

  return {
    id: item.id,
    name: fullName || "Доктор BeSmile",
    specialty,
    bio,
  };
}

function normalizePrice(item: DirectusPrice, lang: Lang): BotPrice | null {
  const t = pickTranslation(item.translations, lang);

  const slug = safeString(item.slug);
  const title = safeString(t?.service_name) || slug || "Цена";
  const price = safeNumberString(item.price);
  const description = safeString(t?.description);

  if (!title) return null;

  return {
    id: item.id,
    title,
    price,
    description,
    slug,
  };
}

function sortByTitle<T extends { title?: string; name?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const left = (a.title ?? a.name ?? "").toLowerCase();
    const right = (b.title ?? b.name ?? "").toLowerCase();
    return left.localeCompare(right, "ru");
  });
}

export async function getBotContext(lang: Lang = DEFAULT_LANG): Promise<BotContext> {
  try {
    const [servicesRaw, doctorsRaw, pricesRaw] = await Promise.all([
      getServices(lang),
      getDoctors(lang),
      getPrices(lang),
    ]);

    const services = uniqueBy(
      asArray<DirectusService>(servicesRaw)
        .slice(0, MAX_SERVICES)
        .map((item) => normalizeService(item, lang))
        .filter((item): item is BotService => Boolean(item)),
      (item) => item.slug || item.title.toLowerCase()
    );

    const doctors = uniqueBy(
      asArray<DirectusDoctor>(doctorsRaw)
        .slice(0, MAX_DOCTORS)
        .map((item) => normalizeDoctor(item, lang))
        .filter((item): item is BotDoctor => Boolean(item)),
      (item) => item.name.toLowerCase()
    );

    const prices = uniqueBy(
      asArray<DirectusPrice>(pricesRaw)
        .slice(0, MAX_PRICES)
        .map((item) => normalizePrice(item, lang))
        .filter((item): item is BotPrice => Boolean(item)),
      (item) => item.slug || `${item.title.toLowerCase()}::${item.price}`
    );

    return {
      services: sortByTitle(services),
      doctors: sortByTitle(doctors),
      prices: sortByTitle(prices),
    };
  } catch (error) {
    console.error("getBotContext error:", error);

    return {
      services: [],
      doctors: [],
      prices: [],
    };
  }
}