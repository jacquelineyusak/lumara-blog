import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header, PageContainer, SiteFooter } from "@/components/blog-ui";
import { getCategories, markdownToHtml, type Post } from "@/lib/blog";
import { articleSchema } from "@/lib/metadata";
import { authorUrl } from "@/lib/site-url";

export async function ArticlePage({ post }: { post: Post }) {
  const html = await markdownToHtml(post.content);
  const category = post.categorySlug ? getCategories().find((item) => item.slug === post.categorySlug) : null;
  return (
    <>
      <Header />
      <main id="main-content">
        <PageContainer className="article-shell">
          <article>
            <header className="article-header">
              <p className="eyebrow">{post.categoryTitle}</p>
              <h1>{post.title}</h1>
              <p className="article-header__dek">{post.excerpt}</p>
              <div className="article-meta">
                <img src={post.author.picture} alt="" width={34} height={34} />
                <span>By <a href={authorUrl}>{post.author.name}</a></span>
                <span aria-hidden="true">·</span>
                <time dateTime={post.date}>{post.formattedDate}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime} min read</span>
              </div>
              {post.updated && <p className="article-updated">Updated <time dateTime={post.updated}>{post.formattedUpdated}</time></p>}
            </header>
            <img className="article-cover" src={post.coverImage} alt="" width={1536} height={1024} />
            <div className="article-content" dangerouslySetInnerHTML={{ __html: html }} />
            <div className="article-cta"><a href="https://lumara.id/contact">Talk to Lumara ↗</a></div>
            <Link className="article-back" href={category?.routePath ?? "/posts"}><ArrowLeft size={15} aria-hidden="true" />&nbsp; Back to {category?.title ?? "all notes"}</Link>
          </article>
        </PageContainer>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(post)).replace(/</g, "\\u003c") }} />
    </>
  );
}
