/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  swcMinify: true,
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  experimental: {
    workerThreads: false,
    cpus: 2,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    domains: [
      'res.cloudinary.com',
      'storage.googleapis.com',
      'm.media-amazon.com',
      'pisces.bbystatic.com',
      'oasis.opstatics.com',
      'images.unsplash.com',
      'cdn.abacus.ai',
      'd1ncau8tqf99kp.cloudfront.net',
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*.(jpg|jpeg|png|gif|webp|svg|ico|css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.output.filename = 'static/chunks/[name]-[contenthash:8].js';
      config.output.chunkFilename = 'static/chunks/[contenthash:16].js';
    }
    return config;
  },
};

module.exports = nextConfig;
