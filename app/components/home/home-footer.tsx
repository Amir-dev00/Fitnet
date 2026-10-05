import Link from "next/link"

import { DemoForm } from "@/components/forms/demo-form"
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
                <a href="#how-it-works">نحوه کار</a>
              </li>
              <li>
                <a href="#events">رویدادها</a>
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
                <Link href="/guides/">راهنما</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 id="contact">دسترسی زودهنگام</h4>
            <p className="fn-home-footer-copy">این فرم در نسخه نمایشی ارسال نمی‌شود.</p>
            <DemoForm
              compact
              submitLabel="ثبت"
              fields={[
                { id: "ea-name", name: "name", label: "نام", required: true, autoComplete: "name" },
                {
                  id: "ea-mobile",
                  name: "mobile",
                  label: "شماره موبایل",
                  required: true,
                  type: "tel",
                  autoComplete: "tel",
                },
              ]}
            />
          </div>
        </div>

        <div className="fn-home-footer-bottom">
          <p>© 2026 Fitnet. تمامی حقوق محفوظ است.</p>
          <div>
            <Link href="/guides/">راهنما</Link>
            <Link href="/terms/">قوانین استفاده</Link>
            <Link href="/privacy/">حریم خصوصی</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
