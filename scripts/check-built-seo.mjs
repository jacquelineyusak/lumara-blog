import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const output = path.join(process.cwd(), ".next/server/app");
function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(filename) : entry.name.endsWith(".html") ? [filename] : [];
  });
}

let pages = 0;
let articles = 0;
for (const filename of htmlFiles(output)) {
  if (path.basename(filename).startsWith("_")) continue;
  const html = fs.readFileSync(filename, "utf8");
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  assert.ok(canonical, `Missing canonical: ${filename}`);
  assert.match(canonical[1], /^https:\/\/lumara\.id\/blog(?:\/|$)/, filename);
  assert.ok(!/localhost|127\.0\.0\.1|\[::1\]/i.test(canonical[1]), filename);
  assert.ok(!canonical[1].includes("/blog/blog"), filename);
  for (const match of html.matchAll(/<meta (?:property|name)="(?:og:url|og:image|twitter:image)" content="([^"]+)"/g)) {
    assert.match(match[1], /^https:\/\/lumara\.id\//, `Invalid social URL: ${filename}`);
    assert.ok(!match[1].includes("localhost"), filename);
  }
  if (html.includes('property="og:type" content="article"')) {
    const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(json, `Missing article schema: ${filename}`);
    const graph = JSON.parse(json[1])["@graph"];
    const article = graph.find((item) => item["@type"] === "BlogPosting");
    assert.equal(article.url, canonical[1], filename);
    assert.equal(article.author.name, "Jacqueline Yusak", filename);
    assert.equal(article.author.url, "https://lumara.id/about#jacqueline", filename);
    assert.equal(article.publisher["@id"], "https://lumara.id#business", filename);
    articles++;
  }
  pages++;
}
assert.ok(pages > 0 && articles >= 7, "Expected generated blog archives and articles");
console.log(`SEO build check passed: ${pages} pages, ${articles} articles, public canonicals and linked author schemas.`);
