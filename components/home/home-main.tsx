import Link from "next/link"

import { DemoForm } from "@/components/forms/demo-form"
import { faqs } from "@/lib/content"
import { HeroAurora } from "@/components/motion/hero-aurora"
import { Logo } from "@/components/site/logo"

const muted = { color: "color-mix(in srgb, var(--fn-ink) 86%, transparent)" }

export function HomeMain() {
  return (
    <>
      <section className="aurum-hero relative flex flex-col gs-hero fn-on-indigo">
        <div className="absolute inset-0" aria-hidden="true">
          <HeroAurora />
          <div className="hero-scrim absolute inset-0" />
        </div>
        <div className="au-deco-monogram" aria-hidden="true">F</div>
        <div className="hero-stage max-w-[1440px] mx-auto w-full px-6 relative z-10">
          <div className="hero-copy flex flex-col justify-center py-12 lg:py-16">
            <div className="flex flex-wrap items-center gap-6 mb-8" data-fn-enter="eyebrow">
              <span className="au-eyebrow">
                <span className="ornament" />
                <span>یک حساب. یک کیف پول. انتخاب‌های بیشتر.</span>
              </span>
            </div>
            <h1 className="au-title mb-8">
              <span className="l1">شهر،</span>
              <span className="l2">زمین تمرین</span>
              <span className="l3">توست.</span>
            </h1>
            <div className="flex items-start gap-5 max-w-xl mb-8" data-fn-enter="copy">
              <div className="hero-rule flex-shrink-0 mt-2 hidden md:block" style={{ width: 30, height: 1, background: "linear-gradient(to right,var(--gold),transparent)" }} />
              <p className="text-base md:text-lg" style={{ color: "color-mix(in srgb, var(--fn-ink) 88%, transparent)" }}>
                باشگاه‌های همکار و رویدادهای ورزشی را کشف کن، زمان مناسب را رزرو کن و با اعتبار فیت‌نت و QR وارد شو.
              </p>
            </div>
            <div className="flex flex-wrap gap-3" data-fn-enter="cta">
              <a href="#download" className="au-cta-primary">
                <span>شروع با فیت‌نت</span>
              </a>
              <a href="#how-it-works" className="au-cta-ghost">
                <span>فیت‌نت چطور کار می‌کند؟</span>
              </a>
            </div>
          </div>
          <figure className="hero-visual">
            <img src="/images/photo-1534438327276-14e5300c3a48.jpg" alt="" width={960} height={1200} />
            <figcaption>پیش‌نمایش · کشف باشگاه نزدیک، بدون موجودی واقعی</figcaption>
          </figure>
        </div>
      </section>

      <div className="mwrap py-3 border-y fn-band">
        <div className="mtrack font-oswald font-bold uppercase tracking-wider text-sm text-black flex gap-10 items-center">
          {Array.from({ length: 2 }).map((_, copy) => (
            <span key={copy} className="flex gap-10">
              <span>• باشگاه‌های نزدیک</span>
              <span>• رزرو سریع</span>
              <span>• رویدادهای ورزشی</span>
              <span>• کیف پول اعتباری</span>
              <span>• ورود با QR</span>
              <span>• نقشه فیت‌نت</span>
              <span>• پلن‌های ماهانه</span>
              <span>• Pro Step</span>
              <span>• دعوت دوستان</span>
            </span>
          ))}
        </div>
      </div>

      <section id="how-it-works" className="py-28 px-6 gs-amenities" style={{ background: "var(--fn-fill)" }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="fn-path-layout">
            <div>
              <p className="fn-kicker">مسیر تمرین</p>
              <h2 className="fn-heading">از انتخاب تا ورود،<br /><span className="fn-display">چهار قدم.</span></h2>
              <p className="fn-section-copy">پلن مناسب خودت را انتخاب کن و کیف پولت را شارژ کن. بعد باشگاه یا رویداد را ببین، زمان را چک کن و رزرو را تأیید کن. با ساخت حساب، ۱ اعتبار شروع دریافت می‌کنی.</p>
            </div>
            <figure className="fn-path-photo">
              <img loading="lazy" alt="" src="/images/photo-1544367567-0f2fcb009e0b.jpg" width={960} height={720} />
              <figcaption>نزدیک‌ترین انتخاب‌ها، روی نقشه</figcaption>
            </figure>
          </div>
          <ol className="fn-path">
            <li><span>۱</span><h3>اعتبار بگیر</h3><p>پلن مناسب خودت را انتخاب کن و کیف پولت را شارژ کن.</p></li>
            <li><span>۲</span><h3>پیدا کن</h3><p>باشگاه یا رویداد دلخواهت را ببین.</p></li>
            <li><span>۳</span><h3>رزرو کن</h3><p>زمان و اعتبار موردنیاز را بررسی و رزروت را تأیید کن.</p></li>
            <li><span>۴</span><h3>وارد شو</h3><p>QR یا کد رزرو را نشان بده و تمرینت را شروع کن.</p></li>
          </ol>
        </div>
      </section>

      <section id="gyms" className="py-28 px-6 gs-facilities fn-on-blue" style={{ background: "var(--fn-fill)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div>
              <div className="h-px w-12 mb-6" style={{ background: "var(--gold)" }} />
              <h2 className="font-oswald font-black text-6xl fn-heading" style={{ color: "var(--fn-ink)" }}>یک کیف پول،<br /><span className="fn-display">برای انتخاب‌های بیشتر.</span></h2>
            </div>
            <p style={muted} className="text-sm leading-relaxed max-w-xs">اعتبارت را یک‌جا ببین، برای باشگاه و رویداد خرج کن و از تاریخچه و زمان انقضای آن خبر داشته باش.</p>
          </div>
          <div className="fn-feature-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["جستجو و کشف", "باشگاه‌ها را با نام یا منطقه پیدا کن.", true],
              ["نقشه فیت‌نت", "بین لیست و نقشه جابه‌جا شو و موقعیت‌ها را کنار هم ببین.", false],
              ["قیمت اعتباری", "قبل از رزرو ببین هر فرصت چند اعتبار لازم دارد.", false],
              ["بازه‌های ورود", "تاریخ و بازه ورود موجود را انتخاب کن.", false],
              ["رزرو سریع", "فرصت مناسب را انتخاب کن و رزرو را تأیید کن.", false],
              ["ورود با QR", "بعد از رزرو، QR یا کد ورود می‌گیری.", false],
              ["کیف پول فیت‌نت", "موجودی، تاریخچه و اعتبار نزدیک به انقضا، یکجا.", false],
              ["علاقه‌مندی‌ها", "باشگاه‌های موردعلاقه‌ات را ذخیره کن و سریع برگرد.", false],
            ].map(([title, copy, lead]) => (
              <div key={String(title)} className={lead ? "fn-lead p-8" : "p-8"}>
                <h3 className="font-oswald font-bold text-xl uppercase mb-3" style={{ color: "var(--fn-ink)" }}>{title}</h3>
                <p style={muted} className="text-sm leading-relaxed mb-4">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="partners" className="py-28 px-6 gs-trainers" style={{ background: "var(--fn-fill)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-px w-16 mx-auto mb-8" style={{ background: "linear-gradient(to right, transparent, var(--gold), transparent)" }} />
            <h2 className="font-oswald font-black text-5xl fn-heading" style={{ color: "var(--fn-ink)" }}>باشگاه تو.<br /><span className="fn-display">فرصت‌های تازه.</span></h2>
            <p className="text-sm mt-5 max-w-lg mx-auto leading-relaxed" style={muted}>ظرفیت قابل رزرو را به کاربران فیت‌نت معرفی کن و رزروها، ورودها و وضعیت تسویه را یک‌جا مدیریت کن.</p>
          </div>
          <div className="fn-audience-row mb-6">
            <div className="swiper-wrapper">
              {[
                ["/images/photo-1534438327276-14e5300c3a48.jpg", "کاربر", "کاربر فیت‌نت", "کشف تا ورود", "کشف، اعتبار، رزرو و QR در یک تجربه ساده."],
                ["/images/photo-1571019614242-c5c5dee9f50b.jpg", "باشگاه", "باشگاه‌های همکار", "عملیات مجموعه", "شعب، ظرفیت، رزروها و ورود را از یک داشبورد ببین."],
                ["/images/photo-1544367567-0f2fcb009e0b.jpg", "رویداد", "برگزارکنندگان", "انتشار پس از تأیید", "رویداد بساز، ثبت‌نام‌ها را ببین و حضور را مدیریت کن."],
                ["/images/photo-1517836357463-d25dfe09ce18.jpg", "عملیات", "همکاران فیت‌نت", "ارتباط و پشتیبانی", "ارتباط با باشگاه‌ها، بررسی مجموعه‌ها و پشتیبانی از عملیات."],
              ].map(([src, kicker, title, meta, copy]) => (
                <div className="fn-audience-card" key={title}>
                  <div className="group border trainer-slide-card" style={{ borderColor: "color-mix(in srgb, var(--fn-ink) 10%, transparent)" }}>
                    <div className="h-64 overflow-hidden relative">
                      <img loading="lazy" alt="" src={src} className="w-full h-full object-cover object-top" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(23, 11, 147, .95), transparent 60%)" }} />
                    </div>
                    <div className="p-6">
                      <p className="text-[9px] uppercase tracking-widest font-bold mb-2" style={{ color: "var(--gold)" }}>{kicker}</p>
                      <h4 className="font-oswald font-bold text-xl uppercase" style={{ color: "var(--fn-ink)" }}>{title}</h4>
                      <p className="text-sm mt-1 mb-4" style={muted}>{meta}</p>
                      <p className="text-xs leading-relaxed" style={muted}>{copy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="fn-audience-actions flex flex-wrap justify-center gap-4 mt-10">
            <Link href="/contact/?path=gym" className="font-oswald font-bold uppercase text-xs tracking-widest px-6 py-4" style={{ background: "var(--fn-action)", color: "var(--fn-action-ink)" }}>درخواست همکاری باشگاه</Link>
            <Link href="/contact/?path=organizer" className="border font-oswald font-bold uppercase text-xs tracking-widest px-6 py-4 brand-border" style={{ color: "var(--gold)" }}>همکاری به‌عنوان برگزارکننده</Link>
          </div>
        </div>
      </section>

      <section id="plans" className="py-28 px-6 gs-membership" style={{ background: "var(--fn-fill)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <div className="h-px w-12 mb-6" style={{ background: "var(--gold)" }} />
              <h2 className="font-oswald font-black text-6xl fn-heading" style={{ color: "var(--fn-ink)" }}>با ریتم خودت،<br /><span className="fn-display">پلن انتخاب کن.</span></h2>
            </div>
            <p style={muted} className="text-sm leading-relaxed max-w-xs">پلن‌های ماهانه فیت‌نت با مقدار اعتبار متفاوت طراحی می‌شوند؛ انتخاب کن چقدر می‌خواهی برای تجربه‌های ورزشی‌ات کنار بگذاری.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            <div className="tier-card p-10">
              <p className="text-[9px] uppercase tracking-widest font-bold mb-5" style={muted}>معیار</p>
              <p className="font-oswald font-black text-4xl fn-card-title mb-4" style={{ color: "var(--fn-ink)" }}>اعتبار ماهانه</p>
              <p className="text-sm leading-relaxed" style={muted}>هر پلن مقدار مشخصی اعتبار برای باشگاه و رویداد دارد. یک اشتراک فعال در هر زمان کافی است.</p>
            </div>
            <div className="p-10 fn-on-indigo" style={{ background: "var(--fn-fill)" }}>
              <p className="text-[9px] uppercase tracking-widest font-bold mb-5" style={{ color: "var(--gold)" }}>معیار</p>
              <p className="font-oswald font-black text-4xl fn-card-title mb-4" style={{ color: "var(--fn-ink)" }}>هزینه هر اعتبار</p>
              <p className="text-sm leading-relaxed" style={muted}>وقتی قیمت‌ها اعلام شود، هزینه هر اعتبار از تقسیم قیمت پلن بر اعتبار شامل‌شده به دست می‌آید.</p>
            </div>
            <div className="tier-card p-10">
              <p className="text-[9px] uppercase tracking-widest font-bold mb-5" style={muted}>اعلام</p>
              <p className="font-oswald font-black text-4xl fn-card-title mb-4 text-brand">هم‌زمان با شروع</p>
              <p className="text-sm leading-relaxed mb-8" style={muted}>جزئیات پلن‌ها هم‌زمان با شروع فیت‌نت اعلام می‌شود.</p>
              <a href="#download" className="block text-center font-oswald font-bold uppercase text-xs tracking-widest py-4" style={{ background: "var(--fn-action)", color: "var(--fn-action-ink)" }}>دسترسی زودهنگام</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 px-6 gs-testimonials fn-on-blue" style={{ background: "var(--fn-fill)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="h-px w-16 mx-auto mb-8" style={{ background: "linear-gradient(to right, transparent, var(--gold), transparent)" }} />
            <h2 className="font-oswald font-black text-5xl fn-heading" style={{ color: "var(--fn-ink)" }}>مزایای همکاری<br /><span className="fn-display">با فیت‌نت</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              ["/images/photo-1534438327276-14e5300c3a48.jpg", "ظرفیت", "رزروهای امروز و ظرفیت هر بازه ورود را ببین.", "ظرفیتت را مدیریت کن", "داشبورد باشگاه"],
              ["/images/photo-1571019613454-1cb2f99b2d8b.jpg", "ورود", "QR کاربر یا کد ورود را بررسی کن.", "ورود سریع‌تر", "ورود با QR"],
              ["/images/photo-1583454110551-21f2fa2afe61.jpg", "تسویه", "بازدیدهای انجام‌شده و وضعیت تسویه را دنبال کن.", "عملکرد و تسویه", "داشبورد باشگاه"],
            ].map(([src, kicker, copy, title, meta]) => (
              <div className="p-8" key={title}>
                <div className="flex gap-1 mb-5 text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--gold)" }}>{kicker}</div>
                <p className="text-sm leading-relaxed mb-6" style={muted}>{copy}</p>
                <div className="flex items-center gap-3 pt-5 border-t" style={{ borderColor: "color-mix(in srgb, var(--fn-ink) 8%, transparent)" }}>
                  <img loading="lazy" alt="" src={src} width={64} height={48} className="w-10 h-10 object-cover" />
                  <div>
                    <p className="font-oswald font-bold text-sm uppercase" style={{ color: "var(--fn-ink)" }}>{title}</p>
                    <p className="text-[9px] uppercase tracking-widest" style={{ color: "var(--gold)" }}>{meta}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="events" className="py-28 px-6" style={{ background: "var(--fn-fill)" }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="fn-path-layout">
            <div>
              <p className="fn-kicker">پیش‌نمایش تجربه فیت‌نت</p>
              <h2 className="fn-heading">تمرین،<br /><span className="fn-display">فقط باشگاه نیست.</span></h2>
              <p className="fn-section-copy">از فضای همیشگی فاصله بگیر. رویدادهای ورزشی تأییدشده را پیدا کن و با اعتبار فیت‌نت همراه شو. رویدادهای تأییدشده، با شروع فیت‌نت اینجا معرفی می‌شوند.</p>
            </div>
            <p><Link href="/contact/?path=organizer" className="fn-btn ghost">همکاری به‌عنوان برگزارکننده</Link></p>
          </div>
          <div className="fn-preview">
            <article>
              <img loading="lazy" alt="" src="/images/photo-1571019614242-c5c5dee9f50b.jpg" width={800} height={520} />
              <div><p className="fn-num">۰۱</p><h3>تمرین گروهی</h3><p>جلسه‌هایی که با دیگران و با یک زمان مشخص برگزار می‌شوند.</p></div>
            </article>
            <article>
              <img loading="lazy" alt="" src="/images/photo-1517836357463-d25dfe09ce18.jpg" width={800} height={520} />
              <div><p className="fn-num">۰۲</p><h3>تجربه در فضای باز</h3><p>تمرین بیرون از سالن، وقتی رویداد تأیید شده باشد.</p></div>
            </article>
            <article>
              <img loading="lazy" alt="" src="/images/photo-1581009146145-b5ef050c2e1e.jpg" width={800} height={520} />
              <div><p className="fn-num">۰۳</p><h3>رویدادهای ویژه</h3><p>برنامه‌هایی که بعد از بررسی، برای ثبت‌نام باز می‌شوند.</p></div>
            </article>
          </div>
        </div>
      </section>

      <section id="rewards" className="py-28 px-6 fn-on-blue" style={{ background: "var(--fn-fill)" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-0">
          <div className="p-10 md:p-14">
            <p className="text-[10px] uppercase tracking-[.3em] font-bold mb-4 brand-latin" dir="ltr" style={{ color: "var(--gold)" }}>PRO STEP</p>
            <h2 className="font-oswald font-black text-4xl fn-heading mb-5" style={{ color: "var(--fn-ink)" }}>تمرینت را ادامه بده.<br />به هدیه نزدیک‌تر شو.</h2>
            <p className="text-sm leading-relaxed" style={muted}>اعتباری که برای حضورهای انجام‌شده خرج می‌کنی، پیشرفت Pro Step را جلو می‌برد. با رسیدن به هدف، هدیه‌ات را انتخاب کن.</p>
          </div>
          <div className="p-10 md:p-14">
            <p className="text-[10px] uppercase tracking-[.3em] font-bold mb-4" style={{ color: "var(--gold)" }}>دعوت</p>
            <h2 className="font-oswald font-black text-4xl fn-heading mb-5" style={{ color: "var(--fn-ink)" }}>رفیق تمرینت را هم خبر کن.</h2>
            <p className="text-sm leading-relaxed" style={muted}>لینک یا کد دعوتت را بفرست؛ بعد از اولین خرید اشتراک دوستت، اعتبار پاداش بگیر.</p>
          </div>
        </div>
      </section>

      <section id="faq" className="py-28 px-6" style={{ background: "var(--fn-fill)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="h-px w-12 mb-6" style={{ background: "var(--gold)" }} />
          <h2 className="font-oswald font-black text-5xl fn-heading mb-10" style={{ color: "var(--fn-ink)" }}>پرسش‌های<br /><span className="fn-display">رایج</span></h2>
          <div className="fn-faq">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <div className="fn-a">{answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="download" className="py-28 px-6 relative overflow-hidden gs-cta fn-on-indigo" style={{ background: "var(--fitnet-indigo)" }}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 relative z-10">
          <div>
            <h2 className="font-oswald font-black fn-heading text-black" style={{ fontSize: "clamp(2.4rem,5.5vw,4.6rem)" }}>انتخاب بعدی‌ات،<br />یک تجربه تازه.</h2>
            <p className="text-black/55 text-base mt-6 max-w-md leading-relaxed">فیت‌نت برای کشف باشگاه‌ها و رویدادهای ورزشی در کنار توست. برای شروع همراه شو.</p>
          </div>
          <div className="flex flex-col gap-4 min-w-[280px]">
            <a href="#contact" className="bg-black text-brand font-oswald font-bold uppercase text-sm tracking-widest px-10 py-5 hover:bg-white hover:text-black transition text-center">دسترسی زودهنگام</a>
            <a href="#plans" className="border-2 border-black/25 text-black font-oswald font-bold uppercase text-sm tracking-widest px-10 py-5 text-center hover:bg-black hover:text-brand transition">مشاهده پلن‌ها</a>
            <p className="text-center text-black/40 text-[10px] uppercase tracking-widest">باشگاه داری؟ <a href="#partners" className="underline">درخواست همکاری</a></p>
          </div>
        </div>
      </section>

      <footer className="pt-20 pb-10 px-6 border-t relative overflow-hidden fn-on-indigo" style={{ background: "var(--fn-fill)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16 relative z-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6"><Logo lockup /></div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={muted}>باشگاه و رویداد ورزشی، با یک تجربه ساده‌تر.</p>
            <p className="text-sm"><a href="https://fitnet.ir/" className="brand-latin" dir="ltr" style={{ color: "color-mix(in srgb, var(--fn-ink) 55%, transparent)" }}>fitnet.ir</a></p>
          </div>
          <div>
            <h4 className="font-oswald font-bold uppercase text-sm tracking-widest mb-6" style={{ color: "var(--fn-ink)" }}>محصول</h4>
            <ul className="space-y-3 text-sm" style={muted}>
              <li><a href="#gyms">باشگاه‌ها</a></li>
              <li><a href="#events">رویدادها</a></li>
              <li><a href="#plans">پلن‌ها</a></li>
              <li><a href="#how-it-works">نحوه کار</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-oswald font-bold uppercase text-sm tracking-widest mb-6" style={{ color: "var(--fn-ink)" }}>کسب‌وکار</h4>
            <ul className="space-y-3 text-sm" style={muted}>
              <li><Link href="/contact/?path=gym">همکاری با باشگاه‌ها</Link></li>
              <li><Link href="/contact/?path=organizer">برگزارکنندگان</Link></li>
              <li><Link href="/contact/">ارتباط با ما</Link></li>
            </ul>
          </div>
          <div>
            <h4 id="contact" className="font-oswald font-bold uppercase text-sm tracking-widest mb-6" style={{ color: "var(--fn-ink)" }}>دسترسی زودهنگام</h4>
            <p className="text-sm mb-4" style={muted}>این فرم در نسخه نمایشی ارسال نمی‌شود.</p>
            <DemoForm
              compact
              submitLabel="ثبت"
              fields={[
                { id: "ea-name", name: "name", label: "نام", required: true, autoComplete: "name" },
                { id: "ea-mobile", name: "mobile", label: "شماره موبایل", required: true, type: "tel", autoComplete: "tel" },
              ]}
            />
            <div className="text-xs" style={muted}>
              <p className="mb-1"><a href="https://fitnet.ir/" className="brand-latin" dir="ltr" style={{ color: "var(--fn-ink)" }}>fitnet.ir</a></p>
              <p><Link href="/guides/">راهنمای فیت‌نت</Link></p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t flex flex-col md:flex-row justify-between items-center text-xs relative z-10" style={{ borderColor: "color-mix(in srgb, var(--fn-ink) 8%, transparent)", color: "color-mix(in srgb, var(--fn-ink) 72%, transparent)" }}>
          <p>© 2026 Fitnet. تمامی حقوق محفوظ است.</p>
          <div className="flex gap-5 mt-4 md:mt-0">
            <Link href="/guides/">راهنما</Link>
            <Link href="/terms/">قوانین استفاده</Link>
            <Link href="/privacy/">حریم خصوصی</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
