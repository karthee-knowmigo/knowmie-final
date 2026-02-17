import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/extract",
        destination: isProduction
          ? `${process.env.NEXT_PUBLIC_API_URL}/extract`
          : "http://localhost:8080/extract", // Use local server for development
      },
      {
        source: "/api/askTwin",
        destination: isProduction
          ? `${process.env.NEXT_PUBLIC_API_URL}/askTwin`
          : "http://localhost:8080/askTwin", // Use local server for development
      },
    ];
  },
  experimental: {
    serverActions: {
      // Replace with your actual ngrok domain
      allowedOrigins: ["https://knowmie-web-front.web.app", "localhost:3000"],
    },
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
