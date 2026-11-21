import type { MetadataRoute } from "next";
import { getAllPosts, getCategories, siteUrl } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [{ url: base }, { url: `${base}/posts` }, ...getCategories().map((category) => ({ url: `${base}${category.routePath}` })), ...getAllPosts().map((post) => ({ url: `${base}${post.routePath}`, lastModified: new Date(post.updated ?? post.date) }))];
}
