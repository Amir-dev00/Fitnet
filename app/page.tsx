import { HomeMain } from "@/components/home/home-main"
import { VideoIntro } from "@/components/motion/video-intro"
import { HomeHeader } from "@/components/site/home-header"
import { pageMeta } from "@/lib/seo"

export const metadata = pageMeta({
  title: "فیت‌نت | باشگاه و رویداد ورزشی با یک اعتبار",
  description: "فیت‌نت یک پلتفرم دسترسی به باشگاه‌های همکار و رویدادهای ورزشی است. باشگاه پیدا کن، اعتبار بگیر، رزرو کن و با QR وارد شو.",
  path: "/",
})

export default function Page() {
  return (
    <>
      <VideoIntro />
      <div id="fn-page">
        <HomeHeader />
        <HomeMain />
      </div>
    </>
  )
}
