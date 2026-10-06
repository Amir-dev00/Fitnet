"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

import { DemoForm } from "@/components/forms/demo-form"
import { GymPartnerForm } from "@/components/forms/gym-partner-form"
import { PageShell } from "@/components/site/page-shell"

const paths = ["gym", "organizer"] as const
type Path = (typeof paths)[number]

function ContactBody() {
  const params = useSearchParams()
  const initial = params.get("path")
  const [path, setPath] = useState<Path>(paths.includes(initial as Path) ? (initial as Path) : "gym")

  function choose(next: Path) {
    setPath(next)
    window.history.replaceState(null, "", `/contact/?path=${next}`)
  }

  return (
    <PageShell>
      <p className="fn-kicker">ارتباط و همکاری</p>
      <h1>مسیر مناسب را انتخاب کن.</h1>
      <p className="fn-lead">این فرم در نسخه نمایشی ارسال نمی‌شود. کانال تماس جداگانه‌ای هنوز اعلام نشده است.</p>
      <div className="fn-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={path === "gym"} onClick={() => choose("gym")}>همکاری باشگاه</button>
        <button type="button" role="tab" aria-selected={path === "organizer"} onClick={() => choose("organizer")}>برگزاری رویداد</button>
      </div>
      {path === "gym" ? <GymPartnerForm /> : null}
      {path === "organizer" ? (
        <DemoForm
          submitLabel="همکاری به‌عنوان برگزارکننده"
          intro="رویدادت را برای بررسی می‌فرستی. بعد از تأیید، ثبت‌نام و حضور شرکت‌کننده‌ها را مدیریت می‌کنی."
          fields={[
            { id: "o-name", name: "name", label: "نام نمایشی", required: true },
            { id: "o-mobile", name: "mobile", label: "شماره موبایل", required: true, type: "tel", autoComplete: "tel" },
            { id: "o-type", name: "activity", label: "نوع رویداد یا فعالیت", required: true },
            { id: "o-note", name: "message", label: "پیام", type: "textarea" },
          ]}
        />
      ) : null}
    </PageShell>
  )
}

export function ContactScreen() {
  return (
    <Suspense>
      <ContactBody />
    </Suspense>
  )
}
