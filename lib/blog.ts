import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export type Author = { name: string; picture: string };
export type Category = {
  slug: string;
  title: string;
  seoTitle: string | null;
  description: string;
  featured: string[];
  routePath: string;
};
export type Post = {
  slug: string;
  title: string;
  seoTitle: string | null;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  date: string;
  updated: string | null;
  formattedDate: string;
  formattedUpdated: string | null;
  sourcesChecked: string | null;
  formattedSourcesChecked: string | null;
  readingTime: number;
  author: Author;
  categorySlug: string | null;
  categoryTitle: string;
  routePath: string;
  content: string;
};

const postsDirectory = path.join(process.cwd(), "_posts");
const categoryFile = "_category.md";
const basePath = "/blog";
export const defaultCoverImage = `${basePath}/assets/blog/lumara-editorial.webp`;

function publicAsset(value: string) {
  if (value.startsWith(basePath)) return value;
  return `${basePath}${value.startsWith("/") ? value : `/${value}`}`;
}

function optionalText(value: unknown): string | null {
  return typeof value === "string" ? value.trim() || null : null;
}

function dateOnly(value: unknown): string | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? value : null;
}

function titleize(value: string) {
  return value.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

function readingTime(value: string) {
  return Math.max(2, Math.ceil(value.trim().split(/\s+/).length / 190));
}

export function publicationDate(value: string) {
  // Publication dates start at midnight in Bali.
  return new Date(`${value}T00:00:00+08:00`);
}

function published(value: string) {
  return publicationDate(value) <= new Date();
}

function entries(directory: string) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true });
}

export function getCategories(): Category[] {
  return entries(postsDirectory)
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const categoryPath = path.join(postsDirectory, entry.name, categoryFile);
      const data = fs.existsSync(categoryPath) ? matter(fs.readFileSync(categoryPath, "utf8")).data : {};
      return {
        slug: entry.name,
        title: typeof data.title === "string" ? data.title : titleize(entry.name),
        seoTitle: optionalText(data.seoTitle),
        description: typeof data.description === "string" ? data.description : "",
        featured: Array.isArray(data.featured) ? data.featured.filter((slug): slug is string => typeof slug === "string") : [],
        routePath: `/${entry.name}`,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

function readPost(filePath: string, category: Category | null): Post | null {
  const slug = path.basename(filePath, ".md");
  if (slug === categoryFile.replace(".md", "")) return null;
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  if (typeof data.date !== "string" || !published(data.date)) return null;
  const author = data.author as Record<string, unknown> | undefined;
  if (!author || typeof author.name !== "string" || typeof author.picture !== "string") return null;
  const coverImage = publicAsset(optionalText(data.coverImage) ?? defaultCoverImage);
  const editorial = data.editorial as Record<string, unknown> | undefined;
  const updated = dateOnly(data.updated);
  const sourcesChecked = dateOnly(editorial?.sourcesChecked);
  const categorySlug = category?.slug ?? null;
  return {
    slug,
    title: String(data.title ?? titleize(slug)),
    seoTitle: optionalText(data.seoTitle) ?? optionalText(editorial?.suggestedSeoTitle),
    excerpt: String(data.excerpt ?? ""),
    coverImage: coverImage === `${basePath}/assets/blog/lumara-editorial.png` ? defaultCoverImage : coverImage,
    coverImageAlt: optionalText(data.coverImageAlt) ?? "",
    date: data.date,
    updated,
    formattedDate: formatDate(data.date),
    formattedUpdated: updated ? formatDate(updated) : null,
    sourcesChecked,
    formattedSourcesChecked: sourcesChecked ? formatDate(sourcesChecked) : null,
    readingTime: readingTime(content),
    author: { name: author.name, picture: publicAsset(author.picture) },
    categorySlug,
    categoryTitle: category?.title ?? "Notes",
    routePath: categorySlug ? `/${categorySlug}/${slug}` : `/posts/${slug}`,
    content,
  };
}

export function getAllPosts() {
  const posts: Post[] = [];
  for (const entry of entries(postsDirectory)) {
    if (entry.isFile() && entry.name.endsWith(".md")) {
      const post = readPost(path.join(postsDirectory, entry.name), null);
      if (post) posts.push(post);
    }
    if (entry.isDirectory()) {
      const category = getCategories().find((item) => item.slug === entry.name);
      for (const child of entries(path.join(postsDirectory, entry.name))) {
        if (child.isFile() && child.name.endsWith(".md")) {
          const post = readPost(path.join(postsDirectory, entry.name, child.name), category ?? null);
          if (post) posts.push(post);
        }
      }
    }
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export function getHomepagePosts() { return getAllPosts(); }
export function getPostsByCategory(slug: string) { return getAllPosts().filter((post) => post.categorySlug === slug); }
export function getPostBySlug(slug: string) { return getAllPosts().find((post) => !post.categorySlug && post.slug === slug) ?? null; }
export function getPostByCategoryAndSlug(category: string, slug: string) { return getAllPosts().find((post) => post.categorySlug === category && post.slug === slug) ?? null; }
export async function markdownToHtml(content: string) { return String(await remark().use(remarkGfm).use(remarkHtml).process(content)); }
export { siteUrl } from "./site-url";
