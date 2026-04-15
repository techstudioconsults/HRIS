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
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (rule: unknown) =>
        typeof rule === 'object' &&
        rule !== null &&
        'test' in rule &&
        rule.test instanceof RegExp &&
        rule.test.test('.svg')
    ) as
      | {
          issuer?: unknown;
          resourceQuery?: { not?: RegExp[] };
          exclude?: RegExp;
        }
      | undefined;

    if (fileLoaderRule) {
      config.module.rules.push(
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/,
        },
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: {
            not: [...(fileLoaderRule.resourceQuery?.not ?? []), /url/],
          },
          use: [
            {
              loader: '@svgr/webpack',
              options: { svgo: false },
            },
          ],
        }
      );

      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },
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
