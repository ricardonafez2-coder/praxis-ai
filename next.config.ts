import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Force Webpack for production build (Netlify edge functions
  // don't support Turbopack chunk format yet)
  webpack: (config) => {
    // Fix: simli-client imports './Client' but the file is './client.js'
    // Works on Windows (case-insensitive) but fails on Linux (Netlify)
    config.resolve.alias = {
      ...config.resolve.alias,
      "simli-client/dist/Client": path.resolve(
        __dirname,
        "node_modules/simli-client/dist/client.js"
      ),
    };
    return config;
  },
  turbopack: {},
};

export default nextConfig;
