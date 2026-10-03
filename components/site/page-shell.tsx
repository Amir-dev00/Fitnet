import Link from "next/link"
import type { ReactNode } from "react"

import { Logo } from "@/components/site/logo"

export type NavLink = { href: string; label: string; className?: string }

export function PageShell({
  nav,
  children,
  footer = "standard",
}: {
  nav: NavLink[]
  children: ReactNode
  footer?: "standard" | "legal" | "guides"
}) {
  return (
    <div className="fn-page antialiased">
      <header className="fn-top">
        <Logo />
        <nav>
          {nav.map((item) => (
            <Link key={item.href + item.label} href={item.href} className={item.className}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="fn-wrap">{children}</main>
      <footer className="fn-foot">
        <div className="fn-wrap">
          <Logo />
          <span>© 2026 Fitnet</span>
          {footer === "legal" ? (
            <Link href="/">بازگشت</Link>
          ) : (
            <span>
              {footer === "standard" ? (
                <>
                  <Link href="/guides/">راهنما</Link>
                  {" · "}
                </>
              ) : null}
              <Link href="/terms/">قوانین استفاده</Link>
              {" · "}
              <Link href="/privacy/">حریم خصوصی</Link>
            </span>
          )}
        </div>
      </footer>
    </div>
  )
}
