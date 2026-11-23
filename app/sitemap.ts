import type { MetadataRoute } from "next";
import { getAllPosts, getCategories, publicationDate, siteUrl } from "@/lib/blog";

// Refresh alongside the blog archives as scheduled articles become public.
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: base },
    { url: `${base}/posts` },
    ...getCategories().map((category) => ({ url: `${base}${category.routePath}` })),
    ...getAllPosts().map((post) => ({
      url: `${base}${post.routePath}`,
      lastModified: post.updated ? new Date(post.updated) : publicationDate(post.date),
    })),
  ];
}
