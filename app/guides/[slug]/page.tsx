import Link from "next/link"
import { notFound } from "next/navigation"

import { PageShell } from "@/components/site/page-shell"
import { guideSlugs, guides } from "@/lib/content"
import { pageMeta } from "@/lib/seo"

export function generateStaticParams() {
  return guideSlugs.map((slug) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = guides[slug]
  if (!guide) return {}
  return pageMeta({
    title: `${guide.title} | فیت‌نت`,
    description: guide.summary,
    path: `/guides/${slug}/`,
    type: "article",
  })
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = guides[slug]
  if (!guide) notFound()

  return (
    <PageShell
      footer="guides"
      nav={[
        { href: "/guides/", label: "همه راهنماها" },
        { href: "/contact/", label: "ارتباط" },
      ]}
    >
      <p className="fn-crumbs"><Link href="/">فیت‌نت</Link>{" / "}<Link href="/guides/">راهنما</Link></p>
      <h1>{guide.title}</h1>
      <div className="fn-prose">
        {guide.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <h2 style={{ marginTop: 36 }}>راهنماهای مرتبط</h2>
      <div className="fn-grid" style={{ marginTop: 12 }}>
        {guideSlugs.filter((key) => key !== slug).map((key) => (
          <Link key={key} href={`/guides/${key}/`}>{guides[key].title}</Link>
        ))}
      </div>
    </PageShell>
  )
}
