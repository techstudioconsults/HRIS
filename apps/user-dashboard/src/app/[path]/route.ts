import { createSerwistRoute } from '@serwist/turbopack';

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    swSrc: 'src/sw.ts',
    globDirectory: '.',
    globPatterns: [
      '.next/static/**/*.{js,css,woff,woff2,ttf,eot}',
      'public/**/*.{ico,png,svg,jpg,jpeg,gif,webp,mp3,mp4,webm,js,json,xml}',
    ],
    globIgnores: ['**/node_modules/**', '.next/cache/**', 'public/sw.js'],
    useNativeEsbuild: true,
  });
