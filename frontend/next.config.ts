import { NextConfig } from "next";

const nextConfig: NextConfig = {
   devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
    ],
  },
};

export default nextConfig;
