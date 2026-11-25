import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/learning", "/videos", "/exams", "/leaderboard"],
        disallow: ["/dashboard", "/admin", "/profile", "/practice", "/reset-password"],
      },
    ],
    sitemap: "https://itmaster.edu.vn/sitemap.xml",
  };
}
