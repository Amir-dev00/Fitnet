"use client"

import { Dialog } from "@base-ui/react/dialog"
import { Download, Globe, ShoppingBag, Smartphone, X, type LucideIcon } from "lucide-react"

import { downloads } from "@/lib/downloads"

type NativeOption = {
  id: string
  label: string
  href: string | null
  icon: LucideIcon
}

const nativeOptions: NativeOption[] = [
  { id: "bazaar", label: "دریافت از کافه‌بازار", href: downloads.cafeBazaar, icon: ShoppingBag },
  { id: "play", label: "دریافت از گوگل‌پلی", href: downloads.googlePlay, icon: Smartphone },
  { id: "apk", label: "دانلود مستقیم", href: downloads.directApk, icon: Download },
]

function DownloadOption({ option }: { option: NativeOption }) {
  const Icon = option.icon
  const available = Boolean(option.href)

  if (available && option.href) {
    return (
      <li>
        <a
          className="fn-sheet-option"
          href={option.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon className="fn-sheet-option-icon" aria-hidden="true" strokeWidth={1.75} />
          <span className="fn-sheet-option-label">{option.label}</span>
        </a>
      </li>
    )
  }

  return (
    <li>
      <button
        type="button"
        className="fn-sheet-option is-unavailable"
        disabled
        aria-disabled="true"
        aria-label={`${option.label} — به‌زودی`}
      >
        <Icon className="fn-sheet-option-icon" aria-hidden="true" strokeWidth={1.75} />
        <span className="fn-sheet-option-label">{option.label}</span>
        <span className="fn-sheet-option-status">به‌زودی</span>
      </button>
    </li>
  )
}

function WebAppAction({ className }: { className?: string }) {
  const href = downloads.webApp

  if (href) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        <Globe className="fn-hero-btn-icon" aria-hidden="true" size={22} strokeWidth={2} />
        <span>ورود به نسخه وب</span>
      </a>
    )
  }

  return (
    <button type="button" className={className}>
      <Globe className="fn-hero-btn-icon" aria-hidden="true" size={22} strokeWidth={2} />
      <span>ورود به نسخه وب</span>
    </button>
  )
}

export function HeroDownloadActions({
  className,
  enter = true,
}: {
  className?: string
  enter?: boolean
}) {
  return (
    <Dialog.Root>
      <div
        className={["fn-hero-actions", className].filter(Boolean).join(" ")}
        data-fn-enter={enter ? "actions" : undefined}
      >
        <WebAppAction className="fn-hero-btn fn-hero-btn-primary" />

        <Dialog.Trigger className="fn-hero-btn fn-hero-btn-secondary">
          <Download className="fn-hero-btn-icon" aria-hidden="true" size={22} strokeWidth={2} />
          <span>دانلود اپلیکیشن</span>
        </Dialog.Trigger>
      </div>

      <Dialog.Portal>
        <Dialog.Backdrop className="fn-download-backdrop" />
        <Dialog.Popup className="fn-download-sheet">
          <div className="fn-download-sheet-head">
            <Dialog.Title className="fn-download-sheet-title">
              دریافت اپلیکیشن فیت‌نت
            </Dialog.Title>
            <Dialog.Close className="fn-download-sheet-close" aria-label="بستن">
              <X aria-hidden="true" strokeWidth={2} />
              <span>بستن</span>
            </Dialog.Close>
          </div>

          <ul className="fn-download-sheet-list" aria-label="روش‌های دانلود">
            {nativeOptions.map((option) => (
              <DownloadOption key={option.id} option={option} />
            ))}
          </ul>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
