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
  i18n: {
  locales: ['en', 'ar', 'es', 'fr', 'ru', 'ja'],
  defaultLocale: 'en',
},

};

export default nextConfig;
