import { GoogleGenAI } from "@google/genai";
import {
  BotContext,
  BotDoctor,
  BotPrice,
  BotService,
  Lang,
  getBotContext,
} from "@/lib/ai/context";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

type ChatHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

type Intent =
  | "greeting"
  | "price"
  | "doctor"
  | "service"
  | "followup"
  | "general";

type EntityKey =
  | "veneers"
  | "medentika"
  | "neobiotech"
  | "straumann"
  | "wisdom_tooth"
  | "alveolitis"
  | "fillings"
  | "implant"
  | "crowns"
  | "braces"
  | "aligners"
  | null;

type TranslationMap = {
  greeting: string;
  noMessage: string;
  genericError: string;
  doctorUnknown: string;
  serviceNoPrice: (title: string) => string;
  priceKnown: (title: string, price: string) => string;
  serviceKnown: (title: string, description?: string) => string;
  doctorListIntro: (text: string) => string;
  generalDoctors: (text: string) => string;
  doctorNoBinding: (title: string) => string;
  followupGeneric: string;
  followupVeneers: string;
  followupImplant: string;
  followupFillings: string;
};

const MESSAGES: Record<Lang, TranslationMap> = {
  ru: {
    greeting:
      "Здравствуйте. Я concierge-ассистент BeSmile. Могу помочь по услугам, врачам, ценам и записи. Подскажите, что именно вас интересует?",
    noMessage: "Message is required",
    genericError: "Извините, произошла ошибка. Попробуйте еще раз.",
    doctorUnknown:
      "Я пока не вижу точного совпадения по специалисту, но могу помочь сориентироваться по направлению и подсказать, кто лучше подойдет под ваш запрос.",
    serviceNoPrice:
      (title) =>
        `Я вижу, что вас интересует услуга «${title}», но точная стоимость в текущем прайсе не найдена. Если хотите, я помогу сориентироваться по следующему шагу и подскажу, как лучше подойти к консультации.`,
    priceKnown:
      (title, price) =>
        `По текущему прайсу стоимость позиции «${title}» составляет ${price}. Если хотите, я могу помочь сориентироваться по следующему шагу или подсказать, к какому специалисту лучше обратиться.`,
    serviceKnown:
      (title, description) =>
        description
          ? `${title} доступна в BeSmile. ${description} Если хотите, я могу дальше помочь сориентироваться по стоимости или по тому, к какому специалисту лучше обратиться.`
          : `${title} доступна в BeSmile. Если хотите, я могу помочь дальше сориентироваться по стоимости или по выбору специалиста.`,
    doctorListIntro:
      (text) =>
        `В BeSmile принимают ${text}. Если хотите, я могу помочь понять, кто из них лучше подойдет именно под ваш запрос.`,
    generalDoctors:
      (text) =>
        `В BeSmile принимают ${text}. Если подскажете, какая именно услуга вас интересует, я помогу сориентироваться дальше.`,
    doctorNoBinding:
      (title) =>
        `По услуге «${title}» я могу помочь сориентироваться, но в текущих данных нет точной привязки конкретного врача к этой услуге. Если хотите, я подскажу следующий шаг и помогу сориентироваться по записи на консультацию.`,
    followupGeneric:
      "Я могу помочь вам сориентироваться по следующему шагу и подсказать, как лучше подойти к консультации или записи.",
    followupVeneers:
      "Для виниров обычно всё начинается с консультации и диагностики, чтобы подобрать форму, цвет и план лечения. Если хотите, я могу помочь вам перейти к следующему шагу и сориентировать по записи на первичный прием.",
    followupImplant:
      "В случае имплантации обычно сначала проводится консультация и диагностика, чтобы оценить состояние кости и подобрать подходящую систему импланта. Если хотите, я могу помочь вам перейти к следующему шагу и сориентировать по первичному приему.",
    followupFillings:
      "По восстановлению зубов и пломбам обычно всё начинается с осмотра, чтобы понять объём работы и подобрать подходящий вариант реставрации. Если хотите, я помогу вам перейти к следующему шагу и сориентировать по консультации.",
  },
  en: {
    greeting:
      "Hello. I’m the BeSmile concierge assistant. I can help with services, doctors, prices, and appointments. Please tell me what you are interested in.",
    noMessage: "Message is required",
    genericError: "Sorry, something went wrong. Please try again.",
    doctorUnknown:
      "I don’t see an exact specialist match yet, but I can still help guide you and suggest which direction may fit your request best.",
    serviceNoPrice:
      (title) =>
        `I can see that you are interested in “${title}”, but the exact price is not available in the current price list. If you’d like, I can help with the next step and suggest the best way to approach a consultation.`,
    priceKnown:
      (title, price) =>
        `According to the current price list, the cost of “${title}” is ${price}. If you’d like, I can also help with the next step or suggest which specialist to consult.`,
    serviceKnown:
      (title, description) =>
        description
          ? `${title} is available at BeSmile. ${description} If you’d like, I can also help guide you on pricing or the right specialist.`
          : `${title} is available at BeSmile. If you’d like, I can also help with pricing or choosing the right specialist.`,
    doctorListIntro:
      (text) =>
        `At BeSmile, the following specialists are available: ${text}. If you’d like, I can help determine which one is the best fit for your request.`,
    generalDoctors:
      (text) =>
        `At BeSmile, the following specialists are available: ${text}. If you tell me which service you are interested in, I can guide you further.`,
    doctorNoBinding:
      (title) =>
        `I can help guide you regarding “${title}”, but the current data does not contain an exact doctor-to-service mapping. If you’d like, I can suggest the next step and guide you toward a consultation.`,
    followupGeneric:
      "I can help you with the next step and suggest how best to proceed with a consultation or appointment.",
    followupVeneers:
      "For veneers, everything usually starts with a consultation and diagnostics to select the right shape, shade, and treatment plan. If you’d like, I can guide you to the next step.",
    followupImplant:
      "For implant treatment, the first step is usually a consultation and diagnostics to assess the bone condition and choose the appropriate implant system. If you’d like, I can guide you further.",
    followupFillings:
      "For fillings and restorations, treatment usually starts with an examination to understand the scope of work and choose the most suitable restoration option. If you’d like, I can guide you further.",
  },
  az: {
    greeting:
      "Salam. Mən BeSmile concierge köməkçisiyəm. Xidmətlər, həkimlər, qiymətlər və qeydiyyat ilə bağlı kömək edə bilərəm. Sizi konkret nə maraqlandırır?",
    noMessage: "Message is required",
    genericError: "Bağışlayın, xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.",
    doctorUnknown:
      "Hazırda mütəxəssis üzrə tam uyğunluq görmürəm, amma sizi düzgün istiqamətləndirə və hansı həkimin daha uyğun ola biləcəyini izah edə bilərəm.",
    serviceNoPrice:
      (title) =>
        `Görürəm ki, sizi “${title}” xidməti maraqlandırır, amma cari qiymət siyahısında dəqiq məbləğ tapılmadı. İstəsəniz, növbəti addım üzrə sizi yönləndirə bilərəm.`,
    priceKnown:
      (title, price) =>
        `Cari qiymət siyahısına əsasən “${title}” xidmətinin qiyməti ${price}-dir. İstəsəniz, növbəti addım və ya uyğun mütəxəssis barədə də kömək edə bilərəm.`,
    serviceKnown:
      (title, description) =>
        description
          ? `${title} BeSmile-da mövcuddur. ${description} İstəsəniz, qiymət və ya uyğun mütəxəssis barədə də yönləndirə bilərəm.`
          : `${title} BeSmile-da mövcuddur. İstəsəniz, qiymət və ya uyğun mütəxəssis barədə də yönləndirə bilərəm.`,
    doctorListIntro:
      (text) =>
        `BeSmile-da bu mütəxəssislər qəbul edir: ${text}. İstəsəniz, sizin sorğunuza ən uyğun olanı müəyyən etməyə kömək edə bilərəm.`,
    generalDoctors:
      (text) =>
        `BeSmile-da bu mütəxəssislər qəbul edir: ${text}. Hansı xidmətlə maraqlandığınızı yazsanız, sizi daha dəqiq yönləndirərəm.`,
    doctorNoBinding:
      (title) =>
        `“${title}” xidməti üzrə sizi yönləndirə bilərəm, amma cari məlumatlarda bu xidmət üçün konkret həkim bağlantısı görünmür. İstəsəniz, növbəti addımı izah edərəm.`,
    followupGeneric:
      "Növbəti addım və konsultasiya və ya qeydiyyata necə başlamağın daha doğru olacağı barədə kömək edə bilərəm.",
    followupVeneers:
      "Vinirlər üçün adətən ilk addım konsultasiya və diaqnostikadır ki, forma, rəng və müalicə planı düzgün seçilsin. İstəsəniz, sizi növbəti addıma yönləndirə bilərəm.",
    followupImplant:
      "İmplantasiya zamanı adətən ilk addım konsultasiya və diaqnostikadır ki, sümük vəziyyəti qiymətləndirilsin və uyğun implant sistemi seçilsin. İstəsəniz, sizi növbəti addıma yönləndirə bilərəm.",
    followupFillings:
      "Plomb və bərpa prosedurları üçün adətən ilk mərhələ müayinədən başlayır ki, işin həcmi və uyğun bərpa variantı müəyyən edilsin. İstəsəniz, sizi növbəti addıma yönləndirə bilərəm.",
  },
};

const ENTITY_ALIASES: Record<Exclude<EntityKey, null>, string[]> = {
  veneers: [
    "винир",
    "виниры",
    "винира",
    "vinir",
    "veneer",
    "veneers",
    "laminate veneer",
    "ceramic veneer",
    "e-max veneer",
  ],
  medentika: [
    "medentika",
    "медентика",
    "medentika implant",
    "medentika implants",
  ],
  neobiotech: [
    "neobiotech",
    "neo biotech",
    "необиотех",
    "neobiotech implant",
    "neobiotech implants",
  ],
  straumann: [
    "straumann",
    "страуман",
    "straumann implant",
    "straumann implants",
    "roxolid",
  ],
  wisdom_tooth: [
    "зуб мудрости",
    "удаление зуба мудрости",
    "восьмерка",
    "8ка",
    "8 ка",
    "wisdom tooth",
    "wisdom teeth",
    "wisdom tooth extraction",
  ],
  alveolitis: [
    "альвеолит",
    "alveolitis",
    "alveolitis treatment",
    "лечение альвеолита",
  ],
  fillings: [
    "пломба",
    "пломбы",
    "пломбирование",
    "реставрация",
    "эстетическая реставрация",
    "composite restoration",
    "esthetic restoration",
    "filling",
    "fillings",
    "restoration",
  ],
  implant: [
    "имплант",
    "импланты",
    "имплантация",
    "implant",
    "implants",
    "implantation",
    "dental implant",
  ],
  crowns: [
    "коронка",
    "коронки",
    "crown",
    "crowns",
    "zircon crown",
    "zirconia crown",
    "metal ceramic",
    "metal ceramic crown",
  ],
  braces: ["брекет", "брекеты", "braces", "брекет система"],
  aligners: ["элайнер", "элайнеры", "aligner", "aligners", "каппы"],
};

function normalizeLocale(locale?: unknown): Lang {
  return locale === "ru" || locale === "en" || locale === "az" ? locale : "ru";
}

function normalizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanModelText(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/^[-•]\s+/gm, "")
    .replace(/^#+\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeHistory(input: unknown): ChatHistoryItem[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        "role" in item &&
        "content" in item
    )
    .map((item): ChatHistoryItem => {
      const typed = item as { role?: unknown; content?: unknown };

      return {
        role: typed.role === "assistant" ? "assistant" : "user",
        content: typeof typed.content === "string" ? typed.content.trim() : "",
      };
    })
    .filter((item) => item.content.length > 0)
    .slice(-16);
}

function shortText(input: string, maxLength = 160): string {
  const clean = String(input || "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).trim()}…`;
}

function hasCurrency(value: string): boolean {
  return /₼|azn|manat/i.test(value);
}

function formatPrice(value: string): string {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  return hasCurrency(trimmed) ? trimmed : `${trimmed} ₼`;
}

function isGreeting(message: string): boolean {
  const text = normalizeText(message);
  return [
    "привет",
    "здравствуйте",
    "добрый день",
    "добрый вечер",
    "салам",
    "salam",
    "hello",
    "hi",
    "hey",
    "good afternoon",
    "good evening",
  ].includes(text);
}

function detectIntent(message: string): Intent {
  const text = normalizeText(message);

  if (!text) return "general";
  if (isGreeting(text)) return "greeting";

  if (
    [
      "да",
      "давай",
      "ок",
      "okay",
      "хорошо",
      "угу",
      "ага",
      "понял",
      "поняла",
      "сколько",
      "цена",
      "стоимость",
      "а сколько",
      "а цена",
    ].includes(text)
  ) {
    return "followup";
  }

  if (
    /(врач|доктор|специалист|имплантолог|ортодонт|хирург|терапевт|ортопед|к какому специалисту|к кому обратиться|какой врач|кто делает)/i.test(
      text
    )
  ) {
    return "doctor";
  }

  if (/(сколько|цена|стоимость|стоит|price|cost)/i.test(text)) {
    return "price";
  }

  if (
    /(есть|имеется|делаете|интересует|хочу|нужен|нужна|нужно|do you have|offer|available)/i.test(
      text
    )
  ) {
    return "service";
  }

  return "general";
}

function extractEntityFromText(message: string): EntityKey {
  const text = normalizeText(message);

  if (!text) return null;

  for (const [key, aliases] of Object.entries(ENTITY_ALIASES) as Array<
    [Exclude<EntityKey, null>, string[]]
  >) {
    for (const alias of aliases) {
      const normalizedAlias = normalizeText(alias);
      if (!normalizedAlias) continue;
      if (text.includes(normalizedAlias)) {
        return key;
      }
    }
  }

  return null;
}

function getLastMeaningfulUserMessage(
  history: ChatHistoryItem[],
  currentMessage: string
): string {
  const current = normalizeText(currentMessage);

  for (let i = history.length - 1; i >= 0; i -= 1) {
    const item = history[i];
    if (item.role !== "user") continue;

    const normalized = normalizeText(item.content);
    if (!normalized) continue;
    if (normalized === current) continue;

    return item.content;
  }

  return "";
}

function getEntityFromHistory(
  history: ChatHistoryItem[],
  currentMessage: string
): EntityKey {
  const previousMessage = getLastMeaningfulUserMessage(history, currentMessage);
  if (!previousMessage) return null;
  return extractEntityFromText(previousMessage);
}

function resolveEntity(message: string, history: ChatHistoryItem[]): EntityKey {
  const currentEntity = extractEntityFromText(message);
  if (currentEntity) return currentEntity;

  const normalized = normalizeText(message);
  const intent = detectIntent(message);

  if (
    intent === "followup" ||
    normalized.startsWith("а ") ||
    normalized.startsWith("и ") ||
    normalized.startsWith("what about") ||
    normalized.startsWith("and ")
  ) {
    return getEntityFromHistory(history, message);
  }

  return null;
}

function scoreCandidate(entity: EntityKey, haystack: string): number {
  if (!entity) return 0;

  const text = normalizeText(haystack);
  if (!text) return 0;

  const aliases = ENTITY_ALIASES[entity];
  let best = 0;

  for (const alias of aliases) {
    const normalizedAlias = normalizeText(alias);
    if (!normalizedAlias) continue;

    if (text === normalizedAlias) best = Math.max(best, 600);
    if (text.includes(normalizedAlias)) best = Math.max(best, 320);

    const words = normalizedAlias.split(" ").filter((word) => word.length >= 2);
    let partial = 0;

    for (const word of words) {
      if (text.includes(word)) {
        partial += word.length >= 6 ? 35 : 18;
      }
    }

    best = Math.max(best, partial);
  }

  return best;
}

function findPriceByEntity(prices: BotPrice[], entity: EntityKey): BotPrice | null {
  if (!entity) return null;

  const scored = prices
    .map((item) => {
      const haystack = [item.title, item.slug, item.description]
        .filter(Boolean)
        .join(" ");
      return { item, score: scoreCandidate(entity, haystack) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return null;

  return scored[0].score >= 60 ? scored[0].item : null;
}

function findServiceByEntity(
  services: BotService[],
  entity: EntityKey
): BotService | null {
  if (!entity) return null;

  const scored = services
    .map((item) => {
      const haystack = [item.title, item.slug, item.description]
        .filter(Boolean)
        .join(" ");
      return { item, score: scoreCandidate(entity, haystack) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return null;

  return scored[0].score >= 60 ? scored[0].item : null;
}

function findDoctorMatches(doctors: BotDoctor[], query: string): BotDoctor[] {
  const text = normalizeText(query);
  if (!text) return [];

  const scored = doctors
    .map((item) => {
      const haystack = normalizeText(
        [item.name, item.specialty, item.bio].filter(Boolean).join(" ")
      );

      let score = 0;
      if (!haystack) return { item, score };

      if (haystack.includes(text)) score += 200;

      for (const word of text.split(" ").filter((w) => w.length >= 3)) {
        if (haystack.includes(word)) {
          score += 24;
        }
      }

      return { item, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return [];

  return scored
    .filter((x) => x.score >= Math.max(60, scored[0].score - 20))
    .slice(0, 3)
    .map((x) => x.item);
}

function buildPriceAnswer(price: BotPrice, locale: Lang): string {
  const t = MESSAGES[locale];

  if (!price.price) {
    return t.serviceNoPrice(price.title);
  }

  return t.priceKnown(price.title, formatPrice(price.price));
}

function buildServiceAnswer(service: BotService, locale: Lang): string {
  const t = MESSAGES[locale];
  return t.serviceKnown(service.title, shortText(service.description, 170));
}

function buildDoctorAnswer(doctors: BotDoctor[], locale: Lang): string {
  const t = MESSAGES[locale];

  if (!doctors.length) return t.doctorUnknown;

  const text = doctors
    .map((doc) => `${doc.name}${doc.specialty ? ` — ${doc.specialty}` : ""}`)
    .join(", ");

  return t.doctorListIntro(text);
}

function buildGeneralDoctorsAnswer(doctors: BotDoctor[], locale: Lang): string {
  const t = MESSAGES[locale];
  const top = doctors.slice(0, 3);

  if (!top.length) return t.doctorUnknown;

  const text = top
    .map((doc) => `${doc.name}${doc.specialty ? ` — ${doc.specialty}` : ""}`)
    .join(", ");

  return t.generalDoctors(text);
}

function buildFollowupAnswer(entity: EntityKey, locale: Lang): string {
  const t = MESSAGES[locale];

  if (entity === "veneers") return t.followupVeneers;

  if (
    entity === "medentika" ||
    entity === "neobiotech" ||
    entity === "straumann" ||
    entity === "implant"
  ) {
    return t.followupImplant;
  }

  if (entity === "fillings") return t.followupFillings;

  return t.followupGeneric;
}

function buildCompactContext(context: BotContext): string {
  const servicesText = context.services
    .slice(0, 12)
    .map((s) => `- ${s.title}${s.description ? `: ${shortText(s.description, 80)}` : ""}`)
    .join("\n");

  const doctorsText = context.doctors
    .slice(0, 8)
    .map((d) => `- ${d.name}${d.specialty ? ` (${d.specialty})` : ""}`)
    .join("\n");

  const pricesText = context.prices
    .slice(0, 12)
    .map((p) => `- ${p.title}${p.price ? `: ${formatPrice(p.price)}` : ""}`)
    .join("\n");

  return `
Услуги:
${servicesText || "Нет данных"}

Врачи:
${doctorsText || "Нет данных"}

Цены:
${pricesText || "Нет данных"}
`.trim();
}

function buildHistoryText(history: ChatHistoryItem[]): string {
  if (!history.length) return "История диалога пока отсутствует.";

  return history
    .map((item) =>
      item.role === "user"
        ? `Пользователь: ${item.content}`
        : `Ассистент: ${item.content}`
    )
    .join("\n");
}

function buildSystemPrompt(locale: Lang, context: BotContext, history: ChatHistoryItem[]): string {
  const compactContext = buildCompactContext(context);
  const historyText = buildHistoryText(history);

  return `
Ты concierge-ассистент стоматологической клиники BeSmile.

Язык ответа: ${locale}

Стиль:
— спокойный
— премиальный
— профессиональный
— без воды
— без навязчивых продаж

Формат:
— только обычный текст
— без markdown
— без звездочек
— без списков
— максимум 2 коротких абзаца

Правила:
— не выдумывай факты
— не придумывай цены
— не перечисляй похожие варианты без прямого запроса
— не ставь диагноз
— если данных не хватает, говори об этом честно
— учитывай историю диалога
— после полезного ответа можно предложить только один мягкий следующий шаг

Контакты клиники:
Телефон: 070 421 02 04
Адрес: 24 Khan Shushinski, Baku 1007
Email: info@besmile.az

Правило по контактам:
— добавляй контакты только если предлагаешь запись или следующий шаг
— не вставляй контакты в каждый ответ

Контекст:
${compactContext}

История:
${historyText}
`.trim();
}

async function generateFallbackAnswer(
  message: string,
  locale: Lang,
  context: BotContext,
  history: ChatHistoryItem[]
): Promise<string> {
  const systemPrompt = buildSystemPrompt(locale, context, history);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
${systemPrompt}

Текущее сообщение пользователя:
${message}
            `.trim(),
          },
        ],
      },
    ],
  });

  return cleanModelText(
    response.text ?? MESSAGES[locale].genericError
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const locale = normalizeLocale(body?.locale);
    const history = normalizeHistory(body?.history);
    const t = MESSAGES[locale];

    if (!message) {
      return Response.json({ error: t.noMessage }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "GEMINI_API_KEY is not set in environment" },
        { status: 500 }
      );
    }

    const intent = detectIntent(message);
    const entity = resolveEntity(message, history);

    if (intent === "greeting") {
      return Response.json({ answer: t.greeting });
    }

    if (intent === "followup" && entity) {
      return Response.json({ answer: buildFollowupAnswer(entity, locale) });
    }

    const context = await getBotContext(locale);
    const prices = context.prices;
    const services = context.services;
    const doctors = context.doctors;

    const matchedPrice = findPriceByEntity(prices, entity);
    const matchedService = findServiceByEntity(services, entity);

    if (intent === "doctor") {
      const directDoctors = findDoctorMatches(doctors, message);

      if (directDoctors.length > 0) {
        return Response.json({ answer: buildDoctorAnswer(directDoctors, locale) });
      }

      if (matchedService) {
        return Response.json({
          answer: t.doctorNoBinding(matchedService.title),
        });
      }

      return Response.json({
        answer: buildGeneralDoctorsAnswer(doctors, locale),
      });
    }

    if (intent === "price") {
      if (matchedPrice) {
        return Response.json({ answer: buildPriceAnswer(matchedPrice, locale) });
      }

      if (matchedService) {
        return Response.json({ answer: t.serviceNoPrice(matchedService.title) });
      }
    }

    if (intent === "service") {
      if (matchedPrice) {
        return Response.json({ answer: buildPriceAnswer(matchedPrice, locale) });
      }

      if (matchedService) {
        return Response.json({ answer: buildServiceAnswer(matchedService, locale) });
      }
    }

    if (matchedPrice) {
      return Response.json({ answer: buildPriceAnswer(matchedPrice, locale) });
    }

    if (matchedService) {
      return Response.json({ answer: buildServiceAnswer(matchedService, locale) });
    }

    const directDoctors = findDoctorMatches(doctors, message);
    if (directDoctors.length > 0) {
      return Response.json({ answer: buildDoctorAnswer(directDoctors, locale) });
    }

    const answer = await generateFallbackAnswer(message, locale, context, history);

    return Response.json({ answer });
  } catch (error) {
    console.error("CHAT API ERROR:", error);

    return Response.json(
      {
        answer: MESSAGES.ru.genericError,
      },
      { status: 200 }
    );
  }
}