import type { MetadataRoute } from "next";
import { getAllPosts, getCategories, siteUrl } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [{ url: base, lastModified: new Date() }, { url: `${base}/posts`, lastModified: new Date() }, ...getCategories().map((category) => ({ url: `${base}${category.routePath}`, lastModified: new Date() })), ...getAllPosts().map((post) => ({ url: `${base}${post.routePath}`, lastModified: new Date(post.date) }))];
}
