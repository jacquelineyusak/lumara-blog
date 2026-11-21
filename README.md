# Lumara Notes

Lumara Notes is a content-driven blog built with Next.js and designed to deploy as a standalone Vercel project at `/blog`.

## Local development

```bash
npm install
npm run dev
```

The blog runs on [http://localhost:3001/blog](http://localhost:3001/blog).
The main Lumara site proxies `/blog` to this server during local development, so the public local URL is [http://localhost:3000/blog](http://localhost:3000/blog).

## Content

Posts live in `_posts/` as Markdown files with frontmatter. Category folders contain a `_category.md` file and their articles:

```text
_posts/
  first-30-days.md
  foundations/
    _category.md
    clean-start.md
```

The app includes topic archives, article pages, an RSS feed, a sitemap, robots metadata, and plain-text content indexes for assistants and search tools.

## Vercel deployment

Create a Vercel project for this folder and deploy with the default Next.js settings. The included `vercel.json` keeps the build explicit.

Set `NEXT_PUBLIC_SITE_URL` to the public blog URL (the URL visitors and search engines use), not the separate Vercel deployment origin:

```text
https://lumara.id/blog
```

For the main Lumara Vercel project, set `BLOG_ORIGIN` to the blog deployment origin. The main app already rewrites `/blog` and `/blog/*` to this project.

If `NEXT_PUBLIC_SITE_URL` is absent, metadata defaults to `https://lumara.id/blog`. Both `https://lumara.id` and `https://lumara.id/blog` normalize to this blog URL. A production build rejects local or insecure public URLs, and the post-build check verifies generated canonical URLs, social images, and article structured data.

Run `pnpm lint`, `pnpm test`, and `pnpm build` before deployment. The existing Vercel npm install/build workflow is preserved. On the main domain, advertise `https://lumara.id/blog/sitemap.xml` in the root robots file alongside the marketing sitemap; a robots file under `/blog` does not replace the root crawler policy.

Posts support an optional `updated: "YYYY-MM-DD"` frontmatter value. Use it only for real content changes. It is shown on the article and used in structured data and the sitemap; rebuilding does not change content dates. Author bylines link to Jacqueline Yusak’s profile on the main site. For regulatory content, link relevant official sources and verify applicability before publishing rates or deadlines.
