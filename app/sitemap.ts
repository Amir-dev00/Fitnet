import type { MetadataRoute } from "next"

import { guideSlugs } from "@/lib/content"
import { siteUrl } from "@/lib/seo"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/about/", "/plans/", "/guides/", "/contact/", "/privacy/", "/terms/", ...guideSlugs.map((slug) => `/guides/${slug}/`)]
  return paths.map((path) => ({
    url: path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`,
  }))
}
