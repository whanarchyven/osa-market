import type { NextConfig } from "next";

/** CSP для продакшена: Яндекс.Метрика, карта в футере, изображения с API и CDN. */
function buildContentSecurityPolicy(): string {
  const connectSources = new Set<string>(["'self'", "https://mc.yandex.ru"]);
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

  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://mc.yandex.ru",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.unsplash.com https://zaburdaev.space https://api.osa-market.ru https://mc.yandex.ru",
    "font-src 'self' data:",
    `connect-src ${[...connectSources].join(" ")}`,
    "frame-src 'self' https://yandex.ru https://mc.yandex.ru",
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
    domains: ["images.unsplash.com", "zaburdaev.space", "api.osa-market.ru"],
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
