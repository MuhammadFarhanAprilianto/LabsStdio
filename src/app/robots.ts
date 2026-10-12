import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://labsstdio.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/work", "/services", "/about", "/contact", "/blog"],
        disallow: [
          "/admin",
          "/admin/*",
          "/portal",
          "/portal/*",
          "/api/*",
          "/forgot-password",
          "/reset-password",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/work", "/services", "/about", "/contact", "/blog"],
        disallow: ["/admin/*", "/portal/*", "/api/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
