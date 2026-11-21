import { getAllPosts, siteUrl } from "@/lib/blog";

export function GET() {
  const lines = [`# Lumara Notes`, `> Practical bookkeeping, tax preparation and compliance guidance for businesses in Bali, published by Lumara (PT Lumara Karya Nusantara).`, ``, `## Business and author`, `- [Jacqueline Yusak, Founder & Director](https://lumara.id/about#jacqueline)`, `- [Services and current starting prices](https://lumara.id/services)`, `- [Contact Lumara](https://lumara.id/contact)`, ``, `## Articles`, ...getAllPosts().map((post) => `- [${post.title}](${siteUrl()}${post.routePath}): ${post.excerpt}`), ``, `## Feeds`, `- [Sitemap](${siteUrl()}/sitemap.xml)`, `- [RSS](${siteUrl()}/feed.xml)`, `- [Full article text](${siteUrl()}/llms-full.txt)`];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
