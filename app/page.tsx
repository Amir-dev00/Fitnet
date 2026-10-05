import { HomeHeader } from "@/app/components/home/home-header"
import { HomeMain } from "@/app/components/home/home-main"
import { VideoIntro } from "@/app/components/home/video-intro"
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
