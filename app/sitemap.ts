import type { MetadataRoute } from "next"

import { siteUrl } from "@/lib/seo"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/about/", "/plans/", "/contact/", "/privacy/", "/terms/"]
  return paths.map((path) => ({
    url: path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`,
  }))
}
