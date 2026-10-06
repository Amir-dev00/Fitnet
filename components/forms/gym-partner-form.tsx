"use client"

import { useId, useState, type FormEvent } from "react"

import { mobileOk } from "@/components/forms/demo-form"

import styles from "./gym-partner-form.module.css"

type Values = {
  gym: string
  city: string
  person: string
  mobile: string
  message: string
}

const empty: Values = { gym: "", city: "", person: "", mobile: "", message: "" }

const steps = [
  { label: "باشگاه" },
  { label: "مسئول" },
  { label: "پیام" },
  { label: "بازبینی" },
  { label: "تکمیل" },
]

const labels: Record<keyof Values, string> = {
  gym: "نام باشگاه یا مجموعه",
  city: "شهر",
  person: "نام مسئول",
  mobile: "شماره موبایل",
  message: "پیام",
}

export function GymPartnerForm() {
  const id = useId()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [values, setValues] = useState<Values>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({})
  const [busy, setBusy] = useState(false)
  const [accepted, setAccepted] = useState(false)

  function update(name: keyof Values, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function validate(index: number) {
    const next: Partial<Record<keyof Values, string>> = {}
    const required = "این فیلد را کامل کن."
    if (index === 0) {
      if (!values.gym.trim()) next.gym = required
      if (!values.city.trim()) next.city = required
    }
    if (index === 1) {
      if (!values.person.trim()) next.person = required
      if (!values.mobile.trim()) next.mobile = required
      else if (!mobileOk(values.mobile)) next.mobile = "شماره موبایل را با ۰۹ و ۱۱ رقم وارد کن."
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function go(next: number) {
    setDirection(next > step ? 1 : -1)
    setAccepted(false)
    setStep(next)
  }

  function onNext() {
    if (!validate(step)) return
    go(step + 1)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (busy || step !== 3 || !accepted) return
    for (let index = 0; index < 3; index += 1) {
      if (!validate(index)) {
        go(index)
        return
      }
    }
    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      go(4)
    }, 400)
  }

  function reset() {
    setValues(empty)
    setErrors({})
    setBusy(false)
    setAccepted(false)
    go(0)
  }

  const last = step === steps.length - 1

  return (
    <form className={`${styles.form} fn-card`} noValidate onSubmit={onSubmit}>
      <p className={styles.intro}>
        ظرفیت قابل رزرو را معرفی می‌کنی و رزرو، ورود و تسویه را یک‌جا می‌بینی. نمایه عمومی بعد از بررسی منتشر می‌شود.
      </p>

      <ol className={styles.progress} aria-label="مراحل درخواست همکاری">
        {steps.map((item, index) => {
          const done = index < step || (last && index === step)
          return (
          <li key={item.label} className={styles.progressItem} data-state={done ? "done" : index === step ? "current" : "upcoming"}>
            <span className={styles.marker} aria-hidden="true">
              {done ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 4 4L19 6" />
                </svg>
              ) : (
                new Intl.NumberFormat("fa-IR").format(index + 1)
              )}
            </span>
            <span className={styles.progressLabel}>{item.label}</span>
            {index < steps.length - 1 ? <span className={styles.connector} aria-hidden="true" /> : null}
          </li>
          )
        })}
      </ol>

      <div className={styles.stage} data-direction={direction} key={step}>
        {step === 0 ? (
          <fieldset className={styles.fields}>
            <legend className={styles.legend}>مشخصات باشگاه</legend>
            <Field id={`${id}-gym`} label={labels.gym} value={values.gym} error={errors.gym} onChange={(value) => update("gym", value)} autoComplete="organization" />
            <Field id={`${id}-city`} label={labels.city} value={values.city} error={errors.city} onChange={(value) => update("city", value)} />
          </fieldset>
        ) : null}

        {step === 1 ? (
          <fieldset className={styles.fields}>
            <legend className={styles.legend}>مسئول هماهنگی</legend>
            <Field id={`${id}-person`} label={labels.person} value={values.person} error={errors.person} onChange={(value) => update("person", value)} autoComplete="name" />
            <Field id={`${id}-mobile`} label={labels.mobile} value={values.mobile} error={errors.mobile} onChange={(value) => update("mobile", value)} type="tel" autoComplete="tel" />
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset className={styles.fields}>
            <legend className={styles.legend}>پیام</legend>
            <Field id={`${id}-message`} label={labels.message} value={values.message} onChange={(value) => update("message", value)} multiline hint="اختیاری" />
          </fieldset>
        ) : null}

        {step === 3 ? (
          <div className={styles.review} aria-label="بازبینی درخواست">
            <Review title="باشگاه" rows={[["نام باشگاه", values.gym], ["شهر", values.city]]} />
            <Review title="مسئول" rows={[["نام مسئول", values.person], ["موبایل", values.mobile]]} />
            <Review title="پیام" rows={[["متن", values.message.trim() || "بدون پیام"]]} />
            <label className={styles.accept}>
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
              />
              این اطلاعات را می‌پذیرم
            </label>
          </div>
        ) : null}

        {step === 4 ? (
          <div className={styles.success}>
            <span className={styles.successMark} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12 4 4L19 6" />
              </svg>
            </span>
            <h2>درخواست ثبت شد</h2>
            <p>این فرم در نسخه نمایشی ارسال نمی‌شود.</p>
            <button type="button" className={styles.next} onClick={reset}>درخواست تازه</button>
          </div>
        ) : null}
      </div>

      {last ? null : (
        <div className={styles.actions}>
          <button type="button" className={styles.prev} onClick={() => go(step - 1)} disabled={step === 0}>
            مرحله قبل
          </button>
          {step === 3 ? (
            <button type="submit" className={styles.next} disabled={busy || !accepted}>
              {busy ? "در حال تأیید…" : "تأیید"}
            </button>
          ) : (
            <button type="button" className={styles.next} onClick={onNext}>
              مرحله بعد
            </button>
          )}
        </div>
      )}
    </form>
  )
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
  multiline,
  hint,
}: {
  id: string
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
  type?: "text" | "tel"
  autoComplete?: string
  multiline?: boolean
  hint?: string
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label}
        {hint ? <span className={styles.hint}>{hint}</span> : null}
      </label>
      {multiline ? (
        <textarea id={id} name={id} rows={4} value={value} aria-invalid={error ? true : undefined} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          dir={type === "tel" ? "ltr" : undefined}
          inputMode={type === "tel" ? "numeric" : undefined}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  )
}

function Review({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <section className={styles.reviewCard}>
      <h3>{title}</h3>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
