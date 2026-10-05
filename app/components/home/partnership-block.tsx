import Link from "next/link"

export function PartnershipBlock() {
  return (
    <section id="partners" className="fn-section fn-section-tint">
      <div className="fn-home-shell">
        <div className="fn-partner">
          <div>
            <p className="fn-kicker">همکاری</p>
            <h2 className="fn-home-title">ظرفیتت را به فیت‌نت وصل کن</h2>
            <p className="fn-home-lead">
              باشگاه یا برگزارکننده هستی؟ ظرفیت قابل رزرو را معرفی کن و رزروها، ورودها و وضعیت تسویه را یک‌جا ببین. جزئیات پلن‌ها در صفحه پلن‌ها آمده است.
            </p>
          </div>
          <div className="fn-partner-actions">
            <Link href="/contact/?path=gym" className="fn-btn-solid">
              درخواست همکاری باشگاه
            </Link>
            <Link href="/contact/?path=organizer" className="fn-btn-outline">
              همکاری به‌عنوان برگزارکننده
            </Link>
            <Link href="/plans/" className="fn-text-link">
              مشاهده پلن‌ها
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
