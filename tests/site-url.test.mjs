import assert from "node:assert/strict";
import test from "node:test";
import { resolveBlogUrl } from "../lib/site-url.ts";

test("an unconfigured deployment uses the public Lumara blog", () => {
  assert.equal(resolveBlogUrl(undefined, true), "https://lumara.id/blog");
  assert.equal(resolveBlogUrl("  ", true), "https://lumara.id/blog");
});

test("origin and base-path settings resolve to one /blog prefix", () => {
  for (const input of ["https://lumara.id", "https://lumara.id/", "https://lumara.id/blog", " https://lumara.id/blog/ ", "https://www.lumara.id/blog"]) {
    assert.equal(resolveBlogUrl(input, true), "https://lumara.id/blog");
  }
});

test("production rejects loopback, non-HTTPS and ambiguous canonical URLs", () => {
  for (const input of ["http://localhost:3000/blog", "https://localhost/blog", "https://127.0.0.1/blog", "https://[::1]/blog", "https://0.0.0.0/blog", "https://preview.localhost/blog", "http://lumara.id/blog", "https://preview.vercel.app/blog", "https://example.com/blog", "https://lumara.id/blog/blog", "https://lumara.id/blog?draft=1", "https://lumara.id/blog#notes", "https://user:password@lumara.id/blog", "file:///blog"]) {
    assert.throws(() => resolveBlogUrl(input, true), undefined, input);
  }
});

test("development can use the local proxy without a duplicate base path", () => {
  assert.equal(resolveBlogUrl("http://localhost:3000/blog", false), "http://localhost:3000/blog");
});
