import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Static marketing export served at trace.komatik.xyz (Vercel). No server,
// no API routes — the live scan/quiz/intake funnels live on komatik.ai and
// are reached via outbound CTAs.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  // This app is self-contained; pin the workspace root to web/ so Next does
  // not climb to the repo's packages/* lockfile when tracing files.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
