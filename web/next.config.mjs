import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export everywhere: `next build` emits ./out. Vercel serves ./out as a
  // plain static site via web/vercel.json (framework: null, outputDirectory: out),
  // which is deterministic and does NOT depend on Vercel's Next.js auto-detection
  // (that path served public/ assets but 404'd every prerendered HTML page). ./out
  // is also portable to any static host (GitHub Pages, Netlify, Cloudflare, S3).
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  webpack: (config) => {
    // Resolve the "@/..." alias explicitly so it never depends on tsconfig
    // path-mapping pickup. Webpack matches alias keys at path boundaries, so
    // scoped packages like @swc/* and @next/* are unaffected.
    config.resolve.alias["@"] = path.join(__dirname, "src");
    return config;
  },
};

export default nextConfig;
