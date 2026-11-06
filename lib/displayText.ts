/** CMS preview text must be identical on the server and in the browser. */
const entities: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  ndash: "–", mdash: "—", hellip: "…", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
  laquo: "«", raquo: "»", bull: "•", middot: "·", copy: "©", reg: "®", trade: "™",
  Ccedil: "Ç", ccedil: "ç", Ouml: "Ö", ouml: "ö", Uuml: "Ü", uuml: "ü", Auml: "Ä", auml: "ä",
  Gbreve: "Ğ", gbreve: "ğ", Idot: "İ", inodot: "ı", Scedil: "Ş", scedil: "ş",
  Eacute: "É", eacute: "é", Egrave: "È", egrave: "è", Ntilde: "Ñ", ntilde: "ñ",
  euro: "€", pound: "£", yen: "¥", cent: "¢", times: "×", divide: "÷", plusmn: "±",
};

export function decodeHtmlEntities(text = ""): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]+);/gi, (match, name: string) => {
    if (!name.startsWith("#")) return entities[name] ?? match;
    const hex = name[1].toLowerCase() === "x";
    const point = Number.parseInt(name.slice(hex ? 2 : 1), hex ? 16 : 10);
    return point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff)
      ? String.fromCodePoint(point) : match;
  });
}

const months = {
  az: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"],
  ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

/** Explicit UTC dates avoid differing client ICU locale support and time zones. */
export function formatBlogDate(value: string | null, lang: keyof typeof months): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = months[lang][date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return lang === "en" ? `${month} ${day}, ${year}` : `${day} ${month} ${year}${lang === "ru" ? " г." : ""}`;
}
