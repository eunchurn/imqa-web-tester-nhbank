import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  transpilePackages: ["@imqa/web-agent"],
  productionBrowserSourceMaps: true,
  output: "export",
};

export default nextConfig;
