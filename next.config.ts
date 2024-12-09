import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',  // Ensure you're using https since your website URL starts with https
        hostname: 'api.diplomaroad.pro',
        port: '',  // No specific port if you're using the default HTTPS port
        pathname: '/media/uploads/properties/**', // Match the image path pattern
      },
      {
        protocol: 'https', 
        hostname: 'www.diplomaroad.pro',
        port: '',  // No port needed for standard HTTPS
        pathname: '/**',  // Allowing all paths, adjust if needed
      },
      // You can add other remote patterns for your specific use case if needed
    ],
  },
};

export default nextConfig;
