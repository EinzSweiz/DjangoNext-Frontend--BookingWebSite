import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8010',  // Assuming you're testing on localhost with this port
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: 'www.diplomaroad.pro',
        port: '1773',  // If you're using this port for your backend
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'www.diplomaroad.pro',
        port: '',  // If you're using this port for your backend
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: '165.22.76.137',
        port: '1773',  // Your external server IP
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
