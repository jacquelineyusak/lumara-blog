import Link from "next/link";
import type { Category, Post } from "@/lib/blog";

export function PageContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`page-container ${className}`.trim()}>{children}</div>;
}

export function Logo({ light = false }: { light?: boolean }) {
  return <Link href="/" className={`brand-logo${light ? " brand-logo--light" : ""}`} aria-label="Lumara Notes home"><img src="/blog/lumara-logo.svg" alt="Lumara" /></Link>;
}

export function Header() {
  const navItems = [{ label: "Foundations", href: "/foundations" }, { label: "Tax & reporting", href: "/tax-and-reporting" }, { label: "Compliance", href: "/compliance" }];
  return <header className="site-header"><PageContainer className="site-header__inner"><Logo /><nav className="desktop-nav" aria-label="Primary navigation"><Link href="/" aria-current="page">Notes</Link>{navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav><div className="site-header__actions"><a className="header-note" href="https://lumara.id">Lumara.id ↗</a></div></PageContainer></header>;
}

export function CategoryNav({ categories, active }: { categories: Category[]; active?: string }) {
  return <nav className="category-nav" aria-label="Browse topics"><span className="category-nav__label">Browse topics</span>{categories.map((category) => <Link className={active === category.slug ? "is-active" : ""} key={category.slug} href={category.routePath}>{category.title}</Link>)}</nav>;
}

export function BlogCard({ post }: { post: Post }) {
  return <article className="story-card"><Link href={post.routePath} className="story-card__image-link" aria-label={post.title}><img className="story-card__image" src={post.coverImage} alt="" /></Link><p className="eyebrow">{post.categoryTitle}</p><h3><Link href={post.routePath}>{post.title}</Link></h3><p className="story-date">{post.formattedDate} · {post.readingTime} min read</p><p>{post.excerpt}</p><Link className="text-link" href={post.routePath}>Read note <span aria-hidden="true">→</span></Link></article>;
}

export function SiteFooter() {
  return <footer className="site-footer"><PageContainer><div className="site-footer__top"><div className="site-footer__intro"><Logo light /><p>Bookkeeping, tax reporting, and business compliance for PT PMA companies, local businesses, and startups in Bali.</p><a href="https://lumara.id">Visit Lumara.id ↗</a></div><div className="site-footer__links"><div><p className="footer-label">Explore</p><Link href="/">All notes</Link><Link href="/foundations">Foundations</Link><Link href="/tax-and-reporting">Tax &amp; reporting</Link><Link href="/compliance">Compliance</Link></div><div><p className="footer-label">Lumara</p><a href="https://lumara.id/about">About Lumara</a><a href="https://lumara.id/services">Services</a><a href="https://lumara.id/contact">Contact</a></div><div><p className="footer-label">Based in</p><p>Bali, Indonesia</p><p>Clear support, within 24 hours.</p></div></div></div><div className="site-footer__bottom"><p>© {new Date().getFullYear()} Lumara. All rights reserved.</p><p>Practical notes for the work behind the work.</p></div></PageContainer></footer>;
}
