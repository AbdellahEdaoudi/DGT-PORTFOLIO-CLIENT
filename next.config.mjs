/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
    config.ignoreWarnings = [
      { module: /node_modules\/react-toastify/ }
    ];
    return config;
  },
};

export default nextConfig;
