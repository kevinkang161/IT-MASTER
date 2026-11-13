import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/learning", "/practice", "/exams", "/leaderboard"],
        disallow: ["/dashboard", "/admin", "/profile", "/reset-password"],
      },
    ],
    sitemap: "https://itmaster.edu.vn/sitemap.xml",
  };
}
