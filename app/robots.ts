import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/messages/"], // Ne želimo privatne poruke u pretrazi
    },
    sitemap: "https://ham-market.vercel.app/sitemap.xml",
  };
}
