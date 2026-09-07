import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/article-page";
import { getAllPosts, getPostByCategoryAndSlug, siteUrl } from "@/lib/blog";

export const revalidate = 3600;

export function generateStaticParams() { return getAllPosts().filter((post) => post.categorySlug).map((post) => ({ category: post.categorySlug as string, slug: post.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const post = getPostByCategoryAndSlug(category, slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt, alternates: { canonical: `${siteUrl()}${post.routePath}` }, openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date, authors: [post.author.name], images: [{ url: post.coverImage }] } };
}

export default async function CategoryPostPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const post = getPostByCategoryAndSlug(category, slug);
  if (!post) notFound();
  return <ArticlePage post={post} />;
}
