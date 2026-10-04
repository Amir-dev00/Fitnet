"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

import { DemoForm } from "@/components/forms/demo-form"
import { PageShell } from "@/components/site/page-shell"

const paths = ["early", "gym", "organizer"] as const
type Path = (typeof paths)[number]

function ContactBody() {
  const params = useSearchParams()
  const initial = params.get("path")
  const [path, setPath] = useState<Path>(paths.includes(initial as Path) ? (initial as Path) : "early")

  function choose(next: Path) {
    setPath(next)
    window.history.replaceState(null, "", `/contact/?path=${next}`)
  }

  return (
    <PageShell
      nav={[
        { href: "/about/", label: "درباره" },
        { href: "/plans/", label: "پلن‌ها" },
        { href: "/guides/", label: "راهنما" },
        { href: "/#partners", label: "همکاری" },
      ]}
    >
      <p className="fn-kicker">ارتباط و همکاری</p>
      <h1>مسیر مناسب را انتخاب کن.</h1>
      <p className="fn-lead">این فرم در نسخه نمایشی ارسال نمی‌شود. کانال تماس جداگانه‌ای هنوز اعلام نشده است.</p>
      <div className="fn-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={path === "early"} onClick={() => choose("early")}>دسترسی زودهنگام</button>
        <button type="button" role="tab" aria-selected={path === "gym"} onClick={() => choose("gym")}>همکاری باشگاه</button>
        <button type="button" role="tab" aria-selected={path === "organizer"} onClick={() => choose("organizer")}>برگزاری رویداد</button>
      </div>
      {path === "early" ? (
        <DemoForm
          submitLabel="ثبت درخواست"
          fields={[
            { id: "e-name", name: "name", label: "نام", required: true, autoComplete: "name" },
            { id: "e-mobile", name: "mobile", label: "شماره موبایل", required: true, type: "tel", autoComplete: "tel" },
          ]}
        />
      ) : null}
      {path === "gym" ? (
        <DemoForm
          submitLabel="درخواست همکاری باشگاه"
          intro="ظرفیت قابل رزرو را معرفی می‌کنی و رزرو، ورود و تسویه را یک‌جا می‌بینی. نمایه عمومی بعد از بررسی منتشر می‌شود."
          fields={[
            { id: "g-gym", name: "gym", label: "نام باشگاه یا مجموعه", required: true },
            { id: "g-person", name: "person", label: "نام مسئول", required: true, autoComplete: "name" },
            { id: "g-mobile", name: "mobile", label: "شماره موبایل", required: true, type: "tel", autoComplete: "tel" },
            { id: "g-city", name: "city", label: "شهر", required: true },
            { id: "g-note", name: "message", label: "پیام", type: "textarea" },
          ]}
        />
      ) : null}
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
