import type { ReactNode } from "react"

import { HomeFooter } from "@/app/components/home/home-footer"
import { HomeHeader } from "@/app/components/home/home-header"

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="fn-page antialiased">
      <HomeHeader />
      <main className="fn-wrap">{children}</main>
      <HomeFooter />
    </div>
  )
}
