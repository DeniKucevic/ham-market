import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { locales } from "@/i18n";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: t("description"),
    applicationName: t("appName"),
    keywords: t("keywords"),
    authors: [{ name: t("title") }],
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://ham-market.vercel.app/${locale}`,
      siteName: t("title"),
      locale: locale,
      type: "website",
    },
    alternates: {
      canonical: `https://ham-market.vercel.app/${locale}`,
      languages: {
        en: "https://ham-market.vercel.app/en",
        sr: "https://ham-market.vercel.app/sr",
        "sr-Cyrl": "https://ham-market.vercel.app/sr-Cyrl",
        is: "https://ham-market.vercel.app/is",
        bg: "https://ham-market.vercel.app/bg",
        ro: "https://ham-market.vercel.app/ro",
        de: "https://ham-market.vercel.app/de",
      },
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: t("appNameShort"),
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "32x32" },
        { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/manifest.json",
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  // Get user and profile for navbar
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Providers messages={messages} locale={locale}>
        <div className="flex min-h-screen flex-col">
          <Navbar user={user} profile={profile} locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </div>
      </Providers>
    </div>
  );
}
