import { ContactScreen } from "@/components/contact/contact-screen"
import { pageMeta } from "@/lib/seo"

export const metadata = pageMeta({
  title: "ارتباط و همکاری | فیت‌نت",
  description: "درخواست دسترسی زودهنگام، همکاری باشگاه یا برگزاری رویداد در فیت‌نت.",
  path: "/contact/",
})

export default function ContactPage() {
  return <ContactScreen />
}
