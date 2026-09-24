import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// vinext currently prerenders /connect only without a trailing slash. GitHub Pages
// serves the directory URL when an index.html is present, so keep both paths.
const output = join(process.cwd(), "dist", "client");
const connectDirectory = join(output, "connect");
mkdirSync(connectDirectory, { recursive: true });
copyFileSync(join(output, "connect.html"), join(connectDirectory, "index.html"));
