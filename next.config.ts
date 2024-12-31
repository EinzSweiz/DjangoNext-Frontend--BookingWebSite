import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.diplomaroad.pro',
        port: '', // Default HTTPS port
        pathname: '/media/uploads/avatars/**', // Allow avatar paths
      },
      {
        protocol: 'https',
        hostname: 'api.diplomaroad.pro',
        port: '', // Default HTTPS port
        pathname: '/media/uploads/properties/**', // Allow property image paths
      },
      {
        protocol: 'https',
        hostname: 'www.diplomaroad.pro',
        port: '', // Default HTTPS port
        pathname: '/**', // Allow all paths for the main website
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8010', // Local development testing
        pathname: '/**', // Allow all paths for localhost
      },
      {
        protocol: 'http',
        hostname: '165.22.76.137', // External server IP
        port: '1773', // Port used for the server
        pathname: '/**', // Allow all paths
      },
    ],
  },
};

export default nextConfig;
