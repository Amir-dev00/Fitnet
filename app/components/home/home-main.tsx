import FitnetPartners from "@/app/components/home/FitnetPartners"

import FitnetReferral from "@/app/components/home/FitnetReferral"

import FitnetEvents from "@/app/components/home/FitnetEvents"

import { FinalCta } from "@/app/components/home/final-cta"

import FitnetDiscovery from "@/app/components/home/discovery/FitnetDiscovery"

import FitnetJourney from "@/app/components/home/FitnetJourney"

import { HeroDownloadActions } from "@/app/components/home/hero-download-actions"

import { HomeFaq } from "@/app/components/home/home-faq"

import { HomeFooter } from "@/app/components/home/home-footer"

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

      <FitnetEvents />

      <FitnetReferral />

      <FitnetPartners />

      <HomeFaq />

      <FinalCta />

      <HomeFooter />

    </>

  )

}


