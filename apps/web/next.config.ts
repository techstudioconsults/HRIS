import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
}) as (config: NextConfig) => NextConfig;

const nextConfig = {
  transpilePackages: ['@workspace/ui'],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: { svgo: false },
          },
        ],
        as: '*.js',
      },
    },
  },
  images: {
    remotePatterns: [
      { hostname: 'cdn.dummyjson.com' },
      { hostname: 'res.cloudinary.com' },
    ],
  },
};

const finalConfig: NextConfig = withBundleAnalyzer(nextConfig);

export default finalConfig;
