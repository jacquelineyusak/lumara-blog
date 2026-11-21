import { BlogCard, CategoryNav, Header, PageContainer, SiteFooter } from "@/components/blog-ui";
import { getCategories, getAllPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("All Business Guides", "Browse Lumara’s practical guides to bookkeeping, tax preparation and compliance for businesses in Bali.", "/posts");

export const revalidate = 3600;

export default function PostsPage() {
  const posts = getAllPosts();
  return <><Header /><main id="main-content"><PageContainer><header className="page-heading"><p className="eyebrow">The archive</p><h1>All Lumara <em>notes.</em></h1><p>A practical library for the systems, deadlines, and decisions that keep a business clear and current.</p></header><CategoryNav categories={getCategories()} /><section className="category-stories"><div className="story-grid">{posts.map((post) => <BlogCard key={post.routePath} post={post} />)}</div></section></PageContainer></main><SiteFooter /></>;
}
