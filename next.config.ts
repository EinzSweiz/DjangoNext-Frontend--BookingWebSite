import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
      protocol: 'http',
      hostname: 'localhost',
      port: '8010',
      pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: '165.22.76.137',
        port: '1337',
        pathname: '/**'
      }
  ]
  }
};

export default nextConfig;
