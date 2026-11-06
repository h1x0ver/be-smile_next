import { createDirectus, rest } from "@directus/sdk";
import { cachedFetch } from "../directus";

export const directus = createDirectus(
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://portal.besmile.az",
  { globals: { fetch: cachedFetch } }
).with(rest());
