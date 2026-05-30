import type { NextConfig } from "next";

/** Домены счётчика Метрики (.ru и .com — tag.js может переключаться между ними). */
const YANDEX_METRIKA_HTTPS = ["https://mc.yandex.ru", "https://mc.yandex.com"] as const;
const YANDEX_METRIKA_CONNECT = [
  ...YANDEX_METRIKA_HTTPS,
  "wss://mc.yandex.ru",
  "wss://mc.yandex.com",
] as const;

/** CSP для продакшена: Яндекс.Метрика, карта в футере, изображения с API и CDN. */
function buildContentSecurityPolicy(): string {
  const connectSources = new Set<string>(["'self'", ...YANDEX_METRIKA_CONNECT]);
  for (const key of [
    "NEXT_PUBLIC_FRONT_API_URL",
    "NEXT_PUBLIC_FRONT_PROXY_API_URL",
    "NEXT_PUBLIC_FRONT_CONTENT_PROXY_API_URL",
  ] as const) {
    const raw = process.env[key];
    if (!raw?.startsWith("http")) continue;
    try {
      connectSources.add(new URL(raw).origin);
    } catch {
      /* ignore invalid URL */
    }
  }

  const mediaSources = new Set<string>(["'self'", "blob:", "https://api.osa-market.ru"]);
  for (const origin of connectSources) {
    if (origin !== "'self'") mediaSources.add(origin);
  }

  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${YANDEX_METRIKA_HTTPS.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: https://images.unsplash.com https://zaburdaev.space https://api.osa-market.ru ${YANDEX_METRIKA_HTTPS.join(" ")}`,
    "font-src 'self' data:",
    `connect-src ${[...connectSources].join(" ")}`,
    `media-src ${[...mediaSources].join(" ")}`,
    `frame-src 'self' https://yandex.ru https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com ${YANDEX_METRIKA_HTTPS.join(" ")}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
  ];

  return directives.join("; ");
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "zaburdaev.space",
      },
      {
        protocol: "https",
        hostname: "api.osa-market.ru",
      },
    ],
  },
  async headers() {
    const common: { key: string; value: string }[] = [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];

    const productionOnly: { key: string; value: string }[] = [];

    if (process.env.NODE_ENV === "production") {
      productionOnly.push(
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
        {
          key: "Content-Security-Policy",
          value: buildContentSecurityPolicy(),
        },
      );
    }

    return [
      {
        source: "/:path*",
        headers: [...productionOnly, ...common],
      },
    ];
  },
};

export default nextConfig;
