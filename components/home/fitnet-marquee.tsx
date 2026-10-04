"use client"

import { useEffect, useRef, useState, type Ref } from "react"

const PHRASES = [
  "باشگاه‌های نزدیک",
  "رزرو سریع",
  "رویدادهای ورزشی",
  "کیف پول اعتباری",
  "ورود با QR",
  "نقشه فیت‌نت",
  "پلن‌های ماهانه",
  "Pro Step",
  "دعوت دوستان",
] as const

const SPEED_PX_PER_SEC = 60

function PhraseGroup({
  groupRef,
  hidden,
  copyIndex,
}: {
  groupRef?: Ref<HTMLSpanElement>
  hidden?: boolean
  copyIndex: number
}) {
  return (
    <span ref={groupRef} className="fn-band-group" aria-hidden={hidden ? true : undefined}>
      {PHRASES.map((label) => (
        <span key={`${copyIndex}-${label}`} className="fn-band-item">
          <span className="fn-band-dot" aria-hidden="true">
            •
          </span>
          <span className="fn-band-label">{label}</span>
        </span>
      ))}
      <span className="fn-band-spacer" aria-hidden="true" />
    </span>
  )
}

export function FitnetMarquee() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLSpanElement>(null)
  const [copyCount, setCopyCount] = useState(2)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncMotion = () => setReduceMotion(motionQuery.matches)
    syncMotion()
    motionQuery.addEventListener("change", syncMotion)
    return () => motionQuery.removeEventListener("change", syncMotion)
  }, [])

  useEffect(() => {
    if (reduceMotion) return

    const wrap = wrapRef.current
    const track = trackRef.current
    const group = groupRef.current
    if (!wrap || !track || !group) return

    let cancelled = false
    let frame = 0

    const applyMetrics = () => {
      if (cancelled) return

      const groupWidth = group.getBoundingClientRect().width
      const viewportWidth = wrap.getBoundingClientRect().width
      if (groupWidth < 1) return

      const needed = Math.max(2, Math.ceil(viewportWidth / groupWidth) + 2)
      setCopyCount((current) => (current === needed ? current : needed))

      const durationSec = groupWidth / SPEED_PX_PER_SEC
      track.style.setProperty("--fn-marquee-shift", `${groupWidth}px`)
      track.style.setProperty("--fn-marquee-duration", `${durationSec}s`)
      track.classList.add("is-ready")
    }

    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(applyMetrics)
    }

    const observer = new ResizeObserver(schedule)
    observer.observe(wrap)
    observer.observe(group)

    void document.fonts.ready.then(() => {
      if (!cancelled) schedule()
    })
    schedule()

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      track.classList.remove("is-ready")
    }
  }, [reduceMotion])

  if (reduceMotion) {
    return (
      <div className="mwrap py-3 border-y fn-band">
        <div className="mtrack font-oswald font-bold uppercase tracking-wider text-sm text-black is-static">
          <PhraseGroup copyIndex={0} />
        </div>
      </div>
    )
  }

  return (
    <div ref={wrapRef} className="mwrap py-3 border-y fn-band">
      <div
        ref={trackRef}
        className="mtrack font-oswald font-bold uppercase tracking-wider text-sm text-black"
      >
        {Array.from({ length: copyCount }, (_, index) => (
          <PhraseGroup
            key={index}
            copyIndex={index}
            groupRef={index === 0 ? groupRef : undefined}
            hidden={index > 0}
          />
        ))}
      </div>
    </div>
  )
}
