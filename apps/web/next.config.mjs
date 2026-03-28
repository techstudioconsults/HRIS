/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@workspace/ui'],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: false,
            },
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

export default nextConfig;
