import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Ensure Turbopack treats this directory as the project root
    root: __dirname,
  },
};

export default nextConfig;
