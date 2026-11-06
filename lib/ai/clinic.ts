export type Lang = "ru" | "en" | "az";

export type ChatHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export type ClinicService = {
  id: string;
  slug: string;
  title: string;
  description: string;
};

export type ClinicDoctor = {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  bio: string;
};

export type ClinicPrice = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: string;
  isFromPrice: boolean;
};

export type ClinicContext = {
  services: ClinicService[];
  doctors: ClinicDoctor[];
  prices: ClinicPrice[];
};

const DIRECTUS_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://portal.besmile.az";

function normalizeText(input: unknown) {
  if (!input || typeof input !== "string") return "";
  return input
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(input: unknown, maxLength = 260) {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function uniqueByKey<T>(items: T[], getKey: (item: T) => string) {
  const map = new Map<string, T>();

  for (const item of items) {
    const key = getKey(item).trim().toLowerCase();
    if (!key) continue;
    if (!map.has(key)) map.set(key, item);
  }

  return Array.from(map.values());
}

function chooseTranslation(
  translations: any[],
  lang: Lang
) {
  if (!Array.isArray(translations) || !translations.length) return null;

  const direct =
    translations.find((x: any) => x?.language === lang) ||
    translations.find((x: any) => x?.lang === lang);

  const ru =
    translations.find((x: any) => x?.language === "ru") ||
    translations.find((x: any) => x?.lang === "ru");

  const en =
    translations.find((x: any) => x?.language === "en") ||
    translations.find((x: any) => x?.lang === "en");

  const az =
    translations.find((x: any) => x?.language === "az") ||
    translations.find((x: any) => x?.lang === "az");

  return direct || ru || en || az || translations[0] || null;
}

async function fetchDirectusCollection(
  collection: string,
  params: URLSearchParams
) {
  const url = `${DIRECTUS_URL}/items/${collection}?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`${collection} request failed: ${res.status}`);
  }

  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
}

export async function getClinicContext(lang: Lang): Promise<ClinicContext> {
  const servicesParams = new URLSearchParams();
  servicesParams.set("fields", "id,slug,is_active,translations.*");
  servicesParams.set("filter[is_active][_eq]", "true");
  servicesParams.set("limit", "-1");
  servicesParams.set("sort", "order");

  const doctorsParams = new URLSearchParams();
  doctorsParams.set("fields", "id,slug,translations.*");
  doctorsParams.set("limit", "-1");

  const pricesParams = new URLSearchParams();
  pricesParams.set(
    "fields",
    "id,slug,price,is_from_price,is_active,translations.*,category.id,category.slug"
  );
  pricesParams.set("filter[is_active][_eq]", "true");
  pricesParams.set("limit", "-1");
  pricesParams.set("sort", "sort");

  const [servicesRaw, doctorsRaw, pricesRaw] = await Promise.all([
    fetchDirectusCollection("services", servicesParams).catch(() => []),
    fetchDirectusCollection("Doctors", doctorsParams).catch(() => []),
    fetchDirectusCollection("prices", pricesParams).catch(() => []),
  ]);

  const services: ClinicService[] = uniqueByKey(
    servicesRaw
      .map((item: any): ClinicService => {
        const t = chooseTranslation(item?.translations || [], lang);

        return {
          id: String(item?.id ?? ""),
          slug: String(item?.slug ?? ""),
          title: t?.title || item?.slug || "Услуга",
          description: stripHtml(t?.content, 260),
        };
      })
      .filter((item: ClinicService) => Boolean(item.title)),
    (item) => `${item.slug}|${item.title}`
  );

  const doctors: ClinicDoctor[] = uniqueByKey(
    doctorsRaw
      .map((item: any): ClinicDoctor => {
        const t = chooseTranslation(item?.translations || [], lang);
        const firstName = String(t?.firstname || "").trim();
        const lastName = String(t?.lastname || "").trim();
        const name = `${firstName} ${lastName}`.trim();

        return {
          id: String(item?.id ?? ""),
          slug: String(item?.slug ?? ""),
          name: name || "Доктор BeSmile",
          specialty: String(t?.profession || "").trim(),
          bio: stripHtml(t?.description, 220),
        };
      })
      .filter((item: ClinicDoctor) => Boolean(item.name)),
    (item) => `${item.name}|${item.specialty}`
  );

  const prices: ClinicPrice[] = uniqueByKey(
    pricesRaw
      .map((item: any): ClinicPrice => {
        const t = chooseTranslation(item?.translations || [], lang);

        return {
          id: String(item?.id ?? ""),
          slug: String(item?.slug ?? ""),
          title: String(t?.service_name || item?.slug || "Цена").trim(),
          description: String(t?.description || "").trim(),
          price: item?.price != null ? String(item.price).trim() : "",
          isFromPrice: Boolean(item?.is_from_price),
        };
      })
      .filter((item: ClinicPrice) => Boolean(item.title)),
    (item) => `${item.slug}|${item.title}|${item.price}`
  );

  return { services, doctors, prices };
}

export function normalizeHistory(input: unknown): ChatHistoryItem[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter(
      (item): item is { role?: unknown; content?: unknown } =>
        !!item && typeof item === "object"
    )
    .map(
      (item): ChatHistoryItem => ({
        role: item.role === "assistant" ? "assistant" : "user",
        content: typeof item.content === "string" ? item.content.trim() : "",
      })
    )
    .filter((item: ChatHistoryItem) => item.content.length > 0)
    .slice(-16);
}

export { normalizeText };