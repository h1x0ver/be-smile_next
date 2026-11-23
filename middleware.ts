import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const languages = ["ru", "en", "az"];
const defaultLang = "ru";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ НЕ ТРОГАЕМ СЛУЖЕБНЫЕ ФАЙЛЫ
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasLang = languages.some(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)
  );

  if (!hasLang) {
    request.nextUrl.pathname = `/${defaultLang}${pathname === "/" ? "" : pathname}`;
    // The default language is fixed, so the root and legacy paths permanently
    // consolidate into their localized URLs rather than retaining the source URL.
    return NextResponse.redirect(request.nextUrl, 308);
  }

  return NextResponse.next();
}
