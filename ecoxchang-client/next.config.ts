import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/agent", destination: "/delivery/dashboard", permanent: false },
      { source: "/agent/:path*", destination: "/delivery/:path*", permanent: false },
      { source: "/trial", destination: "/trial/dashboard", permanent: false },
      { source: "/member", destination: "/member/dashboard", permanent: false },
      { source: "/supervisor", destination: "/supervisor/dashboard", permanent: false },
      { source: "/delivery", destination: "/delivery/dashboard", permanent: false },
      { source: "/recycler", destination: "/recycler/dashboard", permanent: false },
      { source: "/admin", destination: "/admin/dashboard", permanent: false },
    ];
  },
};

export default nextConfig;
