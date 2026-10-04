"use client"

import { Dialog } from "@base-ui/react/dialog"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useId, useRef, useState } from "react"

import { Logo } from "@/components/site/logo"

const navLinks = [
  { href: "#features", label: "امکانات" },
  { href: "#how-it-works", label: "نحوه کار" },
  { href: "#partners", label: "همکاری" },
  { href: "/guides/", label: "راهنما", external: true },
] as const

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function HomeHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeButton = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)")
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false)
    }
    desktop.addEventListener("change", closeOnDesktop)
    return () => desktop.removeEventListener("change", closeOnDesktop)
  }, [])

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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <header
        id="hdrAurum"
        className={`fn-on-indigo${scrolled ? " hdr-scrolled" : ""}`}
      >
        <div className="fn-header-bar">
          <div className="fn-header-logo">
            <Logo lockup />
          </div>
          <nav className="fn-header-nav" aria-label="ناوبری اصلی">
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
          aria-labelledby={titleId}
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
            <p id={titleId} className="fn-nav-drawer-title">منو</p>
          </div>
          <nav className="fn-nav-drawer-nav" aria-label="ناوبری موبایل">
            {navLinks.map((item) => {
              const current = "external" in item && item.external && pathname.startsWith("/guides")
              if ("external" in item && item.external) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="fn-nav-link-mobile"
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              }
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="fn-nav-link-mobile"
                  onClick={(event) => {
                    event.preventDefault()
                    setOpen(false)
                    followHash(item.href)
                  }}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
