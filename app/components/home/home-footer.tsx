import Link from "next/link"

import { Logo } from "@/components/site/logo"

export function HomeFooter() {
  return (
    <footer className="fn-home-footer fn-on-indigo">
      <div className="fn-home-shell">
        <div className="fn-home-footer-grid">
          <div>
            <Logo lockup />
            <p className="fn-home-footer-copy">باشگاه و رویداد ورزشی، با یک تجربه ساده‌تر.</p>
          </div>

          <div>
            <h4>محصول</h4>
            <ul>
              <li>
                <a href="/#how-it-works">نحوه کار</a>
              </li>
              <li>
                <a href="/#events">رویدادها</a>
              </li>
              <li>
                <Link href="/plans/">پلن‌ها</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>ارتباط</h4>
            <ul>
              <li>
                <Link href="/contact/?path=gym">همکاری باشگاه</Link>
              </li>
              <li>
                <Link href="/contact/?path=organizer">برگزارکنندگان</Link>
              </li>
              <li>
                <Link href="/contact/">ارتباط با ما</Link>
              </li>
              <li>
                <a href="/#faq">پرسش‌های رایج</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="fn-home-footer-bottom">
          <p>© 2026 Fitnet. تمامی حقوق محفوظ است.</p>
          <div>
            <a href="/#faq">پرسش‌های رایج</a>
            <Link href="/terms/">قوانین استفاده</Link>
            <Link href="/privacy/">حریم خصوصی</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
