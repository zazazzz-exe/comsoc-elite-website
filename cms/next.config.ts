import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/admin",
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "localhost:3001"],
    },
  },
};

export default nextConfig;
