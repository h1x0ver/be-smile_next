export function getDirectusUrl() {
  const url =
    process.env.NEXT_PUBLIC_DIRECTUS_URL ||
    process.env.DIRECTUS_URL;

  if (!url) {
    console.error("❌ DIRECTUS_URL is undefined");
    return null;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }

  return url;
}
