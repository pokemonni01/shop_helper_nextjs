import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"], // ✅ Add Firebase storage domain
  },
};

export default nextConfig;
