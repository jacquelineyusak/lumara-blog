import { getAllPosts, siteUrl } from "@/lib/blog";

export function GET() {
  const content = getAllPosts().map((post) => `# ${post.title}\n\nURL: ${siteUrl()}${post.routePath}\n\n${post.content.trim()}`).join("\n\n---\n\n");
  return new Response(`# Lumara Notes\n\n${content}`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
