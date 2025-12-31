import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { locales } from "./i18n";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});

// Type guard to check if string is a valid locale
function isValidLocale(locale: string): locale is (typeof locales)[number] {
  return locales.includes(locale as (typeof locales)[number]);
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip intl middleware for API routes
  if (pathname.startsWith("/api/")) {
    return await updateSession(request);
  }

  // Check if user has a locale cookie preference
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;

  // If visiting root path (/) and has a valid locale cookie, redirect to that locale
  if (pathname === "/" && localeCookie && isValidLocale(localeCookie)) {
    return NextResponse.redirect(new URL(`/${localeCookie}`, request.url));
  }

  // If visiting a locale path but cookie has different preference, redirect
  const pathnameLocale = pathname.split("/")[1];
  if (
    localeCookie &&
    isValidLocale(localeCookie) &&
    isValidLocale(pathnameLocale) &&
    pathnameLocale !== localeCookie
  ) {
    // User manually changed locale in URL - update cookie to match
    const response = intlMiddleware(request);
    response.cookies.set("NEXT_LOCALE", pathnameLocale, {
      path: "/",
      maxAge: 31536000, // 1 year
    });
    return await updateSession(request, response);
  }

  const intlResponse = intlMiddleware(request);

  // If next-intl is handling a redirect, return it immediately
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  // Pass the intlResponse to Supabase to preserve the i18n rewrites
  return await updateSession(request, intlResponse);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
