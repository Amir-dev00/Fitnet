import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import Script from "next/script"

import "./globals.css"
import { introBoot } from "@/lib/intro-boot"

const estedad = localFont({
  src: "../public/fonts/Estedad-Variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-estedad",
})

const oswald = localFont({
  src: [
    { path: "../public/fonts/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvgUE.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/TK3_WkUHHAIjg75cFRf3bXL8LICs1xZogUE.ttf", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-oswald-face",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://fitnet.ir"),
  title: "فیت‌نت",
  description: "فیت‌نت یک پلتفرم دسترسی به باشگاه‌های همکار و رویدادهای ورزشی است.",
  icons: {
    icon: [{ url: "/brand/Fitnet-Primary-Logo.svg", type: "image/svg+xml" }],
    apple: "/brand/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#170B93",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className={`fn-alpine-ready antialiased ${estedad.variable} ${oswald.variable}`}>
      <body>
        <noscript>
          <style>{`#fitnet-intro{display:none!important;pointer-events:none!important}html.fn-hold body{visibility:visible!important}html.fn-preloading{overflow:visible!important}`}</style>
        </noscript>
        <Script id="fitnet-intro-boot" strategy="beforeInteractive">
          {introBoot}
        </Script>
        {children}
      </body>
    </html>
  )
}
