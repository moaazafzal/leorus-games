import type { NextConfig } from "next";

const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = isExport
  ? {
      // GitHub Pages static export — no server, dashboard/api are stripped in CI
      output: "export",
      basePath: "/leorus-games",
      env: { NEXT_PUBLIC_BASE_PATH: "/leorus-games" },
      images: {
        loader: "custom",
        loaderFile: "./image-loader.ts",
      },
    }
  : {
      env: { NEXT_PUBLIC_BASE_PATH: "" },
      images: {
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 60 * 60 * 24 * 30,
      },
      async headers() {
        return [
          {
            source: "/img/:path*",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
            ],
          },
        ];
      },
    };

export default nextConfig;
