import { getWhyBesmile } from "@/lib/directus";
import WhyUsClient from "./WhyUsClient";

export type Lang = "en" | "ru" | "az";

function normalizeLang(lang?: string): Lang {
  if (lang === "ru" || lang === "en" || lang === "az") return lang;
  return "en";
}

export default async function WhyUs({ lang }: { lang: Lang }) {
  const safeLang = normalizeLang(lang);
  const items = await getWhyBesmile(safeLang);

  return <WhyUsClient lang={safeLang} items={Array.isArray(items) ? items : []} />;
}