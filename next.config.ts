import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow deploys to proceed even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow deploys to proceed even if there are type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
