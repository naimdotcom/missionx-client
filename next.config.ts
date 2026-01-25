import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  reactCompiler: true,
  // Disable static generation for pages that require runtime configuration
  // (e.g., Firebase authentication)
  experimental: {
    isrMemoryCacheSize: 0,
  },
};

export default nextConfig;
