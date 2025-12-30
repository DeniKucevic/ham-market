import { Providers } from "@/components/providers";
import { locales } from "@/i18n";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "HAM Radio Marketplace",
    template: "%s | HAM Radio Marketplace",
  },
  description: "Buy and sell amateur radio equipment with fellow operators",
  applicationName: "HAM Radio Marketplace",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HAM Market",
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Providers messages={messages} locale={locale}>
        {children}
      </Providers>
    </div>
  );
}
