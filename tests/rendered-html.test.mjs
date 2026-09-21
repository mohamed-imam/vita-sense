import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the VitaSense website", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>VitaSense \| EEG, VNG, Allergy &amp; NCV Testing<\/title>/i);
  assert.match(html, /Clearer answers\./);
  assert.match(html, /Nerve Conduction Velocity/);
  assert.match(html, /Electroencephalogram/);
  assert.match(html, /Videonystagmography/);
  assert.match(html, /Skin Allergy Test/);
  assert.match(html, /hero-neural-woman\.png/);
  assert.match(html, /action="https:\/\/formsubmit\.co\/info@vita-sense\.com"/);
  assert.match(html, /name="_autoresponse"/);
  assert.match(html, /id="services"/);
  assert.match(html, /id="approach"/);
  assert.match(html, /id="faq"/);
  assert.match(html, /id="contact"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("keeps the finished site free of starter scaffolding and forced scrolling", async () => {
  const [page, layout, home, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/VitaSenseHome.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<VitaSenseHome \/>/);
  assert.match(layout, /VitaSense \| EEG, VNG, Allergy & NCV Testing/);
  assert.match(home, /hero-neural-woman\.png/);
  assert.doesNotMatch(css, /scroll-snap/);
  assert.doesNotMatch(home, /addEventListener\("wheel"|scrollIntoView|handleWheel/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await Promise.all([
    access(new URL("../public/vitasense-logo.png", import.meta.url)),
    access(new URL("../public/vitasense-mark.png", import.meta.url)),
    access(new URL("../public/hero-neural-woman.png", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
  ]);
  await assert.rejects(
    access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)),
  );
});
