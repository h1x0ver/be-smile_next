import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ⚡ Сжатие
  compress: true,
  poweredByHeader: false,

  images: {
    // AVIF is ~20-30% smaller than WebP; browsers without it get WebP
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [60, 70, 75, 78, 80, 85, 90, 95, 96],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "portal.besmile.az",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // ⚡ Experimental оптимизации
  experimental: {
    optimizePackageImports: [
      "@/components/ui",
      "lucide-react",
      "framer-motion",
      "date-fns",
    ],
  },

  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Static files from /public (logos, icons, photos)
        source: "/:all*(svg|png|jpg|jpeg|webp|avif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
