import type { Metadata } from "next"

export const siteUrl = "https://fitnet.ir"
const ogImage = `${siteUrl}/images/photo-1534438327276-14e5300c3a48.jpg`

export function pageMeta(opts: {
  title: string
  description: string
  path: string
  type?: "website" | "article"
}): Metadata {
  const url = opts.path === "/" ? `${siteUrl}/` : `${siteUrl}${opts.path}`
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      type: opts.type ?? "website",
      images: [ogImage],
    },
    twitter:
      opts.path === "/"
        ? {
            card: "summary",
            title: "فیت‌نت | باشگاه و رویداد ورزشی با یک اعتبار",
            description: "یک حساب، یک کیف پول اعتباری. باشگاه یا رویداد را رزرو کن و با QR وارد شو.",
          }
        : undefined,
  }
}
