import Link from "next/link"

export function Logo({ lockup = false }: { lockup?: boolean }) {
  return (
    <Link href="/" className="fn-brand" aria-label="فیت‌نت، صفحه اصلی">
      <span className="fn-logo-frame">
        <img className="fn-logo" src="/brand/logo-reverse.png" width={1124} height={1078} alt="" />
      </span>
      {lockup ? (
        <span className="fn-brand-lockup">
          <span className="brand-latin fn-brand-name" dir="ltr">FITNET</span>
          <span className="fn-brand-sub">مارکت‌پلیس ورزشی</span>
        </span>
      ) : (
        <span className="brand-latin fn-brand-name" dir="ltr">FITNET</span>
      )}
    </Link>
  )
}
