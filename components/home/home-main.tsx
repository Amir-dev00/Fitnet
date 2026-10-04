import { EventsIntro } from "@/components/home/events-intro"
import { FinalCta } from "@/components/home/final-cta"
import FitnetDiscovery from "@/components/home/discovery/FitnetDiscovery"
import FitnetJourney from "@/components/home/FitnetJourney"
import { HeroDownloadActions } from "@/components/home/hero-download-actions"
import { HomeFaq } from "@/components/home/home-faq"
import { HomeFooter } from "@/components/home/home-footer"
import { PartnershipBlock } from "@/components/home/partnership-block"
import { ProductPanels } from "@/components/home/product-panels"

export function HomeMain() {
  return (
    <>
      <section className="aurum-hero gs-hero fn-on-indigo">
        <picture className="hero-photo">
          <source media="(min-width: 1024px)" srcSet="/images/hero/desktop.webp" type="image/webp" />
          <img
            src="/images/hero/mobile.webp"
            alt=""
            width={1086}
            height={1448}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="hero-stage fn-home-shell">
          <div className="hero-copy">
            <h1 className="au-title">
              یک حساب، برای تجربه‌های ورزشی بیشتر
            </h1>
            <HeroDownloadActions enter={false} />
          </div>
        </div>
      </section>

      <FitnetJourney />
      <FitnetDiscovery />
      <ProductPanels />
      <EventsIntro />
      <PartnershipBlock />
      <HomeFaq />
      <FinalCta />
      <HomeFooter />
    </>
  )
}
