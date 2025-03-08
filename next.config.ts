import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  trailingSlash: true,
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
