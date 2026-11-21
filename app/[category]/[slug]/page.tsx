import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/article-page";
import { getAllPosts, getPostByCategoryAndSlug } from "@/lib/blog";
import { postMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export function generateStaticParams() { return getAllPosts().filter((post) => post.categorySlug).map((post) => ({ category: post.categorySlug as string, slug: post.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const post = getPostByCategoryAndSlug(category, slug);
  if (!post) return {};
  return postMetadata(post);
}

export default async function CategoryPostPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const post = getPostByCategoryAndSlug(category, slug);
  if (!post) notFound();
  return <ArticlePage post={post} />;
}
