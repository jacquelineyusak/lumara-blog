import { getAllPosts, siteUrl } from "@/lib/blog";
import { authorUrl } from "@/lib/site-url";

export function GET() {
  const base = siteUrl();
  const content = getAllPosts().map((post) => [
    `# ${post.title}`,
    "",
    `URL: ${base}${post.routePath}`,
    `Author: ${post.author.name} (${authorUrl})`,
    `Published: ${post.date}`,
    ...(post.updated && post.updated !== post.date ? [`Updated: ${post.updated}`] : []),
    ...(post.sourcesChecked ? [`Official sources checked: ${post.sourcesChecked}`] : []),
    "",
    post.content.trim(),
  ].join("\n")).join("\n\n---\n\n");
  return new Response(`# Lumara Notes\n\n${content}`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
