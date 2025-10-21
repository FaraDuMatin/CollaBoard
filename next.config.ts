import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /* Add config for img.clerk.com */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
