import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/dashboard/:role/:path*", destination: "/:role/:path*" },
      { source: "/dashboard/:role", destination: "/:role/dashboard" },
    ];
  },
  async redirects() {
    const roles = ["trial", "member", "supervisor", "delivery", "recycler", "admin"] as const;
    const legacyToCanonical = roles.flatMap((role) => [
      { source: `/${role}`, destination: `/dashboard/${role}/dashboard`, permanent: false },
      { source: `/${role}/:path*`, destination: `/dashboard/${role}/:path*`, permanent: false },
    ]);
    return [
      { source: "/agent", destination: "/dashboard/delivery/dashboard", permanent: false },
      { source: "/agent/:path*", destination: "/dashboard/delivery/:path*", permanent: false },
      ...legacyToCanonical,
    ];
  },
};

export default nextConfig;
