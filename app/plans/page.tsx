import Link from "next/link"

import { PageShell } from "@/components/site/page-shell"
import { pageMeta } from "@/lib/seo"

export const metadata = pageMeta({
  title: "پلن‌ها و اعتبار | فیت‌نت",
  description: "پلن ماهانه فیت‌نت، کیف پول اعتباری و خرج کردن اعتبار برای باشگاه و رویداد.",
  path: "/plans/",
})

export default function PlansPage() {
  return (
    <PageShell
      nav={[
        { href: "/#download", label: "دانلود اپلیکیشن" },
        { href: "/guides/", label: "راهنما" },
        { href: "/contact/?path=early", label: "دسترسی زودهنگام", className: "fn-btn" },
      ]}
    >
      <p className="fn-kicker">پلن‌ها و اعتبار</p>
      <h1>با ریتم خودت، پلن انتخاب کن.</h1>
      <p className="fn-lead">پلن‌های ماهانه فیت‌نت با مقدار اعتبار متفاوت طراحی می‌شوند. انتخاب می‌کنی چقدر برای تجربه‌های ورزشی‌ات کنار بگذاری. جزئیات پلن‌ها هم‌زمان با شروع فیت‌نت اعلام می‌شود.</p>
      <div className="fn-grid cols-3">
        <article className="fn-card"><h2>اشتراک</h2><p>حدود چند پلن ماهانه، نه رده‌های تشریفاتی. در هر زمان یک اشتراک فعال داری و تمدید دستی است.</p></article>
        <article className="fn-card"><h2>کیف پول</h2><p>اعتبار را یک‌جا می‌بینی. تاریخ انقضا از دوره اشتراک جداست و اعتبار نزدیک‌تر به انقضا زودتر خرج می‌شود.</p></article>
        <article className="fn-card"><h2>خرج کردن</h2><p>برای باشگاه همکار و رویداد تأییدشده. هزینه هر رزرو قبل از تأیید معلوم است. شارژ اضافه، اگر فعال شود، همان اعتبار است نه خرید کالا.</p></article>
      </div>
      <div className="fn-prose">
        <h2>Pro Step</h2>
        <p>فقط اعتباری که برای حضور انجام‌شده خرج شده، پیشرفت را جلو می‌برد. حد هدیه و فروشگاه جایزه در این صفحه وجود ندارد.</p>
        <h2>شروع</h2>
        <p>با ساخت حساب، ۱ اعتبار شروع دریافت می‌کنی. این اعتبار یک جلسه رایگان را تضمین نمی‌کند.</p>
      </div>
      <p className="fn-note">قیمت، تعداد اعتبار و مدت هر پلن هنوز برای نمایش عمومی تأیید نشده است.</p>
      <p style={{ marginTop: 22 }}><Link className="fn-btn" href="/contact/?path=early">دسترسی زودهنگام</Link></p>
    </PageShell>
  )
}
