import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/messages/"],
    },
    sitemap: "https://hamtrade.net/sitemap.xml",
  };
}
