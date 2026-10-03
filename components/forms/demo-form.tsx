"use client"

import { useState } from "react"

const digitMap: Record<string, string> = {
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
}

function digits(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (d) => digitMap[d] ?? d).replace(/\D/g, "")
}

export function mobileOk(value: string) {
  return /^09\d{9}$/.test(digits(value))
}

type Field = {
  id: string
  name: string
  label: string
  required?: boolean
  type?: "text" | "tel" | "textarea"
  autoComplete?: string
}

export function DemoForm({
  fields,
  submitLabel,
  intro,
  compact,
}: {
  fields: Field[]
  submitLabel: string
  intro?: string
  compact?: boolean
}) {
  const [message, setMessage] = useState("")
  const [error, setError] = useState(false)
  const [preview, setPreview] = useState("")
  const [invalid, setInvalid] = useState("")
  const [busy, setBusy] = useState(false)

  return (
    <form
      className={compact ? "mb-5" : "fn-card"}
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        if (busy) return
        setError(false)
        setMessage("")
        setPreview("")
        const form = event.currentTarget
        const controls = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea"))
        let first: HTMLInputElement | HTMLTextAreaElement | null = null
        for (const field of controls) {
          field.removeAttribute("aria-invalid")
          if (field.required && !field.value.trim()) first = first ?? field
          if (field.name === "mobile" && !mobileOk(field.value)) first = first ?? field
        }
        if (first) {
          first.setAttribute("aria-invalid", "true")
          first.focus()
          setInvalid(first.name)
          setError(true)
          setMessage(first.name === "mobile" ? "شماره موبایل را با ۰۹ و ۱۱ رقم وارد کن." : "این فیلد را کامل کن.")
          return
        }
        setInvalid("")
        setBusy(true)
        const lines = controls
          .filter((field) => field.name && field.value.trim())
          .map((field) => {
            const label = form.querySelector(`label[for="${field.id}"]`)
            return `${label?.textContent ?? field.name}: ${field.value.trim()}`
          })
        window.setTimeout(() => {
          setBusy(false)
          setPreview(`پیش‌نمایش درخواست:\n${lines.join("\n")}`)
          setMessage("این فرم در نسخه نمایشی ارسال نمی‌شود.")
        }, 250)
      }}
    >
      {intro ? <p style={{ marginBottom: 16 }}>{intro}</p> : null}
      {fields.map((field) => (
        <div className={compact ? undefined : "fn-field"} key={field.id}>
          <label
            className={compact ? "block text-xs mb-1" : undefined}
            style={compact ? { color: "color-mix(in srgb, var(--fn-ink) 86%, transparent)" } : undefined}
            htmlFor={field.id}
          >
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea id={field.id} name={field.name} rows={4} required={field.required} aria-invalid={invalid === field.name} />
          ) : compact && field.name === "mobile" ? (
            <div className="flex border overflow-hidden" style={{ borderColor: "color-mix(in srgb, var(--fn-ink) 18%, transparent)" }}>
              <input
                id={field.id}
                name={field.name}
                type="tel"
                required={field.required}
                inputMode="numeric"
                dir="ltr"
                autoComplete={field.autoComplete}
                aria-invalid={invalid === field.name}
                className="bg-transparent text-sm p-3 w-full focus:outline-none"
              />
              <button
                className="font-bold uppercase text-xs px-4 font-oswald transition shrink-0"
                style={{ background: "var(--gold)", color: "var(--fn-fill)", minHeight: 44 }}
                disabled={busy}
              >
                {submitLabel}
              </button>
            </div>
          ) : (
            <input
              id={field.id}
              name={field.name}
              type={field.type === "tel" ? "tel" : "text"}
              required={field.required}
              inputMode={field.type === "tel" ? "numeric" : undefined}
              dir={field.type === "tel" ? "ltr" : undefined}
              autoComplete={field.autoComplete}
              aria-invalid={invalid === field.name}
              className={compact ? "bg-transparent text-sm p-3 w-full border mb-3 focus:outline-none" : undefined}
              style={compact ? { borderColor: "transparent" } : undefined}
            />
          )}
        </div>
      ))}
      {compact ? null : (
        <button className="fn-btn" type="submit" disabled={busy}>
          {submitLabel}
        </button>
      )}
      <p className={`fn-form-msg${error ? " is-error" : ""}${compact ? " text-xs mt-3" : ""}`} role="status">
        {message}
      </p>
      {preview ? <div className="fn-review">{preview}</div> : null}
    </form>
  )
}
