const productionBlogUrl = "https://lumara.id/blog";

/** The public URL is independent of the Vercel origin serving the rewrite. */
export function resolveBlogUrl(configuredUrl?: string, production = process.env.NODE_ENV === "production") {
  const url = new URL(configuredUrl?.trim() || productionBlogUrl);
  const hostname = url.hostname.toLowerCase();
  const isLocal = hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local") || hostname === "[::1]" || hostname === "0.0.0.0" || /^127\./.test(hostname);

  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be a public HTTP(S) origin or /blog URL without credentials, query parameters or a fragment.");
  }
  if (production && (isLocal || url.protocol !== "https:")) {
    throw new Error("Production blog metadata requires a public HTTPS NEXT_PUBLIC_SITE_URL; localhost URLs cannot be deployed.");
  }
  if (!isLocal && !["lumara.id", "www.lumara.id"].includes(hostname)) {
    throw new Error("NEXT_PUBLIC_SITE_URL must use lumara.id, not the blog’s Vercel deployment origin.");
  }
  if (!["", "/", "/blog", "/blog/"].includes(url.pathname)) {
    throw new Error("NEXT_PUBLIC_SITE_URL must point to the site origin or its /blog path.");
  }
  return `${isLocal ? url.origin : "https://lumara.id"}/blog`;
}

export function siteUrl() {
  return resolveBlogUrl(process.env.NEXT_PUBLIC_SITE_URL);
}

export const authorUrl = "https://lumara.id/about#jacqueline";

export function absoluteAssetUrl(asset: string) {
  return new URL(asset, new URL(siteUrl()).origin).href;
}
