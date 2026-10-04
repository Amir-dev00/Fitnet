"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import { guideCategories, guides } from "@/lib/content"

export function GuideBrowser() {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState("همه")
  const items = useMemo(() => {
    const q = query.trim()
    return Object.entries(guides).filter(([, guide]) => {
      if (active !== "همه" && guide.category !== active) return false
      if (!q) return true
      return `${guide.title} ${guide.summary} ${guide.category}`.includes(q)
    })
  }, [query, active])

  return (
    <>
      <div className="fn-search">
        <label htmlFor="fn-q" className="fn-kicker">جستجو</label>
        <br />
        <input id="fn-q" type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <div className="fn-cats">
        {guideCategories.map((name) => (
          <button key={name} type="button" aria-pressed={active === name} onClick={() => setActive(name)}>
            {name}
          </button>
        ))}
      </div>
      <div className="fn-grid cols-2">
        {items.length ? items.map(([slug, guide]) => (
          <Link key={slug} className="fn-card" href={`/guides/${slug}/`}>
            <h2>{guide.title}</h2>
            <p>{guide.summary}</p>
          </Link>
        )) : <p>راهنمایی با این عبارت پیدا نشد.</p>}
      </div>
    </>
  )
}
