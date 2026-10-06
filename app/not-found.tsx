import Link from "next/link"

import { PageShell } from "@/components/site/page-shell"

export default function NotFound() {
  return (
    <PageShell>
      <p className="fn-kicker">۴۰۴</p>
      <h1>این صفحه پیدا نشد.</h1>
      <p className="fn-lead">نشانی در فیت‌نت نیست. از صفحه اصلی ادامه بده.</p>
      <p>
        <Link className="fn-btn" href="/">صفحه اصلی</Link>
      </p>
    </PageShell>
  )
}
