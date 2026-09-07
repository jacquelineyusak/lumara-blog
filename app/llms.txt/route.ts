import { getAllPosts, siteUrl } from "@/lib/blog";

export function GET() {
  const lines = [`# Lumara Notes`, `> Clear thinking for growing businesses.`, ``, `## Articles`, ...getAllPosts().map((post) => `- [${post.title}](${siteUrl()}${post.routePath}): ${post.excerpt}`)];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
