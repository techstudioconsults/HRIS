import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  serverExternalPackages: ["msw"],
  compress: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "cdn.dummyjson.com",
      },
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
