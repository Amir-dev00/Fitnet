"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"

import { PageShell } from "@/components/site/page-shell"
import { guideSlugs, guides } from "@/lib/content"

function OpenGuide() {
  const params = useSearchParams()
  const router = useRouter()
  const slug = params.get("slug") ?? ""
  const guide = guides[slug]

  useEffect(() => {
    if (guide) router.replace(`/guides/${slug}/`)
  }, [guide, router, slug])

  return (
    <PageShell
      footer="guides"
      nav={[
        { href: "/guides/", label: "همه راهنماها" },
        { href: "/contact/", label: "ارتباط" },
      ]}
    >
      <p className="fn-crumbs"><Link href="/">فیت‌نت</Link>{" / "}<Link href="/guides/">راهنما</Link></p>
      <h1>{guide ? guide.title : "این راهنما پیدا نشد"}</h1>
      <div className="fn-prose">
        {guide ? guide.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : (
          <p>راهنمای درخواستی در فهرست فیت‌نت نیست. از راهنماها یکی را انتخاب کن.</p>
        )}
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

export default function OpenGuidePage() {
  return (
    <Suspense>
      <OpenGuide />
    </Suspense>
  )
}
