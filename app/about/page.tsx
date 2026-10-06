import { PageShell } from "@/components/site/page-shell"
import { pageMeta } from "@/lib/seo"

export const metadata = pageMeta({
  title: "درباره فیت‌نت",
  description: "فیت‌نت یک حساب برای کشف باشگاه‌های همکار و رویدادهای ورزشی تأییدشده در تهران است.",
  path: "/about/",
})

export default function AboutPage() {
  return (
    <PageShell>
      <p className="fn-kicker">درباره فیت‌نت</p>
      <h1>شهر، زمین تمرین توست.</h1>
      <p className="fn-lead">فیت‌نت باشگاه‌های همکار و رویدادهای ورزشی تأییدشده را در یک حساب جمع می‌کند. اعتبار را در کیف پول می‌بینی، زمان مناسب را رزرو می‌کنی و با QR وارد می‌شوی.</p>
      <div className="fn-grid cols-2" style={{ marginBottom: 28 }}>
        <img src="/images/photo-1534438327276-14e5300c3a48.jpg" alt="فضای تمرین" width={800} height={520} style={{ width: "100%", height: 320, objectFit: "cover" }} />
        <img src="/images/photo-1571019614242-c5c5dee9f50b.jpg" alt="" width={800} height={520} style={{ width: "100%", height: 320, objectFit: "cover" }} loading="lazy" />
      </div>
      <div className="fn-grid cols-3">
        <article className="fn-card"><h2>کاربر</h2><p>کشف، رزرو و ورود با یک کیف پول. لازم نیست برای هر باشگاه عضویت جدا بخری.</p></article>
        <article className="fn-card"><h2>باشگاه همکار</h2><p>ظرفیت قابل رزرو را معرفی می‌کند و رزرو، ورود و تسویه را یک‌جا می‌بیند. چند شعبه در یک مجموعه ممکن است.</p></article>
        <article className="fn-card"><h2>برگزارکننده</h2><p>رویداد را برای بررسی می‌فرستد و پس از تأیید، ثبت‌نام و حضور را مدیریت می‌کند.</p></article>
      </div>
      <div className="fn-prose" style={{ marginTop: 36 }}>
        <h2>شروع از تهران</h2>
        <p>فیت‌نت در مسیر شروع در تهران است. این یعنی باشگاه‌ها و رویدادهای مشارکت‌کننده، نه همه سالن‌های شهر. جامعه کاربری هم هنوز باز نشده و اگر دیده شود، به‌زودی است.</p>
        <h2>مسیر کوتاه</h2>
        <p>اعتبار بگیر، پیدا کن، رزرو کن، وارد شو. با ساخت حساب، ۱ اعتبار شروع دریافت می‌کنی؛ این یک جلسه رایگان تضمینی نیست.</p>
      </div>
    </PageShell>
  )
}
