"use client"

import Aurora from "@/components/Aurora"

const stops = ["#170B93", "#C3DBFC", "#E36F2E"]

export function HeroAurora() {
  return (
    <div className="absolute inset-0" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <Aurora colorStops={stops} speed={0.35} amplitude={0.75} blend={0.45} lightMode={false} />
    </div>
  )
}
