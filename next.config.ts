import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-syd.brandkit.com",
        pathname: "/accounts/**",
      },
      {
        protocol: "https",
        hostname: "bwpbvdmdwjqguiliymnq.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
