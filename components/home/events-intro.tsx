import Link from "next/link"

export function EventsIntro() {
  return (
    <section id="events" className="fn-section">
      <div className="fn-home-shell">
        <div className="fn-events">
          <div className="fn-events-copy">
            <p className="fn-kicker">رویدادها</p>
            <h2 className="fn-home-title">تمرین، فقط باشگاه نیست</h2>
            <p className="fn-home-lead">
              رویدادهای ورزشی تأییدشده را پیدا کن و با اعتبار فیت‌نت همراه شو. تصاویر زیر فقط پیش‌نمایش تجربه هستند؛ رویدادهای واقعی با شروع فیت‌نت اینجا معرفی می‌شوند.
            </p>
            <Link href="/contact/?path=organizer" className="fn-text-link">
              همکاری به‌عنوان برگزارکننده
            </Link>
          </div>

          <div className="fn-events-media">
            <figure>
              <img
                loading="lazy"
                alt=""
                src="/images/photo-1571019614242-c5c5dee9f50b.jpg"
                width={800}
                height={520}
              />
              <figcaption>تمرین گروهی</figcaption>
            </figure>
            <figure>
              <img
                loading="lazy"
                alt=""
                src="/images/photo-1517836357463-d25dfe09ce18.jpg"
                width={800}
                height={520}
              />
              <figcaption>تجربه در فضای باز</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
