import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCard, CategoryNav, Header, PageContainer, SiteFooter } from "@/components/blog-ui";
import { getCategories, getPostsByCategory, siteUrl } from "@/lib/blog";

export const revalidate = 3600;

export function generateStaticParams() { return getCategories().map((category) => ({ category: category.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategories().find((item) => item.slug === slug);
  if (!category) return {};
  return { title: category.title, description: category.description, alternates: { canonical: `${siteUrl()}${category.routePath}` } };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCategories().find((item) => item.slug === slug);
  if (!category) notFound();
  const posts = getPostsByCategory(slug);
  return <><Header /><main id="main-content"><PageContainer><header className="page-heading"><p className="eyebrow">Topic</p><h1>{category.title} <em>notes.</em></h1><p>{category.description}</p></header><CategoryNav categories={getCategories()} active={category.slug} /><section className="category-stories"><div className="story-grid">{posts.map((post) => <BlogCard key={post.routePath} post={post} />)}</div></section></PageContainer></main><SiteFooter /></>;
}
