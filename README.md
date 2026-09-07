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

Set `NEXT_PUBLIC_SITE_URL` to the public `/blog` URL of the deployment, for example:

```text
https://www.example.com/blog
```

For the main Lumara Vercel project, set `BLOG_ORIGIN` to the blog deployment origin. The main app already rewrites `/blog` and `/blog/*` to this project.
