"use client"

import Aurora from "@/components/Aurora"

const stops = ["#170B93", "#C3DBFC", "#E36F2E"]

export function HeroAurora() {
  return (
    <div className="absolute inset-0" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <Aurora colorStops={stops} speed={0.28} amplitude={0.58} blend={0.36} lightMode={false} />
    </div>
  )
}
