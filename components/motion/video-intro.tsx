"use client"

import { useEffect, useRef, useState } from "react"

const SRC = "/video/fitnet-preloader.webm"

function releasePage() {
  const release = (window as Window & { __fnIntroRelease?: () => void }).__fnIntroRelease
  if (release) release()
  else {
    document.documentElement.classList.remove("fn-hold", "fn-preloading")
    document.documentElement.classList.add("fn-reveal")
    const page = document.getElementById("fn-page")
    if (page) page.inert = false
  }
}

function alphaKept(video: HTMLVideoElement) {
  const canvas = document.createElement("canvas")
  canvas.width = 32
  canvas.height = 18
  const context = canvas.getContext("2d", { willReadFrequently: true })
  if (!context) return true
  try {
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 250) return true
    }
    return false
  } catch {
    return true
  }
}

export function VideoIntro() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    if (root.classList.contains("fn-intro-skip")) {
      releasePage()
      const hide = window.setTimeout(() => setActive(false), 0)
      return () => window.clearTimeout(hide)
    }

    const page = document.getElementById("fn-page")
    if (page) page.inert = true
    root.classList.add("fn-hold", "fn-preloading")

    const owner = {}
    ;(window as Window & { __fnIntroOwner?: object }).__fnIntroOwner = owner
    let alive = true
    const deadline = (window as Window & { __fnIntroDeadline?: number }).__fnIntroDeadline
    const left = Math.max(0, (deadline && deadline > Date.now() ? deadline : Date.now() + 5000) - Date.now())
    const timer = window.setTimeout(() => {
      if (!alive) return
      alive = false
      releasePage()
      setActive(false)
    }, left)

    const video = videoRef.current
    let probe: HTMLVideoElement | null = null
    const drop = () => {
      if (!alive) return
      alive = false
      window.clearTimeout(timer)
      if (video) {
        video.pause()
        video.removeAttribute("src")
        video.load()
      }
      releasePage()
      setActive(false)
    }

    if (video) {
      const onFrame = () => {
        document.getElementById("fitnet-intro")?.classList.add("is-live")
        root.classList.remove("fn-hold")
      }
      const onReady = () => {
        if (!alive) return
        if (video.ended) {
          drop()
          return
        }
        const play = video.play()
        if (play && typeof play.then === "function") play.catch(drop)
        if (video.currentTime > 0.05) onFrame()
        else if ("requestVideoFrameCallback" in video) video.requestVideoFrameCallback(() => onFrame())
        else onFrame()
      }

      video.addEventListener("error", drop)
      video.addEventListener("ended", drop)
      if (video.readyState >= 2) onReady()
      else video.addEventListener("loadeddata", onReady, { once: true })

      probe = document.createElement("video")
      probe.muted = true
      probe.playsInline = true
      probe.preload = "auto"
      probe.src = SRC
      const failAlpha = () => {
        if (probe && probe.readyState >= 2 && !alphaKept(probe)) drop()
        probe?.pause()
        probe?.removeAttribute("src")
        probe?.load()
      }
      probe.addEventListener(
        "loadedmetadata",
        () => {
          if (!probe || !Number.isFinite(probe.duration) || probe.duration < 0.2) return
          const target = Math.max(0, probe.duration - 0.12)
          probe.addEventListener("seeked", failAlpha, { once: true })
          if (Math.abs(probe.currentTime - target) < 0.01) failAlpha()
          else probe.currentTime = target
        },
        { once: true },
      )
    }

    return () => {
      alive = false
      window.clearTimeout(timer)
      video?.removeEventListener("error", drop)
      video?.removeEventListener("ended", drop)
      if (probe) {
        probe.pause()
        probe.removeAttribute("src")
        probe.load()
      }
      const node = document.getElementById("fn-page")
      if (node) node.inert = false
      window.setTimeout(() => {
        const current = (window as Window & { __fnIntroOwner?: object }).__fnIntroOwner
        if (current === owner) releasePage()
      }, 0)
    }
  }, [])

  if (!active) return null

  return (
    <div id="fitnet-intro" aria-hidden="true">
      <video ref={videoRef} src={SRC} muted playsInline autoPlay preload="auto" />
    </div>
  )
}
