import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';
import withSerwistInit from '@serwist/next';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
}) as (config: NextConfig) => NextConfig;

const withSerwist = withSerwistInit({
  swSrc: 'src/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.DISABLE_PWA === 'true',
});

const nextConfig: NextConfig = {
  transpilePackages: ['@workspace/ui'],
  serverExternalPackages: ['msw'],
  compress: false,
  typescript: {
    ignoreBuildErrors: true,
  },
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
      {
        hostname: 'cdn.dummyjson.com',
      },
      {
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

const isProduction = process.env.NODE_ENV === 'production';

const finalConfig: NextConfig = isProduction
  ? withSerwist(withBundleAnalyzer(nextConfig))
  : withBundleAnalyzer(nextConfig);

export default finalConfig;
