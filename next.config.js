/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'imagedelivery.net',
    ],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
