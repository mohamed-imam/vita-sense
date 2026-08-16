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
  assert.match(html, /<title>VitaSense \| Nerve, Allergy &amp; Circulation Testing<\/title>/i);
  assert.match(html, /Clearer answers\./);
  assert.match(html, /Nerve testing/);
  assert.match(html, /Allergy testing/);
  assert.match(html, /Circulation testing/);
  assert.match(html, /service-icons\/nerve-test\.svg/);
  assert.match(html, /service-icons\/allergy-test\.svg/);
  assert.match(html, /service-icons\/circulation-test\.svg/);
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
  assert.match(layout, /VitaSense \| Nerve, Allergy & Circulation Testing/);
  assert.match(home, /logo-pulse-one/);
  assert.doesNotMatch(css, /scroll-snap/);
  assert.doesNotMatch(home, /addEventListener\("wheel"|scrollIntoView|handleWheel/);
  assert.match(css, /@keyframes logo-pulse-wave/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await Promise.all([
    access(new URL("../public/vitasense-logo.jpg", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../public/service-icons/nerve-test.svg", import.meta.url)),
    access(new URL("../public/service-icons/allergy-test.svg", import.meta.url)),
    access(new URL("../public/service-icons/circulation-test.svg", import.meta.url)),
  ]);
  await assert.rejects(
    access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)),
  );
});
