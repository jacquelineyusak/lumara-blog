import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header, PageContainer, SiteFooter } from "@/components/blog-ui";
import { getCategories, markdownToHtml, type Post } from "@/lib/blog";

export async function ArticlePage({ post }: { post: Post }) {
  const html = await markdownToHtml(post.content);
  const category = post.categorySlug ? getCategories().find((item) => item.slug === post.categorySlug) : null;
  return <><Header /><main id="main-content"><PageContainer className="article-shell"><article><header className="article-header"><p className="eyebrow">{post.categoryTitle}</p><h1>{post.title}</h1><p className="article-header__dek">{post.excerpt}</p><div className="article-meta"><img src={post.author.picture} alt="" /><span>By {post.author.name}</span><span aria-hidden="true">·</span><span>{post.formattedDate}</span><span aria-hidden="true">·</span><span>{post.readingTime} min read</span></div></header><img className="article-cover" src={post.coverImage} alt="" /><div className="article-content" dangerouslySetInnerHTML={{ __html: html }} /><div className="article-cta"><a href="https://lumara.id/contact">Talk to Lumara ↗</a></div><Link className="article-back" href={category?.routePath ?? "/posts"}><ArrowLeft size={15} aria-hidden="true" />&nbsp; Back to {category?.title ?? "all notes"}</Link></article></PageContainer></main><SiteFooter /></>;
}
