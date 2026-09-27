import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.104"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async rewrites() {
    const cmsOrigin = process.env.CMS_ORIGIN ?? "http://localhost:3001";

    return [
      { source: "/admin", destination: `${cmsOrigin}/admin` },
      { source: "/admin/:path*", destination: `${cmsOrigin}/admin/:path*` },
    ];
  },
};

export default nextConfig;
