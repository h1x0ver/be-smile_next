// Directus resizes/compresses images on the fly and caches the result,
// so photos never ship as multi-megabyte originals.
const DIRECTUS_URL = (
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://portal.besmile.az"
).replace(/\/$/, "");

export function directusImage(
  file: unknown,
  width: number,
  quality = 78
): string {
  const id =
    typeof file === "string"
      ? file
      : typeof file === "object" && file !== null && "id" in file
        ? String((file as { id?: string }).id ?? "")
        : "";

  if (!id) return "";
  if (id.startsWith("http")) return id;

  return `${DIRECTUS_URL}/assets/${id}?width=${width}&quality=${quality}&format=webp&withoutEnlargement=true`;
}

export function directusSrcSet(
  file: unknown,
  widths: number[],
  quality = 78
): string {
  return widths
    .map((w) => {
      const url = directusImage(file, w, quality);
      return url ? `${url} ${w}w` : "";
    })
    .filter(Boolean)
    .join(", ");
}

/** Responsive variants of an existing CMS URL, preserving its crop options. */
export function responsiveAssetSrcSet(source: string, widths: number[]): string | undefined {
  try {
    const url = new URL(source);
    if (url.origin !== new URL(DIRECTUS_URL).origin || !url.pathname.startsWith("/assets/")) {
      return undefined;
    }
    return widths.map((width) => {
      const variant = new URL(url);
      variant.searchParams.set("width", String(width));
      variant.searchParams.set("format", "webp");
      variant.searchParams.set("withoutEnlargement", "true");
      return `${variant.href} ${width}w`;
    }).join(", ");
  } catch {
    return undefined;
  }
}

/**
 * The first request for a new Directus size can fail while it is being
 * generated. Retry once, bypassing the browser cache. Use as <img onError>.
 */
export function retryImageOnce(e: { currentTarget: HTMLImageElement }) {
  const img = e.currentTarget;
  if (img.dataset.retried) return;
  img.dataset.retried = "1";
  const src = img.currentSrc || img.src;
  if (!src) return;
  img.removeAttribute("srcset");
  img.src = `${src}${src.includes("?") ? "&" : "?"}retry=1`;
}
