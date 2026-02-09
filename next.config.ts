import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "2020.hackthenorth.com",
        pathname: "/img/**",
      },
    ],
  },
};

export default nextConfig;
