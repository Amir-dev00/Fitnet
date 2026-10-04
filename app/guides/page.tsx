import { GuideBrowser } from "@/components/guides/guide-browser"
import { PageShell } from "@/components/site/page-shell"
import { pageMeta } from "@/lib/seo"

export const metadata = pageMeta({
  title: "راهنمای فیت‌نت",
  description: "راهنمای شروع، اعتبار، رزرو، لغو، رویداد و همکاری باشگاه در فیت‌نت.",
  path: "/guides/",
})

export default function GuidesPage() {
  return (
    <PageShell
      footer="guides"
      nav={[
        { href: "/about/", label: "درباره" },
        { href: "/plans/", label: "پلن‌ها" },
        { href: "/contact/", label: "ارتباط" },
      ]}
    >
      <p className="fn-kicker">راهنمای فیت‌نت</p>
      <h1>آنچه قبل از شروع لازم است.</h1>
      <p className="fn-lead">شش راهنمای محصول. جستجو و دسته‌ها فقط همین فهرست را نشان می‌دهند.</p>
      <GuideBrowser />
    </PageShell>
  )
}
