import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force Webpack for production build (Netlify edge functions
  // don't support Turbopack chunk format yet)
  webpack: (config) => config,
  turbopack: {},
};

export default nextConfig;
