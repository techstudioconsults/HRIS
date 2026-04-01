import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
}) as (config: NextConfig) => NextConfig;

const nextConfig: NextConfig = {
  transpilePackages: ['@workspace/ui'],
  serverExternalPackages: ['msw'],
  compress: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.dummyjson.com',
      },
      {
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

const finalConfig: NextConfig = withBundleAnalyzer(nextConfig);

export default finalConfig;
