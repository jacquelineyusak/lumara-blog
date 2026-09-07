import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { BlogCard, CategoryNav, Header, PageContainer, SiteFooter } from "@/components/blog-ui";
import { getCategories, getHomepagePosts } from "@/lib/blog";

export const revalidate = 3600;

export default function HomePage() {
  const posts = getHomepagePosts();
  const categories = getCategories();
  const [featured, ...morePosts] = posts;

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="notes-hero">
          <div className="notes-hero__glow notes-hero__glow--one" aria-hidden="true" />
          <div className="notes-hero__glow notes-hero__glow--two" aria-hidden="true" />
          <PageContainer className="notes-hero__inner">
            <div className="notes-hero__copy">
              <p className="eyebrow eyebrow--copper">Lumara / Notes</p>
              <h1>Clear thinking for <em>growing businesses.</em></h1>
              <p className="notes-hero__lead">
                Practical guidance on bookkeeping, tax reporting, compliance, and the systems that help a business feel lighter.
              </p>
              <div className="notes-hero__meta">
                <span><BookOpen size={16} aria-hidden="true" /> Field notes from Bali</span>
                <span><CheckCircle2 size={16} aria-hidden="true" /> Written in plain language</span>
              </div>
            </div>
            <div className="notes-hero__mark" aria-hidden="true">
              <span className="notes-hero__mark-ring notes-hero__mark-ring--one" />
              <span className="notes-hero__mark-ring notes-hero__mark-ring--two" />
              <span className="notes-hero__mark-card"><span /><span /><span /><span /></span>
              <span className="notes-hero__mark-dot notes-hero__mark-dot--one" />
              <span className="notes-hero__mark-dot notes-hero__mark-dot--two" />
            </div>
          </PageContainer>
        </section>

        <PageContainer>
          <div className="notes-intro">
            <div>
              <p className="eyebrow">Start here</p>
              <h2>Ideas that make the next step <em>clearer.</em></h2>
            </div>
            <p>From setting up good habits early to staying ahead of recurring obligations, these notes are designed to be useful before you need them.</p>
          </div>
          <CategoryNav categories={categories} />

          {featured ? (
            <>
              <article className="featured-story">
                <Link href={featured.routePath} className="featured-story__image-link" aria-label={featured.title}>
                  <img src={featured.coverImage} alt="" className="featured-story__image" />
                  <span className="featured-story__image-label">Featured note</span>
                </Link>
                <div className="featured-story__copy">
                  <p className="eyebrow">{featured.categoryTitle}</p>
                  <h2><Link href={featured.routePath}>{featured.title}</Link></h2>
                  <p className="story-date">{featured.formattedDate} · {featured.readingTime} min read</p>
                  <p className="story-excerpt">{featured.excerpt}</p>
                  <div className="story-author"><img src={featured.author.picture} alt="" /><span>By {featured.author.name}</span></div>
                  <Link className="text-link" href={featured.routePath}>Read the note <ArrowRight size={17} aria-hidden="true" /></Link>
                </div>
              </article>
              <section className="more-stories" aria-labelledby="more-stories-title">
                <div className="section-heading section-heading--split">
                  <div><p className="eyebrow">Keep exploring</p><h2 id="more-stories-title">More notes</h2></div>
                  <p>Short, practical reads for the work behind the work.</p>
                </div>
                <div className="story-grid">
                  {morePosts.map((post) => <BlogCard key={post.routePath} post={post} />)}
                </div>
              </section>
            </>
          ) : (
            <div className="empty-state"><p className="eyebrow">Coming soon</p><h2>The first note is on its way.</h2></div>
          )}
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
