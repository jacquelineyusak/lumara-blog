import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/article-page";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { postMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export function generateStaticParams() { return getAllPosts().filter((post) => !post.categorySlug).map((post) => ({ slug: post.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return postMetadata(post);
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return <ArticlePage post={post} />;
}
