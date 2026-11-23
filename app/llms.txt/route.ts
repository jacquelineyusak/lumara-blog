import { getAllPosts, getCategories, siteUrl, type Post } from "@/lib/blog";

export function GET() {
  const base = siteUrl();
  const posts = getAllPosts();
  const categories = getCategories();
  const postsByRoute = new Map(posts.map((post) => [post.routePath, post]));
  const featured = categories.flatMap((category) => category.featured
    .map((slug) => postsByRoute.get(`${category.routePath}/${slug}`))
    .filter((post) => post !== undefined));
  const featuredRoutes = new Set(featured.map((post) => post.routePath));
  const articleLink = (post: Post) => `- [${post.title}](${base}${post.routePath}): ${post.excerpt}`;
  const lines = [
    "# Lumara Notes",
    "> Practical bookkeeping, tax preparation and compliance guidance for businesses in Bali, published by Lumara (PT Lumara Karya Nusantara).",
    "",
    "## Business and author",
    "- [Jacqueline Yusak, Founder & Director](https://lumara.id/about#jacqueline)",
    "- [Services and current starting prices](https://lumara.id/services)",
    "- [Contact Lumara](https://lumara.id/contact)",
    ...(featured.length ? ["", "## Where to start", ...featured.map(articleLink)] : []),
    "",
    "## Articles",
    ...posts.filter((post) => !featuredRoutes.has(post.routePath)).map(articleLink),
    "",
    "## Feeds",
    `- [Sitemap](${base}/sitemap.xml)`,
    `- [RSS](${base}/feed.xml)`,
    `- [Full article text](${base}/llms-full.txt)`,
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
