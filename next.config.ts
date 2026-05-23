import type { NextConfig } from "next";

const STRICT_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const EMBED_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Content-Security-Policy", value: "frame-ancestors *;" },
  { key: "Referrer-Policy", value: "no-referrer-when-downgrade" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Embed iframe routes — allow any origin to frame them.
        source: "/embed/:path*",
        headers: EMBED_HEADERS,
      },
      {
        // embed.js loader — CORS-open so 3rd-party sites can <script src=...>
        source: "/embed.js",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
      {
        // Everything else: strict default.
        source: "/((?!embed).*)",
        headers: STRICT_HEADERS,
      },
    ];
  },
};

export default nextConfig;
