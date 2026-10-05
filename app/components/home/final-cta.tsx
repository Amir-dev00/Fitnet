import { HeroDownloadActions } from "@/app/components/home/hero-download-actions"

export function FinalCta() {
  return (
    <section id="download" className="fn-section fn-final-cta fn-on-indigo">
      <div className="fn-home-shell">
        <div className="fn-final-cta-inner">
          <div>
            <h2 className="fn-home-title">همین حالا شروع کن</h2>
            <p className="fn-home-lead">
              اپلیکیشن را دریافت کن یا وقتی نسخه وب آماده شد، وارد حسابت شو.
            </p>
          </div>
          <HeroDownloadActions enter={false} className="fn-final-actions" />
        </div>
      </div>
    </section>
  )
}
