"use client"

import { Dialog } from "@base-ui/react/dialog"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

const sectionLinks = [
  { key: "how", id: "how-it-works", label: "نحوه کار" },
  { key: "events", id: "events", label: "رویدادها" },
  { key: "partners", id: "partners", label: "همکاری" },
] as const

type SectionKey = (typeof sectionLinks)[number]["key"]

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function sectionFromHash(hash: string): SectionKey | null {
  const id = hash.replace(/^#/, "")
  return sectionLinks.find((item) => item.id === id)?.key ?? null
}

export function HomeHeader() {
  const [open, setOpen] = useState(false)
  const [sectionActive, setSectionActive] = useState<SectionKey | null>(null)
  const [tick, setTick] = useState(0)
  const closeButton = useRef<HTMLButtonElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const prevActive = useRef<SectionKey | null>(null)
  const placed = useRef(false)
  const lockUntil = useRef(0)
  const pathname = usePathname()
  const onHome = pathname === "/"
  const active: SectionKey | null = onHome ? sectionActive : null

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 840px)")
    const closeOnWide = () => {
      if (wide.matches) setOpen(false)
    }
    wide.addEventListener("change", closeOnWide)
    return () => wide.removeEventListener("change", closeOnWide)
  }, [])

  useEffect(() => {
    if (!onHome) return
    const nodes = sectionLinks
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node))
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      () => {
        if (performance.now() < lockUntil.current) return
        const bandTop = window.innerHeight * 0.16
        const bandBottom = window.innerHeight * 0.62
        const scored = nodes
          .map((node) => {
            const rect = node.getBoundingClientRect()
            const overlap = Math.min(rect.bottom, bandBottom) - Math.max(rect.top, bandTop)
            return { node, overlap }
          })
          .filter((item) => item.overlap > 24)
          .sort((a, b) => b.overlap - a.overlap)[0]
        const match = scored
          ? sectionLinks.find((item) => item.id === scored.node.id)
          : undefined
        setSectionActive(match ? match.key : null)
      },
      { rootMargin: "-16% 0px -38% 0px", threshold: [0, 0.15, 0.4] },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [onHome])

  useEffect(() => {
    const pill = pillRef.current
    if (!pill || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => setTick((value) => value + 1))
    observer.observe(pill)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let cancel = false
    void document.fonts?.ready.then(() => {
      if (!cancel) setTick((value) => value + 1)
    })
    return () => {
      cancel = true
    }
  }, [])

  useLayoutEffect(() => {
    const pill = pillRef.current
    if (!pill) return

    let key = active
    if (onHome && key == null) {
      const hashed = sectionFromHash(window.location.hash)
      if (hashed) {
        lockUntil.current = performance.now() + 900
        setSectionActive(hashed)
        return
      }
    }

    const from = prevActive.current
    const appear = !placed.current || from == null || key == null
    prevActive.current = key

    if (!key) {
      pill.style.setProperty("--fn-ind-opacity", "0")
      pill.dataset.snap = "true"
      placed.current = true
      return
    }

    const target = pill.querySelector<HTMLElement>(`[data-nav="${key}"]`)
    if (!target) return
    const pillBox = pill.getBoundingClientRect()
    const itemBox = target.getBoundingClientRect()
    if (itemBox.width < 1) {
      pill.style.setProperty("--fn-ind-opacity", "0")
      prevActive.current = null
      return
    }
    pill.style.setProperty("--fn-ind-x", `${itemBox.left - pillBox.left - pill.clientLeft}px`)
    pill.style.setProperty("--fn-ind-y", `${itemBox.top - pillBox.top - pill.clientTop}px`)
    pill.style.setProperty("--fn-ind-w", `${itemBox.width}px`)
    pill.style.setProperty("--fn-ind-h", `${itemBox.height}px`)
    pill.style.setProperty("--fn-ind-opacity", "1")
    pill.dataset.snap = appear || prefersReducedMotion() ? "true" : "false"
    placed.current = true

    if (pill.dataset.snap === "true" && !prefersReducedMotion()) {
      window.requestAnimationFrame(() => {
        if (pillRef.current) pillRef.current.dataset.snap = "false"
      })
    }
  }, [active, onHome, tick])

  function followHash(href: string) {
    const target = document.getElementById(href.slice(1))
    if (!target) return
    const behavior = prefersReducedMotion() ? "auto" : "smooth"
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        target.scrollIntoView({ behavior, block: "start" })
        history.pushState(null, "", href)
      })
    })
  }

  function activateSection(key: SectionKey) {
    lockUntil.current = performance.now() + 800
    setSectionActive(key)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <header id="hdrAurum">
        <div ref={pillRef} className="fn-float-pill">
          <span className="fn-float-capsule" aria-hidden="true" />
          <Link href="/" className="fn-float-logo" aria-label="فیت‌نت، صفحه اصلی">
            <img
              src="/brand/fitnet-indigo-orange-logo.webp"
              alt=""
              width={2172}
              height={724}
            />
          </Link>
          <nav className="fn-float-nav" aria-label="ناوبری اصلی">
            {sectionLinks.map((item) => {
              const current = active === item.key
              if (onHome) {
                return (
                  <a
                    key={item.key}
                    href={`#${item.id}`}
                    data-nav={item.key}
                    data-active={current ? "true" : undefined}
                    aria-current={current ? "location" : undefined}
                    className="fn-float-link"
                    onClick={() => activateSection(item.key)}
                  >
                    {item.label}
                  </a>
                )
              }
              return (
                <Link
                  key={item.key}
                  href={`/#${item.id}`}
                  data-nav={item.key}
                  className="fn-float-link"
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <Dialog.Trigger
            id="fn-menu-btn"
            className="fn-header-menu"
            aria-label={open ? "بستن منو" : "باز کردن منو"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </Dialog.Trigger>
        </div>
      </header>

      <Dialog.Portal>
        <Dialog.Backdrop className="fn-nav-backdrop" />
        <Dialog.Popup
          className="fn-nav-drawer"
          initialFocus={closeButton}
          aria-label="منو"
        >
          <div className="fn-nav-drawer-head">
            <Dialog.Close
              ref={closeButton}
              className="fn-nav-drawer-close"
              aria-label="بستن منو"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeWidth="2" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </Dialog.Close>
          </div>
          <nav className="fn-nav-drawer-nav" aria-label="ناوبری موبایل">
            {sectionLinks.map((item) =>
              onHome ? (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="fn-nav-link-mobile"
                  onClick={(event) => {
                    event.preventDefault()
                    setOpen(false)
                    activateSection(item.key)
                    followHash(`#${item.id}`)
                  }}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  href={`/#${item.id}`}
                  className="fn-nav-link-mobile"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
