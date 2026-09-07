import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export type Author = { name: string; picture: string };
export type Category = { slug: string; title: string; description: string; routePath: string };
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  formattedDate: string;
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

function publicAsset(value: string) {
  if (value.startsWith(basePath)) return value;
  return `${basePath}${value.startsWith("/") ? value : `/${value}`}`;
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

function published(value: string) {
  return new Date(`${value}T23:59:59Z`) <= new Date();
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
        description: typeof data.description === "string" ? data.description : "",
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
  const categorySlug = category?.slug ?? null;
  return {
    slug,
    title: String(data.title ?? titleize(slug)),
    excerpt: String(data.excerpt ?? ""),
    coverImage: publicAsset(String(data.coverImage ?? "/assets/blog/lumara-editorial.png")),
    date: data.date,
    formattedDate: formatDate(data.date),
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
export function siteUrl() { return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000/blog"; }
