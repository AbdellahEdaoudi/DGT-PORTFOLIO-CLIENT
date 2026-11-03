/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  images: {
    qualities: [75, 100],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },

  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
