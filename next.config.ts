/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Required if you're using the `app` directory structure
  },
};

module.exports = nextConfig;
