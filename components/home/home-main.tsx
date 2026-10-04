import { EventsIntro } from "@/components/home/events-intro"
import { FinalCta } from "@/components/home/final-cta"
import FitnetJourney from "@/components/home/FitnetJourney"
import { HeroDownloadActions } from "@/components/home/hero-download-actions"
import { HomeFaq } from "@/components/home/home-faq"
import { HomeFooter } from "@/components/home/home-footer"
import { PartnershipBlock } from "@/components/home/partnership-block"
import { ProductPanels } from "@/components/home/product-panels"
import { HeroAurora } from "@/components/motion/hero-aurora"

export function HomeMain() {
  return (
    <>
      <section className="aurum-hero relative flex flex-col gs-hero fn-on-indigo">
        <div className="absolute inset-0" aria-hidden="true">
          <HeroAurora />
          <div className="hero-scrim absolute inset-0" />
        </div>
        <div className="hero-stage fn-home-shell relative z-10">
          <div className="hero-copy">
            <h1 className="au-title" data-fn-enter="title">
              یک حساب، برای تجربه‌های ورزشی بیشتر
            </h1>
            <HeroDownloadActions />
          </div>
        </div>
      </section>

      <FitnetJourney />
      <ProductPanels />
      <EventsIntro />
      <PartnershipBlock />
      <HomeFaq />
      <FinalCta />
      <HomeFooter />
    </>
  )
}
