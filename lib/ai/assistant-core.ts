import {
  getClinicContext,
  normalizeHistory,
  normalizeText,
  type ChatHistoryItem,
  type ClinicContext,
  type ClinicDoctor,
  type ClinicPrice,
  type ClinicService,
  type Lang,
} from "@/lib/ai/clinic";

type BuildReplyParams = {
  message: string;
  history: unknown;
};

type RankedService = ClinicService & { score: number };
type RankedDoctor = ClinicDoctor & { score: number };
type RankedPrice = ClinicPrice & { score: number };

type RankedContext = {
  services: RankedService[];
  doctors: RankedDoctor[];
  prices: RankedPrice[];
};

type ModelJson = {
  answer?: string;
  grounded?: boolean;
  mode?: "general" | "clinic" | "fallback";
};

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function detectLanguage(input: string): Lang {
  const text = String(input || "");

  const hasCyrillic = /[А-Яа-яЁё]/.test(text);
  if (hasCyrillic) return "ru";

  const azChars = /[əğıöşçüƏĞIİÖŞÇÜ]/.test(text);
  if (azChars) return "az";

  return "en";
}

function formatPrice(value: string, isFromPrice?: boolean) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";

  const withCurrency = /₼|azn|manat/i.test(trimmed) ? trimmed : `${trimmed} ₼`;
  return isFromPrice ? `от ${withCurrency}` : withCurrency;
}

function pickCopy(
  lang: Lang,
  variants: { ru: string; en: string; az: string }
) {
  if (lang === "en") return variants.en;
  if (lang === "az") return variants.az;
  return variants.ru;
}

function isGreeting(message: string) {
  const text = normalizeText(message);

  return (
    text === "привет" ||
    text === "здравствуйте" ||
    text === "добрый день" ||
    text === "добрый вечер" ||
    text === "салам" ||
    text === "hello" ||
    text === "hi" ||
    text === "hey" ||
    text.startsWith("привет ") ||
    text.startsWith("здравствуйте ") ||
    text.startsWith("hello ") ||
    text.startsWith("hi ") ||
    text.startsWith("hey ") ||
    text.startsWith("salam ")
  );
}

function isSmallTalk(message: string) {
  const text = normalizeText(message);

  return (
    text === "как дела" ||
    text === "как ты" ||
    text === "чем занимаешься" ||
    text === "что делаешь" ||
    text === "как жизнь" ||
    text === "how are you" ||
    text === "how are you doing" ||
    text === "necəsən" ||
    text === "necesen"
  );
}

function isIdentityIntent(message: string) {
  const text = normalizeText(message);

  return (
    text.includes("кто ты") ||
    text.includes("ты кто") ||
    text.includes("что ты умеешь") ||
    text.includes("чем помогаешь") ||
    text.includes("what are you") ||
    text.includes("who are you") ||
    text.includes("sən kimsən") ||
    text.includes("sen kimsen")
  );
}

function isThanks(message: string) {
  const text = normalizeText(message);

  return (
    text === "спасибо" ||
    text === "спасибо большое" ||
    text === "благодарю" ||
    text === "thanks" ||
    text === "thank you" ||
    text === "cox sag ol" ||
    text === "çox sağ ol" ||
    text === "tesekkurler" ||
    text === "teşəkkürlər"
  );
}

function isBadLanguage(message: string) {
  const text = normalizeText(message);

  return (
    text.includes("еблан") ||
    text.includes("дебил") ||
    text.includes("идиот") ||
    text.includes("тупой") ||
    text.includes("сука") ||
    text.includes("выблядок")
  );
}

function isPriceIntent(message: string) {
  const text = normalizeText(message);

  return (
    text.includes("сколько") ||
    text.includes("цена") ||
    text.includes("стоимость") ||
    text.includes("стоит") ||
    text.includes("price") ||
    text.includes("how much") ||
    text.includes("qiymet") ||
    text.includes("qiymət") ||
    text.includes("neçədir") ||
    text.includes("necedir")
  );
}

function isDoctorIntent(message: string) {
  const text = normalizeText(message);

  return (
    text.includes("врач") ||
    text.includes("доктор") ||
    text.includes("доктора") ||
    text.includes("специалист") ||
    text.includes("кто делает") ||
    text.includes("к какому врачу") ||
    text.includes("doctor") ||
    text.includes("doctors") ||
    text.includes("hekim") ||
    text.includes("həkim")
  );
}

function isServiceIntent(message: string) {
  const text = normalizeText(message);

  return (
    text.includes("услуга") ||
    text.includes("делаете") ||
    text.includes("есть") ||
    text.includes("имеется") ||
    text.includes("интересует") ||
    text.includes("хочу") ||
    text.includes("service") ||
    text.includes("services") ||
    text.includes("var") ||
    text.includes("edirsiniz")
  );
}

function isShortContinuation(message: string) {
  const text = normalizeText(message);

  return [
    "да",
    "давай",
    "ок",
    "хорошо",
    "угу",
    "ага",
    "понял",
    "поняла",
    "а цена",
    "а стоимость",
    "а сколько стоит",
    "сколько стоит",
    "цена",
    "стоимость",
    "and price",
    "price",
    "ok",
    "yes",
  ].includes(text);
}

function getLastMeaningfulUserMessage(
  history: ChatHistoryItem[],
  currentMessage: string
) {
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

function resolveEffectiveQuery(history: ChatHistoryItem[], message: string) {
  const prev = getLastMeaningfulUserMessage(history, message);
  if (!prev) return message;

  if (isShortContinuation(message)) {
    return `${prev} ${message}`;
  }

  return message;
}

const synonymGroups = [
  ["винир", "виниры", "veneer", "veneers"],
  ["имплант", "имплантация", "implant", "implantation", "implantlar"],
  ["коронка", "коронки", "crown", "crowns"],
  ["брекет", "брекеты", "braces", "bracket"],
  ["элайнер", "элайнеры", "aligner", "aligners"],
  ["зуб мудрости", "восьмерка", "wisdom tooth"],
  ["альвеолит", "alveolitis"],
  ["кистэктомия", "cystectomy"],
  ["medentika", "медентика"],
  ["straumann", "страуман"],
  ["neobiotech", "необиотех"],
  ["dentis", "дентис"],
];

function buildAliases(query: string) {
  const normalized = normalizeText(query);
  const result = new Set<string>([normalized]);

  for (const group of synonymGroups) {
    if (group.some((item) => normalized.includes(normalizeText(item)))) {
      for (const item of group) {
        result.add(normalizeText(item));
      }
    }
  }

  return Array.from(result);
}

function scoreCandidate(query: string, candidate: string) {
  const qVariants = buildAliases(query);
  const c = normalizeText(candidate);

  if (!c) return 0;

  let best = 0;

  for (const variant of qVariants) {
    if (!variant) continue;

    if (c === variant) best = Math.max(best, 260);
    if (c.includes(variant)) best = Math.max(best, 190);

    const words = variant.split(" ").filter((w) => w.length >= 2);
    let partial = 0;

    for (const word of words) {
      if (c.includes(word)) {
        partial += word.length >= 6 ? 24 : 12;
      }
    }

    best = Math.max(best, partial);
  }

  return best;
}

function rankContext(query: string, context: ClinicContext): RankedContext {
  const services = context.services
    .map((item) => ({
      ...item,
      score: scoreCandidate(query, [item.title, item.description, item.slug].join(" ")),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const doctors = context.doctors
    .map((item) => ({
      ...item,
      score: scoreCandidate(query, [item.name, item.specialty, item.bio].join(" ")),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const prices = context.prices
    .map((item) => ({
      ...item,
      score: scoreCandidate(query, [item.title, item.description, item.slug].join(" ")),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return { services, doctors, prices };
}

function buildGreetingAnswer(lang: Lang) {
  return pickCopy(lang, {
    ru: "Здравствуйте. Я concierge-ассистент BeSmile. Помогаю по услугам, врачам, ценам и записи. Подскажите, что именно вас интересует?",
    en: "Hello. I am the BeSmile concierge assistant. I can help with services, doctors, prices, and booking. Tell me what you are interested in.",
    az: "Salam. Mən BeSmile concierge köməkçisiyəm. Xidmətlər, həkimlər, qiymətlər və qeydiyyatla bağlı kömək edirəm. Sizi nə maraqlandırır?",
  });
}

function buildSmallTalkAnswer(lang: Lang) {
  return pickCopy(lang, {
    ru: "Спасибо, у меня всё хорошо. Я на связи и готов помочь по любым вопросам о клинике, а также могу просто поддержать обычный диалог.",
    en: "I am doing well, thank you. I am here and ready to help with clinic questions, and I can also keep a normal conversation.",
    az: "Təşəkkür edirəm, məndə hər şey qaydasındadır. Klinikayla bağlı suallarda kömək etməyə hazıram və adi söhbəti də davam etdirə bilərəm.",
  });
}

function buildIdentityAnswer(lang: Lang) {
  return pickCopy(lang, {
    ru: "Я AI concierge-ассистент BeSmile. Помогаю пациентам с услугами, врачами, ценами, записью и общими вопросами в спокойном и понятном формате.",
    en: "I am the BeSmile AI concierge assistant. I help patients with services, doctors, prices, booking, and general questions in a clear and calm way.",
    az: "Mən BeSmile AI concierge köməkçisiyəm. Xidmətlər, həkimlər, qiymətlər, qeydiyyat və ümumi suallarla bağlı aydın şəkildə kömək edirəm.",
  });
}

function buildThanksAnswer(lang: Lang) {
  return pickCopy(lang, {
    ru: "Пожалуйста. Если хотите, можете сразу написать вопрос, и я отвечу по делу.",
    en: "You are welcome. You can send your question anytime, and I will answer clearly.",
    az: "Buyurun. İstəsəniz, sualınızı indi yaza bilərsiniz, mən də aydın cavab verərəm.",
  });
}

function buildBoundaryAnswer(lang: Lang) {
  return pickCopy(lang, {
    ru: "Я могу помочь спокойно и по делу. Просто напишите ваш вопрос, и я постараюсь ответить максимально точно.",
    en: "I can help calmly and clearly. Just send your question, and I will answer as accurately as possible.",
    az: "Mən sakit və aydın şəkildə kömək edə bilərəm. Sadəcə sualınızı yazın, mən də mümkün qədər dəqiq cavab verim.",
  });
}

function buildDoctorAnswer(lang: Lang, doctors: RankedDoctor[]) {
  const text = doctors
    .slice(0, 3)
    .map((doc) => (doc.specialty ? `${doc.name} — ${doc.specialty}` : doc.name))
    .join(", ");

  return pickCopy(lang, {
    ru: `По вашему запросу могут подойти следующие специалисты: ${text}. Если скажете, какая именно процедура вас интересует, я сориентирую точнее.`,
    en: `The following doctors may be relevant for your request: ${text}. If you tell me which procedure you are interested in, I will narrow it down more precisely.`,
    az: `Sizin sorğunuza uyğun ola biləcək həkimlər bunlardır: ${text}. Hansı prosedurun sizi maraqlandırdığını yazsanız, daha dəqiq yönləndirərəm.`,
  });
}

function buildServiceAnswer(lang: Lang, service: RankedService) {
  const description = String(service.description || "").trim();

  return pickCopy(lang, {
    ru: description
      ? `${service.title} доступна в BeSmile. ${description}`
      : `${service.title} доступна в BeSmile.`,
    en: description
      ? `${service.title} is available at BeSmile. ${description}`
      : `${service.title} is available at BeSmile.`,
    az: description
      ? `${service.title} BeSmile-da mövcuddur. ${description}`
      : `${service.title} BeSmile-da mövcuddur.`,
  });
}

function buildPriceAnswer(lang: Lang, price: RankedPrice) {
  if (!price.price) {
    return pickCopy(lang, {
      ru: `Я нашёл позицию «${price.title}», но точная стоимость в текущем прайсе не указана. Если хотите, я помогу сориентироваться по следующему шагу.`,
      en: `I found "${price.title}", but the exact price is not specified in the current price list. If you want, I can still guide you on the next step.`,
      az: `"${price.title}" xidmətini tapdım, amma cari qiymət cədvəlində dəqiq məbləğ göstərilməyib. İstəsəniz, növbəti addım üzrə kömək edərəm.`,
    });
  }

  return pickCopy(lang, {
    ru: `По текущему прайсу стоимость услуги «${price.title}» составляет ${formatPrice(
      price.price,
      price.isFromPrice
    )}. Если хотите, я могу также подсказать следующий шаг или помочь с выбором врача.`,
    en: `According to the current price list, "${price.title}" costs ${formatPrice(
      price.price,
      price.isFromPrice
    )}. If you want, I can also suggest the next step or help with the right doctor.`,
    az: `Cari qiymət cədvəlinə əsasən "${price.title}" xidmətinin qiyməti ${formatPrice(
      price.price,
      price.isFromPrice
    )} təşkil edir. İstəsəniz, növbəti addım və uyğun həkimlə bağlı da kömək edə bilərəm.`,
  });
}

function buildNoDataAnswer(lang: Lang) {
  return pickCopy(lang, {
    ru: "Я пока не вижу достаточно надёжных данных, чтобы ответить точно. Уточните, пожалуйста, услугу, врача или процедуру, и я отвечу конкретнее.",
    en: "I do not see enough reliable data yet to answer precisely. Please clarify the service, doctor, or procedure, and I will answer more specifically.",
    az: "Dəqiq cavab vermək üçün hələ kifayət qədər etibarlı məlumat görmürəm. Xidmət, həkim və ya proseduru dəqiqləşdirsəniz, daha konkret cavab verərəm.",
  });
}

async function callGeminiJson(prompt: string): Promise<ModelJson | null> {
  if (!GEMINI_API_KEY) return null;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) return null;

  const json = await res.json();
  const text =
    json?.candidates?.[0]?.content?.parts?.[0]?.text &&
    typeof json.candidates[0].content.parts[0].text === "string"
      ? json.candidates[0].content.parts[0].text
      : "";

  if (!text) return null;

  try {
    return JSON.parse(text) as ModelJson;
  } catch {
    return null;
  }
}

function buildModelPrompt(params: {
  lang: Lang;
  message: string;
  effectiveQuery: string;
  history: ChatHistoryItem[];
  ranked: RankedContext;
}) {
  const { lang, message, effectiveQuery, history, ranked } = params;

  const historyText = history.length
    ? history
        .map((item) =>
          item.role === "user"
            ? `User: ${item.content}`
            : `Assistant: ${item.content}`
        )
        .join("\n")
    : "No history.";

  return `
You are the premium AI concierge assistant for BeSmile dental clinic.

Rules:
- Reply only in ${lang}.
- Sound calm, clear, premium, and human.
- No markdown.
- No bullet points.
- Maximum 2 short paragraphs.
- You may answer normal conversational messages naturally.
- For clinic facts, use only the provided candidates.
- Never invent prices, doctors, services, or medical facts.
- Do not diagnose.
- If clinic data is insufficient, say so honestly.

User message:
${message}

Resolved user query:
${effectiveQuery}

Clinic candidates:

Prices:
${ranked.prices
  .map(
    (x) =>
      `- ${x.title} | price=${x.price || "none"} | from=${
        x.isFromPrice ? "yes" : "no"
      } | score=${x.score} | ${x.description || ""}`
  )
  .join("\n") || "- none"}

Services:
${ranked.services
  .map((x) => `- ${x.title} | score=${x.score} | ${x.description || ""}`)
  .join("\n") || "- none"}

Doctors:
${ranked.doctors
  .map(
    (x) =>
      `- ${x.name} | ${x.specialty || ""} | score=${x.score} | ${x.bio || ""}`
  )
  .join("\n") || "- none"}

History:
${historyText}

Return strict JSON:
{
  "answer": "string",
  "grounded": true,
  "mode": "general"
}
`.trim();
}

export async function buildAssistantReply(params: BuildReplyParams) {
  const message = String(params.message || "").trim();
  const history = normalizeHistory(params.history);
  const lang = detectLanguage(message);
  const effectiveQuery = resolveEffectiveQuery(history, message);

  if (isBadLanguage(message)) {
    return buildBoundaryAnswer(lang);
  }

  if (isGreeting(message)) {
    return buildGreetingAnswer(lang);
  }

  if (isSmallTalk(message)) {
    return buildSmallTalkAnswer(lang);
  }

  if (isIdentityIntent(message)) {
    return buildIdentityAnswer(lang);
  }

  if (isThanks(message)) {
    return buildThanksAnswer(lang);
  }

  const clinic = await getClinicContext(lang);
  const ranked = rankContext(effectiveQuery, clinic);

  const doctorIntent = isDoctorIntent(effectiveQuery);
  const priceIntent = isPriceIntent(effectiveQuery);
  const serviceIntent = isServiceIntent(effectiveQuery);

  const topDoctorScore = ranked.doctors[0]?.score || 0;
  const topServiceScore = ranked.services[0]?.score || 0;
  const topPriceScore = ranked.prices[0]?.score || 0;

  if (doctorIntent && topDoctorScore >= 110) {
    return buildDoctorAnswer(lang, ranked.doctors);
  }

  if (priceIntent && topPriceScore >= 145) {
    return buildPriceAnswer(lang, ranked.prices[0]);
  }

  if (serviceIntent && topServiceScore >= 135) {
    return buildServiceAnswer(lang, ranked.services[0]);
  }

  if (!doctorIntent && !priceIntent && !serviceIntent) {
    if (topDoctorScore >= 175) {
      return buildDoctorAnswer(lang, ranked.doctors);
    }

    if (topServiceScore >= 190) {
      return buildServiceAnswer(lang, ranked.services[0]);
    }
  }

  const prompt = buildModelPrompt({
    lang,
    message,
    effectiveQuery,
    history,
    ranked,
  });

  const modelJson = await callGeminiJson(prompt);

  if (
    modelJson?.grounded &&
    typeof modelJson.answer === "string" &&
    modelJson.answer.trim()
  ) {
    return modelJson.answer.trim();
  }

  return buildNoDataAnswer(lang);
}