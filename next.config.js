/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "github.githubassets.com",
      },
    ],
  },
};

module.exports = nextConfig;
