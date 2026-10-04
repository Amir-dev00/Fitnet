import Link from "next/link"

import { essentialFaqs } from "@/lib/content"

export function HomeFaq() {
  return (
    <section id="faq" className="fn-section">
      <div className="fn-home-shell fn-home-shell-narrow">
        <header className="fn-section-head">
          <p className="fn-kicker">راهنما</p>
          <h2 className="fn-home-title">پرسش‌های رایج</h2>
          <p className="fn-home-lead">
            پاسخ‌های کوتاه برای شروع. جزئیات بیشتر در{" "}
            <Link href="/guides/" className="fn-text-link">
              راهنمای فیت‌نت
            </Link>
            .
          </p>
        </header>

        <div className="fn-faq fn-home-faq">
          {essentialFaqs.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <div className="fn-a">{answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
