import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { STATIONS } from "@/lib/stations";

// Base URL is inferred from the request at serve time; sitemap uses relative-then-absolute
// so it stays correct across preview, staging, and production.
const PUBLIC_PATHS: Array<{ path: string; changefreq?: string; priority?: string }> = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/stations", changefreq: "monthly", priority: "0.8" },
  { path: "/timetable", changefreq: "daily", priority: "0.9" },
  { path: "/timetable/live", changefreq: "hourly", priority: "0.7" },
  { path: "/timetable/alerts", changefreq: "daily", priority: "0.6" },
  { path: "/tickets/fares", changefreq: "weekly", priority: "0.8" },
  { path: "/tickets/discounts", changefreq: "monthly", priority: "0.5" },
  { path: "/tickets/passes", changefreq: "monthly", priority: "0.5" },
  { path: "/network/lines", changefreq: "monthly", priority: "0.5" },
  { path: "/network/map", changefreq: "monthly", priority: "0.5" },
  { path: "/travel-info/luggage", changefreq: "monthly", priority: "0.4" },
  { path: "/travel-info/safety", changefreq: "monthly", priority: "0.4" },
  { path: "/travel-info/lost-property", changefreq: "monthly", priority: "0.4" },
  { path: "/about", changefreq: "yearly", priority: "0.3" },
  { path: "/contact", changefreq: "yearly", priority: "0.5" },
  { path: "/help", changefreq: "monthly", priority: "0.5" },
  { path: "/news", changefreq: "weekly", priority: "0.6" },
  { path: "/careers", changefreq: "monthly", priority: "0.3" },
  { path: "/investors", changefreq: "monthly", priority: "0.3" },
  { path: "/accessibility", changefreq: "yearly", priority: "0.4" },
  { path: "/legal/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/refunds", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/cookies", changefreq: "yearly", priority: "0.3" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const base = `${url.protocol}//${url.host}`;

        const entries: string[] = [];
        for (const p of PUBLIC_PATHS) {
          const en = `${base}${p.path}`;
          const ar = `${base}/ar${p.path === "/" ? "" : p.path}`;
          const alt = [
            `      <xhtml:link rel="alternate" hreflang="en" href="${en}" />`,
            `      <xhtml:link rel="alternate" hreflang="ar" href="${ar}" />`,
            `      <xhtml:link rel="alternate" hreflang="x-default" href="${en}" />`,
          ].join("\n");
          for (const loc of [en, ar]) {
            entries.push(
              [
                `  <url>`,
                `    <loc>${loc}</loc>`,
                p.changefreq ? `    <changefreq>${p.changefreq}</changefreq>` : "",
                p.priority ? `    <priority>${p.priority}</priority>` : "",
                alt,
                `  </url>`,
              ]
                .filter(Boolean)
                .join("\n"),
            );
          }
        }

        for (const s of STATIONS) {
          const en = `${base}/stations/${s.id}`;
          const ar = `${base}/ar/stations/${s.id}`;
          const alt = [
            `      <xhtml:link rel="alternate" hreflang="en" href="${en}" />`,
            `      <xhtml:link rel="alternate" hreflang="ar" href="${ar}" />`,
            `      <xhtml:link rel="alternate" hreflang="x-default" href="${en}" />`,
          ].join("\n");
          for (const loc of [en, ar]) {
            entries.push(
              [
                `  <url>`,
                `    <loc>${loc}</loc>`,
                `    <changefreq>monthly</changefreq>`,
                `    <priority>0.5</priority>`,
                alt,
                `  </url>`,
              ].join("\n"),
            );
          }
        }

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
          ...entries,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
