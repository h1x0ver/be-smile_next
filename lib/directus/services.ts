import { directus } from "./client";
import { readItems } from "@directus/sdk";

export type Lang = "ru" | "en" | "az";

export async function getServices(lang: Lang) {
  const data = await directus.request(
    readItems("services", {
      fields: [
        "*",
        {
          translations: ["*"] // ✅ ВОТ ЭТО БЫЛО ПРОПУЩЕНО
        }
      ]
    })
  );

  return data.map((service: any) => {
    const t = service.translations.find(
      (tr: any) => tr.language === lang
    );

    return {
      ...service,
      t // ✅ кладём сразу готовый перевод
    };
  });
}
