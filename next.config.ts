import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',  
        hostname: 'api.diplomaroad.pro',
        port: '',  // Default HTTPS port
        pathname: '/media/uploads/properties/**', // Allow image paths in 'properties'
      },
      {
        protocol: 'https', 
        hostname: 'www.diplomaroad.pro',
        port: '',  // Default HTTPS port
        pathname: '/**',  // Allow all paths for the main website
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8010',  // Local development testing
        pathname: '/**', // Allow all paths for localhost
      },
      {
        protocol: 'http',
        hostname: 'www.diplomaroad.pro',
        port: '1773',  // If using port 1773 for the backend
        pathname: '/**', // Allow all paths for this port
      },
      {
        protocol: 'https',
        hostname: 'www.diplomaroad.pro',
        port: '',  // Default HTTPS port for the backend
        pathname: '/**', // Allow all paths
      },
      {
        protocol: 'http',
        hostname: '165.22.76.137',  // Your external server IP
        port: '1773',  // Port used for the server
        pathname: '/**',  // Allow all paths
      }
    ]
  }
};

export default nextConfig;
