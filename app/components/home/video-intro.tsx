"use client"

import { useEffect, useRef, useState } from "react"

const SRC = "/video/fitnet-preloader.webm"
const INTRO_CAP_MS = 5000

type IntroWindow = Window & {
  __fnIntroRelease?: () => void
  __fnIntroOwner?: object
  __fnIntroDeadline?: number
}

function releasePage() {
  const release = (window as IntroWindow).__fnIntroRelease
  if (release) {
    release()
    return
  }
  const root = document.documentElement
  root.classList.remove("fn-hold", "fn-preloading")
  root.classList.add("fn-reveal")
  root.dataset.fnIntroReleased = "1"
  const page = document.getElementById("fn-page")
  if (page) page.inert = false
}

function introFinished() {
  const root = document.documentElement
  return root.dataset.fnIntroReleased === "1" || root.classList.contains("fn-intro-skip")
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
    const win = window as IntroWindow
    let alive = true
    const timers = new Set<number>()
    const detach: Array<() => void> = []
    let probe: HTMLVideoElement | null = null

    const clearTimers = () => {
      timers.forEach((id) => window.clearTimeout(id))
      timers.clear()
    }

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id)
        if (alive) fn()
      }, ms)
      timers.add(id)
      return id
    }

    const finish = () => {
      if (!alive) return
      alive = false
      clearTimers()
      const video = videoRef.current
      if (video) {
        video.pause()
        video.removeAttribute("src")
        video.load()
      }
      releasePage()
      setActive(false)
    }

    if (introFinished()) {
      releasePage()
      later(() => setActive(false), 0)
      return () => {
        alive = false
        clearTimers()
      }
    }

    const existingDeadline = win.__fnIntroDeadline
    if (typeof existingDeadline === "number" && existingDeadline <= Date.now()) {
      finish()
      return () => {
        alive = false
        clearTimers()
      }
    }

    const page = document.getElementById("fn-page")
    if (page) page.inert = true
    root.classList.add("fn-hold", "fn-preloading")

    const owner = {}
    win.__fnIntroOwner = owner
    if (typeof win.__fnIntroDeadline !== "number") win.__fnIntroDeadline = Date.now() + INTRO_CAP_MS
    later(finish, Math.max(0, win.__fnIntroDeadline - Date.now()))

    const video = videoRef.current
    if (video) {
      const onFrame = () => {
        if (!alive) return
        document.getElementById("fitnet-intro")?.classList.add("is-live")
        root.classList.remove("fn-hold")
      }
      const armFrame = () => {
        if (video.currentTime > 0.05) onFrame()
        else if ("requestVideoFrameCallback" in video) {
          video.requestVideoFrameCallback(() => onFrame())
          later(onFrame, 400)
        } else onFrame()
      }
      const onReady = () => {
        if (!alive) return
        const duration = video.duration
        const playedOut =
          video.ended || (Number.isFinite(duration) && duration > 0 && video.currentTime >= duration - 0.05)
        if (playedOut) {
          finish()
          return
        }
        const play = video.play()
        if (play && typeof play.then === "function") play.catch(() => finish())
        armFrame()
      }

      const onError = () => finish()
      const onEnded = () => finish()
      video.addEventListener("error", onError)
      video.addEventListener("ended", onEnded)
      detach.push(() => {
        video.removeEventListener("error", onError)
        video.removeEventListener("ended", onEnded)
      })

      if (video.readyState >= 2) onReady()
      else {
        const onData = () => onReady()
        video.addEventListener("loadeddata", onData, { once: true })
        detach.push(() => video.removeEventListener("loadeddata", onData))
        later(() => {
          if (video.readyState < 2) finish()
        }, 2500)
      }
    }

    if (alive && video) {
      probe = document.createElement("video")
      probe.muted = true
      probe.playsInline = true
      probe.preload = "auto"
      probe.src = SRC
      const failAlpha = () => {
        if (probe && probe.readyState >= 2 && !alphaKept(probe)) finish()
        probe?.pause()
        probe?.removeAttribute("src")
        probe?.load()
      }
      const onMeta = () => {
        if (!alive || !probe || !Number.isFinite(probe.duration) || probe.duration < 0.2) return
        const target = Math.max(0, probe.duration - 0.12)
        probe.addEventListener("seeked", failAlpha, { once: true })
        if (Math.abs(probe.currentTime - target) < 0.01) failAlpha()
        else probe.currentTime = target
      }
      probe.addEventListener("loadedmetadata", onMeta, { once: true })
    }

    return () => {
      alive = false
      clearTimers()
      detach.forEach((fn) => fn())
      if (probe) {
        probe.pause()
        probe.removeAttribute("src")
        probe.load()
      }
      const node = document.getElementById("fn-page")
      if (node) node.inert = false
      window.setTimeout(() => {
        if (win.__fnIntroOwner === owner) releasePage()
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
