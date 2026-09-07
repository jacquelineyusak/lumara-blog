import { getAllPosts, siteUrl } from "@/lib/blog";

export function GET() {
  const base = siteUrl();
  const items = getAllPosts().map((post) => `<item><title><![CDATA[${post.title}]]></title><link>${base}${post.routePath}</link><guid>${base}${post.routePath}</guid><pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate><description><![CDATA[${post.excerpt}]]></description></item>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Lumara Notes</title><link>${base}</link><description>Clear thinking for growing businesses.</description>${items}</channel></rss>`, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
