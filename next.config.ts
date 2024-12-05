import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
      protocol: 'https',
      hostname: '172.19.0.5',
      port: '8010',
      pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'www.diplomaroad.pro',
        port: '',
        pathname: '/**'
      }
  ]
  }
};

export default nextConfig;
