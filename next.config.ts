import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Add rewrites to proxy API requests to the backend server
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_URL || 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;
