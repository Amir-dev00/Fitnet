export function ProductPanels() {
  return (
    <section id="features" className="fn-section fn-section-tint">
      <div className="fn-home-shell">
        <header className="fn-section-head">
          <p className="fn-kicker">امکانات</p>
          <h2 className="fn-home-title">آنچه در حسابت داری</h2>
          <p className="fn-home-lead">
            کشف، اعتبار و ورود در یک مسیر ساده کنار هم قرار می‌گیرند.
          </p>
        </header>

        <div className="fn-panels">
          <article className="fn-panel fn-panel-lead">
            <h3>انتخاب‌های نزدیک تو</h3>
            <p>باشگاه‌ها را با نام یا منطقه پیدا کن و بین لیست و نقشه جابه‌جا شو.</p>
            <div className="fn-panel-detail" aria-hidden="true">
              <span>نقشه فیت‌نت</span>
              <span>لیست نزدیک</span>
            </div>
          </article>

          <article className="fn-panel">
            <h3>اعتبارت، یک‌جا</h3>
            <p>موجودی، تاریخچه و اعتبار لازم هر رزرو را قبل از تأیید ببین.</p>
            <div className="fn-panel-detail" aria-hidden="true">
              <span>۱۲ اعتبار</span>
            </div>
          </article>

          <article className="fn-panel">
            <h3>رزرو تا ورود</h3>
            <p>زمان را رزرو کن و با QR یا کد رزرو وارد باشگاه یا رویداد شو.</p>
            <div className="fn-panel-detail" aria-hidden="true">
              <span>QR ورود</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
