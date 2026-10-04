"use client"

import Link from "next/link"
import { useEffect, useId, useRef, useState } from "react"

import { Logo } from "@/components/site/logo"

const navLinks = [
  { href: "#features", label: "امکانات" },
  { href: "#how-it-works", label: "نحوه کار" },
  { href: "#partners", label: "همکاری" },
  { href: "/guides/", label: "راهنما", external: true },
] as const

export function HomeHeader() {
  const [drawer, setDrawer] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const drawerId = useId()

  function closeDrawer() {
    setDrawer(false)
    menuButton.current?.focus()
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle("fn-lock", drawer)
    if (drawer) closeButton.current?.focus()
    return () => document.body.classList.remove("fn-lock")
  }, [drawer])

  useEffect(() => {
    if (!drawer) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        closeDrawer()
        return
      }

      if (event.key !== "Tab") return

      const panel = document.getElementById(drawerId)
      if (!panel) return
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [drawer, drawerId])

  return (
    <>
      <div
        className={`mob-overlay fixed inset-0 bg-black/50 z-20${drawer ? " open" : ""}`}
        onClick={closeDrawer}
        hidden={!drawer}
      />

      <div
        id={drawerId}
        className={`mob-drawer fixed top-0 right-0 w-4/5 max-w-xs z-50 flex flex-col border-l brand-border lg:hidden fn-on-indigo ${drawer ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: "var(--fn-fill)" }}
        role="dialog"
        aria-modal="true"
        aria-label="منوی اصلی"
        inert={!drawer}
        aria-hidden={!drawer}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b brand-border">
          <Logo />
          <button
            ref={closeButton}
            type="button"
            onClick={closeDrawer}
            aria-label="بستن منو"
            className="w-11 h-11 border brand-border flex items-center justify-center text-[var(--fn-ink)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-6 py-6 overflow-y-auto" aria-label="ناوبری موبایل">
          {navLinks.map((item) =>
            "external" in item && item.external ? (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawer(false)}
                className="fn-nav-link-mobile"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setDrawer(false)}
                className="fn-nav-link-mobile"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>
        <div className="px-6 pb-8">
          <a href="#download" onClick={() => setDrawer(false)} className="fn-nav-cta">
            دانلود اپلیکیشن
          </a>
        </div>
      </div>

      <header
        id="hdrAurum"
        className={`fixed top-0 left-0 right-0 z-30 border-b border-transparent fn-on-indigo${scrolled ? " hdr-scrolled" : ""}`}
      >
        <div className="fn-home-shell flex items-center h-full px-6 gap-6">
          <Logo lockup />
          <nav className="hidden lg:flex items-center gap-1 flex-1" aria-label="ناوبری اصلی">
            {navLinks.map((item) =>
              "external" in item && item.external ? (
                <Link key={item.href} href={item.href} className="fn-nav-link">
                  {item.label}
                </Link>
              ) : (
                <a key={item.href} href={item.href} className="fn-nav-link">
                  {item.label}
                </a>
              ),
            )}
          </nav>
          <div className="flex items-center gap-2 ms-auto">
            <a href="#download" className="hidden md:inline-flex fn-nav-cta">
              دانلود اپلیکیشن
            </a>
            <button
              ref={menuButton}
              id="fn-menu-btn"
              type="button"
              aria-label="باز کردن منو"
              aria-expanded={drawer}
              aria-controls={drawerId}
              onClick={() => setDrawer(true)}
              className="lg:hidden w-11 h-11 border brand-border flex items-center justify-center text-[var(--fn-ink)]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
