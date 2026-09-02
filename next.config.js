/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Firebase Storage primary CDN hostname
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        // Firebase Storage legacy / direct GCS hostname
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        // Firebase Storage custom domain bucket pattern (*.appspot.com)
        protocol: "https",
        hostname: "*.appspot.com",
      },
    ],
  },
};

module.exports = nextConfig;
