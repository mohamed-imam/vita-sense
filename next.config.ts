import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  assetPrefix: isGitHubPages ? "/vita-sense" : "",
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPages ? "/vita-sense" : "",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
