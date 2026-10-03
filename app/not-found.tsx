import Link from "next/link"

import { PageShell } from "@/components/site/page-shell"

export default function NotFound() {
  return (
    <PageShell nav={[{ href: "/guides/", label: "راهنما" }, { href: "/contact/", label: "ارتباط" }]}>
      <p className="fn-kicker">۴۰۴</p>
      <h1>این صفحه پیدا نشد.</h1>
      <p className="fn-lead">نشانی در فیت‌نت نیست. از صفحه اصلی یا راهنما ادامه بده.</p>
      <p>
        <Link className="fn-btn" href="/">صفحه اصلی</Link>
      </p>
    </PageShell>
  )
}
