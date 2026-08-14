import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/members",
        destination: "/team",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
