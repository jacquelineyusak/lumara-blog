import type { Metadata } from "next";
import { defaultCoverImage, type Post } from "./blog";
import { absoluteAssetUrl, authorUrl, siteUrl } from "./site-url";

export function pageMetadata(title: string, description: string, routePath = ""): Metadata {
  const url = `${siteUrl()}${routePath}`;
  const images = [{ url: absoluteAssetUrl(defaultCoverImage), width: 1536, height: 1024, alt: "Lumara Notes" }];
  return {
    title: { absolute: `${title} | Lumara Notes` },
    description,
    alternates: { canonical: url, types: { "application/rss+xml": `${siteUrl()}/feed.xml` } },
    openGraph: { type: "website", title, description, url, siteName: "Lumara Notes", images },
    twitter: { card: "summary_large_image", title, description, images: images.map((image) => image.url) },
  };
}

export function postMetadata(post: Post): Metadata {
  const metadata = pageMetadata(post.seoTitle ?? post.title, post.excerpt, post.routePath);
  const image = absoluteAssetUrl(post.coverImage);
  return {
    ...metadata,
    authors: [{ name: post.author.name, url: authorUrl }],
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.date,
      ...(post.updated ? { modifiedTime: post.updated } : {}),
      authors: [authorUrl],
      images: [{ url: image, width: 1536, height: 1024, ...(post.coverImageAlt ? { alt: post.coverImageAlt } : {}) }],
    },
    twitter: { ...metadata.twitter, images: [image] },
  };
}

export function articleSchema(post: Post) {
  const url = `${siteUrl()}${post.routePath}`;
  const breadcrumbItems = [
    { name: "Lumara", item: "https://lumara.id" },
    { name: "Notes", item: siteUrl() },
    ...(post.categorySlug ? [{ name: post.categoryTitle, item: `${siteUrl()}/${post.categorySlug}` }] : []),
    { name: post.title, item: url },
  ];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        headline: post.title,
        description: post.excerpt,
        image: absoluteAssetUrl(post.coverImage),
        datePublished: post.date,
        ...(post.updated ? { dateModified: post.updated } : {}),
        inLanguage: "en",
        articleSection: post.categoryTitle,
        author: { "@type": "Person", "@id": authorUrl, name: post.author.name, url: authorUrl, image: absoluteAssetUrl(post.author.picture) },
        publisher: { "@type": "Organization", "@id": "https://lumara.id#business", name: "Lumara", legalName: "PT Lumara Karya Nusantara", url: "https://lumara.id", logo: { "@type": "ImageObject", url: "https://lumara.id/brand-icon.svg" } },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((item, index) => ({ "@type": "ListItem", position: index + 1, ...item })),
      },
    ],
  };
}
