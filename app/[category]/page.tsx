import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard, CategoryNav, Header, PageContainer, SiteFooter } from "@/components/blog-ui";
import { getCategories, getPostsByCategory } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export function generateStaticParams() { return getCategories().map((category) => ({ category: category.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategories().find((item) => item.slug === slug);
  if (!category) return {};
  return pageMetadata(category.seoTitle ?? category.title, category.description, category.routePath);
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const categories = getCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const posts = getPostsByCategory(slug);
  const postsBySlug = new Map(posts.map((post) => [post.slug, post]));
  const featured = category.featured.map((slug) => postsBySlug.get(slug)).filter((post) => post !== undefined);
  const otherPosts = posts.filter((post) => !category.featured.includes(post.slug));

  return (
    <>
      <Header />
      <main id="main-content">
        <PageContainer>
          <header className="page-heading">
            <p className="eyebrow">Topic</p>
            <h1>{category.title} <em>notes.</em></h1>
            <p>{category.description}</p>
          </header>
          <CategoryNav categories={categories} active={category.slug} />
          {featured.length > 0 && (
            <section className="topic-guides" aria-labelledby="topic-guides-title">
              <h2 id="topic-guides-title">Start with these guides</h2>
              <ul>
                {featured.map((post) => (
                  <li key={post.routePath}>
                    <h3><Link href={post.routePath}>{post.title}</Link></h3>
                    <p>{post.excerpt}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="category-stories" aria-label={`All ${category.title.toLowerCase()} notes`}>
            <div className="story-grid">
              {otherPosts.map((post, index) => <BlogCard key={post.routePath} post={post} eager={index === 0 && featured.length === 0} />)}
            </div>
          </section>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
