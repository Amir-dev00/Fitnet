"use client"

import { useEffect, useRef, useState } from "react"

import { Logo } from "@/components/site/logo"

type Menu = "gyms" | "events" | "how" | "plans" | null
type Filter = "all" | "gyms" | "events" | "plans" | "guide"

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "gyms", label: "باشگاه‌ها" },
  { id: "events", label: "رویدادها" },
  { id: "plans", label: "پلن‌ها" },
  { id: "guide", label: "راهنما" },
]

export function HomeHeader() {
  const [menu, setMenu] = useState<Menu>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [filter, setFilter] = useState<Filter>("all")
  const timer = useRef<number>(0)
  const menuButton = useRef<HTMLButtonElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  function openMenu(next: Menu) {
    window.clearTimeout(timer.current)
    setMenu(next)
    setSearchOpen(false)
  }

  function closeMenu() {
    timer.current = window.setTimeout(() => setMenu(null), 120)
  }

  function closeDrawer() {
    setDrawer(false)
    menuButton.current?.focus()
  }

  function dismiss() {
    const wasDrawer = drawer
    setMenu(null)
    setSearchOpen(false)
    setDrawer(false)
    if (wasDrawer) menuButton.current?.focus()
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle("fn-lock", drawer)
    if (drawer) closeButton.current?.focus()
    return () => document.body.classList.remove("fn-lock")
  }, [drawer])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  const show = () => true

  return (
    <>
      <div
        className={`mob-overlay fixed inset-0 bg-black/80 z-20${drawer || menu ? " open" : ""}`}
        onClick={dismiss}
        hidden={!drawer && !menu}
      />
      <div
        className={`mob-drawer fixed top-0 right-0 w-4/5 max-w-xs z-50 flex flex-col border-l brand-border lg:hidden fn-on-indigo ${drawer ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: "var(--fn-fill)" }}
        inert={!drawer}
        aria-hidden={!drawer}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b brand-border">
          <Logo />
          <button ref={closeButton} type="button" onClick={closeDrawer} aria-label="بستن" className="w-8 h-8 border brand-border flex items-center justify-center text-[var(--fn-ink)]/40 hover:text-gold transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="flex-1 px-6 py-6 text-xs overflow-y-auto">
          {[
            ["#gyms", "کشف فیت‌نت"],
            ["#events", "رویدادها"],
            ["#how-it-works", "نحوه کار"],
            ["#plans", "پلن‌ها"],
          ].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setDrawer(false)} className="flex justify-between py-4 border-b brand-border font-bold uppercase tracking-wider text-[var(--fn-ink)]/50 hover:text-gold transition">
              {label} <span>&larr;</span>
            </a>
          ))}
          <a href="#partners" onClick={() => setDrawer(false)} className="flex justify-between py-4 font-bold uppercase tracking-wider text-[var(--fn-ink)]/20 hover:text-gold transition">
            همکاری <span>&larr;</span>
          </a>
        </nav>
        <div className="px-6 pb-8">
          <a href="#download" onClick={() => setDrawer(false)} className="block font-oswald font-bold uppercase text-xs tracking-widest py-4 text-center transition" style={{ background: "var(--fn-action)", color: "var(--fn-action-ink)" }}>
            دسترسی زودهنگام
          </a>
        </div>
      </div>

      <header id="hdrAurum" className={`fixed top-0 left-0 right-0 z-30 border-b border-transparent fn-on-indigo${scrolled ? " hdr-scrolled" : ""}`}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, color-mix(in srgb, var(--fn-ink) 50%, transparent), transparent)" }} />
        <div className="max-w-[1440px] mx-auto flex items-center h-full px-6 gap-6">
          <Logo lockup />
          <nav className="hidden lg:flex items-center gap-0 flex-1">
            {(
              [
                ["gyms", "کشف فیت‌نت"],
                ["events", "رویدادها"],
                ["how", "نحوه کار"],
                ["plans", "پلن‌ها"],
              ] as const
            ).map(([id, label]) => (
              <div key={id} className="relative" onMouseEnter={() => openMenu(id)} onMouseLeave={closeMenu}>
                <button type="button" className={`flex items-center gap-1.5 px-5 py-3 text-[11px] font-bold uppercase tracking-widest transition ${menu === id ? "text-gold" : "text-[var(--fn-ink)]/50 hover:text-[var(--fn-ink)]"}`} aria-expanded={menu === id}>
                  {label}
                  <svg className={`w-3 h-3 transition-transform duration-200 ${menu === id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
            ))}
            <a href="#partners" className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-[var(--fn-ink)]/20 hover:text-gold transition">همکاری</a>
          </nav>
          <div className="flex items-center gap-2 ms-auto">
            <button
              type="button"
              aria-label="جستجو"
              aria-expanded={searchOpen}
              onClick={() => {
                setSearchOpen((open) => !open)
                setMenu(null)
              }}
              className={`w-9 h-9 border transition brand-border ${searchOpen ? "border-gold text-gold" : "text-[var(--fn-ink)]/40 hover:text-gold"}`}
            >
              <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <a href="#download" className="hidden md:inline-flex items-center gap-2 font-oswald font-bold uppercase text-[11px] tracking-widest px-6 py-3 hover:bg-brand transition" style={{ background: "var(--fn-action)", color: "var(--fn-action-ink)" }}>
              دسترسی زودهنگام ←
            </a>
            <button ref={menuButton} id="fn-menu-btn" type="button" aria-label="منو" aria-expanded={drawer} onClick={() => setDrawer(true)} className="lg:hidden w-9 h-9 border brand-border flex items-center justify-center text-[var(--fn-ink)]/40 hover:text-gold transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>

        {menu === "gyms" ? (
          <div className="mega-panel absolute top-full left-0 right-0 z-40" onMouseEnter={() => openMenu("gyms")} onMouseLeave={closeMenu}>
            <div className="max-w-[1440px] mx-auto px-6 py-10 grid gap-6 md:grid-cols-4">
              <div>
                <p className="col-head">کشف</p>
                <a href="#gyms" className="mega-link"><div><div className="ml-t">باشگاه‌های نزدیک</div><div className="ml-d">مجموعه‌های اطرافت را پیدا کن</div></div></a>
                <a href="#gyms" className="mega-link mt-1"><div><div className="ml-t">امروز در دسترس</div><div className="ml-d">گزینه‌هایی که امروز رزرو دارند</div></div></a>
                <a href="#gyms" className="mega-link mt-1"><div><div className="ml-t">نقشه فیت‌نت</div><div className="ml-d">بین لیست و نقشه جابه‌جا شو</div></div></a>
              </div>
              <div>
                <p className="col-head">کیف پول</p>
                <a href="#gyms" className="mega-link"><div><div className="ml-t">اعتبار ماهانه</div><div className="ml-d">با پلن، اعتبار می‌گیری</div></div></a>
                <a href="#gyms" className="mega-link mt-1"><div><div className="ml-t">قیمت اعتباری</div><div className="ml-d">قبل از رزرو، اعتبار لازم را ببین</div></div></a>
                <a href="#gyms" className="mega-link mt-1"><div><div className="ml-t">علاقه‌مندی‌ها</div><div className="ml-d">باشگاه‌های ذخیره‌شده، دم دست</div></div></a>
              </div>
              <div>
                <p className="col-head">همکاری</p>
                <a href="#partners" className="mega-link"><div><div className="ml-t">باشگاه داری؟</div><div className="ml-d">ظرفیت، رزرو و ورود را مدیریت کن</div></div></a>
                <a href="#partners" className="mega-link mt-1"><div><div className="ml-t">رویداد برگزار می‌کنی؟</div><div className="ml-d">ثبت، تأیید، بعد انتشار</div></div></a>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest font-bold mb-3" style={{ color: "color-mix(in srgb, var(--fn-ink) 86%, transparent)" }}>کیف پول</p>
                <div className="p-5" style={{ background: "color-mix(in srgb, var(--fn-ink) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--fn-ink) 20%, transparent)" }}>
                  <p className="font-oswald font-black text-4xl glow-gold leading-none">اعتبار</p>
                  <p className="text-[var(--fn-ink)]/30 text-xs mt-1 mb-3">یک حساب · یک کیف پول</p>
                  <ul className="space-y-1.5 text-xs text-[var(--fn-ink)]/50">
                    <li>موجودی و تاریخچه</li>
                    <li>نزدیک به انقضا</li>
                    <li>هزینه هر اعتبار</li>
                    <li>رزرو باشگاه و رویداد</li>
                  </ul>
                  <a href="#plans" className="mt-4 block text-center font-oswald font-bold uppercase text-[10px] tracking-widest py-2.5" style={{ background: "var(--fn-action)", color: "var(--fn-action-ink)" }}>مشاهده پلن‌ها</a>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {menu === "events" ? (
          <div className="mega-panel absolute top-full left-0 right-0 z-40" onMouseEnter={() => openMenu("events")} onMouseLeave={closeMenu}>
            <div className="max-w-[1440px] mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                ["/images/photo-1534438327276-14e5300c3a48.jpg", "رویداد ورزشی", "رزرو با اعتبار"],
                ["/images/photo-1571019613454-1cb2f99b2d8b.jpg", "امروز در دسترس", "رزرو برای امروز"],
                ["/images/photo-1544367567-0f2fcb009e0b.jpg", "باشگاه‌های نزدیک", "اطراف تو"],
                ["/images/photo-1581009146145-b5ef050c2e1e.jpg", "نقشه فیت‌نت", "لیست و نقشه"],
              ].map(([src, title, detail]) => (
                <a key={title} href="#events" className="group overflow-hidden relative h-40">
                  <img src={src} alt="" className="w-full h-full object-cover brightness-50" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end"><p className="ml-t">{title}</p><p className="ml-d">{detail}</p></div>
                </a>
              ))}
            </div>
          </div>
        ) : null}

        {menu === "how" ? (
          <div className="mega-panel absolute top-full left-0 right-0 z-40" onMouseEnter={() => openMenu("how")} onMouseLeave={closeMenu}>
            <div className="max-w-[1440px] mx-auto px-6 py-8 grid gap-6 md:grid-cols-3">
              <div>
                <p className="col-head">مسیر</p>
                <a href="#how-it-works" className="mega-link"><div><div className="ml-t">اعتبار بگیر</div><div className="ml-d">پلن ماهانه، اعتبار فیت‌نت</div></div></a>
                <a href="#how-it-works" className="mega-link mt-1"><div><div className="ml-t">پیدا کن</div><div className="ml-d">باشگاه یا رویداد</div></div></a>
                <a href="#how-it-works" className="mega-link mt-1"><div><div className="ml-t">رزرو کن</div><div className="ml-d">زمان ورود را انتخاب کن</div></div></a>
              </div>
              <div>
                <p className="col-head">ورود</p>
                <a href="#how-it-works" className="mega-link"><div><div className="ml-t">QR را نشان بده</div><div className="ml-d">ورود با QR یا کد</div></div></a>
                <a href="#how-it-works" className="mega-link mt-1"><div><div className="ml-t">Pro Step</div><div className="ml-d">تمرین انجام‌شده، پیشرفت هدیه</div></div></a>
              </div>
              <div>
                <p className="col-head">دعوت</p>
                <div className="space-y-2">
                  <div className="s-row">اعتبار بگیر</div>
                  <div className="s-row">باشگاه یا رویداد</div>
                  <div className="s-row">زمان را رزرو کن</div>
                  <div className="s-row">با QR وارد شو</div>
                  <a href="#how-it-works" className="block mt-3 text-[10px] uppercase tracking-widest font-bold text-gold">نحوه کار ←</a>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {menu === "plans" ? (
          <div className="mega-panel absolute top-full left-0 right-0 z-40" onMouseEnter={() => openMenu("plans")} onMouseLeave={closeMenu}>
            <div className="max-w-[1440px] mx-auto px-6 py-8 grid gap-6 md:grid-cols-3">
              <div>
                <p className="col-head">پلن</p>
                <a href="#plans" className="mega-link"><div><div className="ml-t">اعتبار ماهانه</div><div className="ml-d">تعداد اعتبار، از تنظیمات پلن</div></div></a>
                <a href="#plans" className="mega-link mt-1"><div><div className="ml-t">هزینه هر اعتبار</div><div className="ml-d">قیمت پلن تقسیم بر اعتبار</div></div></a>
                <a href="#plans" className="mega-link mt-1"><div><div className="ml-t">مدت پلن</div><div className="ml-d">ماهانه و قابل تنظیم</div></div></a>
              </div>
              <div>
                <p className="col-head">پاداش</p>
                <a href="#plans" className="mega-link"><div><div className="ml-t">Pro Step</div><div className="ml-d">پیشرفت با حضور انجام‌شده</div></div></a>
                <a href="#plans" className="mega-link mt-1"><div><div className="ml-t">دعوت دوستان</div><div className="ml-d">پاداش بعد از اشتراک دوست</div></div></a>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest mb-3 font-bold" style={{ color: "color-mix(in srgb, var(--fn-ink) 86%, transparent)" }}>ساختار پلن</p>
                <p className="text-[var(--fn-ink)]/40 text-xs leading-relaxed mb-5">جزئیات پلن‌ها هم‌زمان با شروع فیت‌نت اعلام می‌شود.</p>
                <a href="#plans" className="block text-center font-oswald font-bold uppercase text-[10px] tracking-widest py-3" style={{ background: "var(--fn-action)", color: "var(--fn-action-ink)" }}>مشاهده پلن‌ها</a>
              </div>
            </div>
          </div>
        ) : null}

        {searchOpen ? (
          <div className="search-panel absolute top-full left-0 right-0 z-40 py-6 px-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-5">
                <input className="s-in flex-1" placeholder="در فیت‌نت جستجو کن..." aria-label="جستجو" />
                <button type="button" onClick={() => setSearchOpen(false)} className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider" style={{ color: "color-mix(in srgb, var(--fn-ink) 86%, transparent)" }}>
                  <span dir="ltr">Esc</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.map((item) => (
                  <button key={item.id} type="button" className={`s-tag${filter === item.id ? " active" : ""}`} onClick={() => setFilter(item.id)}>
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {show() ? (
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-bold mb-3">باشگاه‌ها</p>
                    <a className="s-row" href="#gyms" onClick={() => setSearchOpen(false)}>نزدیک شما</a>
                    <a className="s-row" href="#gyms" onClick={() => setSearchOpen(false)}>امروز در دسترس</a>
                    <a className="s-row" href="#gyms" onClick={() => setSearchOpen(false)}>نقشه</a>
                  </div>
                ) : null}
                {show() ? (
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-bold mb-3">رویدادها</p>
                    <a className="s-row" href="#events" onClick={() => setSearchOpen(false)}>رویداد تأییدشده</a>
                    <a className="s-row" href="#events" onClick={() => setSearchOpen(false)}>رزرو با اعتبار</a>
                    <a className="s-row" href="#events" onClick={() => setSearchOpen(false)}>ورود با QR</a>
                  </div>
                ) : null}
                {show() ? (
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-bold mb-3">پلن‌ها</p>
                    <a className="s-row" href="#plans" onClick={() => setSearchOpen(false)}>اعتبار ماهانه</a>
                    <a className="s-row" href="#plans" onClick={() => setSearchOpen(false)}>هزینه هر اعتبار</a>
                    <a className="s-row" href="#plans" onClick={() => setSearchOpen(false)}>ساختار پلن</a>
                  </div>
                ) : null}
                {show() ? (
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-bold mb-3">راهنما</p>
                    <a className="s-row" href="#how-it-works" onClick={() => setSearchOpen(false)}>نحوه کار</a>
                    <a className="s-row" href="#gyms" onClick={() => setSearchOpen(false)}>کیف پول</a>
                    <a className="s-row" href="#partners" onClick={() => setSearchOpen(false)}>همکاری</a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </header>
    </>
  )
}
