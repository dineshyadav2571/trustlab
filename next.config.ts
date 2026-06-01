import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose", "mongodb", "bson", "pdfkit"],
  async redirects() {
    return [
      { source: "/about", destination: "/", permanent: false },
      { source: "/patents", destination: "/", permanent: false },
      { source: "/achievements", destination: "/", permanent: false },
      { source: "/news", destination: "/", permanent: false },
      { source: "/opportunities", destination: "/", permanent: false },
      { source: "/collaborations", destination: "/", permanent: false },
      { source: "/contact", destination: "/important-links", permanent: false },
      { source: "/people", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
