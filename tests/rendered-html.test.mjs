import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const siteBase = process.env.GITHUB_ACTIONS === "true"
  ? "https://mohamed-imam.github.io/vita-sense"
  : "https://vita-sense.com";

test("exports the VitaSense homepage for static hosting", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
  assert.match(html, /<title>VitaSense \| EEG, VNG, Allergy &amp; NCV Testing<\/title>/i);
  assert.match(html, /Clearer answers\./);
  assert.match(html, /Nerve Conduction Velocity/);
  assert.match(html, /Electroencephalogram/);
  assert.match(html, /Videonystagmography/);
  assert.match(html, /Skin Allergy Test/);
  assert.match(html, /hero-neural-woman\.webp/);
  assert.ok(html.includes(`rel="canonical" href="${siteBase}"`) || html.includes(`rel="canonical" href="${siteBase}/"`));
  assert.match(html, /action="https:\/\/script\.google\.com\/macros\/s\/AKfycbyBmeKwEsRM_m8ADtKL4uuDICQMXzzS6UV3mseb1wzdjLNNwDzuMRobOba1i6YYMubGtA\/exec"/);
  assert.match(html, /target="vitasense-form-target"/);
  assert.match(html, /name="website"/);
  assert.match(html, /aria-label="Mobile number"/);
  assert.match(html, /name="message"/);
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
  assert.match(home, /hero-neural-woman\.webp/);
  assert.doesNotMatch(css, /scroll-snap/);
  assert.doesNotMatch(home, /addEventListener\("wheel"|handleWheel/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await Promise.all([
    access(new URL("../public/vitasense-logo.png", import.meta.url)),
    access(new URL("../public/vitasense-mark.png", import.meta.url)),
    access(new URL("../public/hero-neural-woman.webp", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
  ]);
  await assert.rejects(
    access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)),
  );
});

test("exports a compact connect page with the requested US contact links", async () => {
  const html = await readFile(new URL("../dist/client/connect/index.html", import.meta.url), "utf8");
  assert.ok(html.includes(`rel="canonical" href="${siteBase}/connect/"`));
  if (process.env.GITHUB_ACTIONS !== "true") assert.doesNotMatch(html, /mohamed-imam\.github\.io/);
  assert.match(html, /Connect with VitaSense/);
  assert.match(html, /Start here/);
  assert.match(html, /Talk with us/);
  assert.match(html, /Follow along/);
  assert.match(html, /social-strip-connect/);
  assert.match(html, /https:\/\/wa\.link\/vzhy40/);
  assert.match(html, /https:\/\/www\.instagram\.com\/vitasensetests/);
  assert.match(html, /https:\/\/www\.facebook\.com\/share\/1EvGHcTGgj/);
  assert.match(html, /https:\/\/www\.linkedin\.com\/in\/Vitasensetest/);
  assert.match(html, /mailto:info@vita-sense\.com/);
  assert.doesNotMatch(html, /\bNHS\b|<img[^>]*qr/i);
});

test("includes Cloudflare Pages metadata and optimized assets", async () => {
  const headers = await readFile(new URL("../dist/client/_headers", import.meta.url), "utf8");
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /Cache-Control: public, max-age=31536000, immutable/);
  await Promise.all([
    "hero-neural-woman.webp", "test-eeg.webp", "test-vng.webp",
    "test-allergy.webp", "test-ncv.webp", "robots.txt", "sitemap.xml",
  ].map((name) => access(new URL(`../dist/client/${name}`, import.meta.url))));
});
