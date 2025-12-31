import { locales } from "@/i18n";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ham-market.vercel.app";

  const staticPages: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    staticPages.push(
      // Home page
      {
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      // About
      {
        url: `${baseUrl}/${locale}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },
      // How It Works
      {
        url: `${baseUrl}/${locale}/how-it-works`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },
      // FAQ
      {
        url: `${baseUrl}/${locale}/faq`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      // Safety Tips
      {
        url: `${baseUrl}/${locale}/safety-tips`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      // Shipping Guide
      {
        url: `${baseUrl}/${locale}/shipping-guide`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      // Terms
      {
        url: `${baseUrl}/${locale}/terms`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.5,
      },
      // Privacy
      {
        url: `${baseUrl}/${locale}/privacy`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.5,
      },
      // Community Guidelines
      {
        url: `${baseUrl}/${locale}/community-guidelines`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.5,
      },
      // Contact
      {
        url: `${baseUrl}/${locale}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      }
    );
  });

  return staticPages;
}
