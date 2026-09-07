import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/article-page";
import { getAllPosts, getPostBySlug, siteUrl } from "@/lib/blog";

export const revalidate = 3600;

export function generateStaticParams() { return getAllPosts().filter((post) => !post.categorySlug).map((post) => ({ slug: post.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt, alternates: { canonical: `${siteUrl()}${post.routePath}` }, openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date, authors: [post.author.name], images: [{ url: post.coverImage }] } };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return <ArticlePage post={post} />;
}
