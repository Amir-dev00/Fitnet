"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import s from "./FitnetJourney.module.css";

const stages = [
  { label: "اعتبار بگیر", title: "اعتبارت را آماده کن", description: "پلن مناسب خودت را انتخاب کن و اعتبارت را در کیف پول فیت‌نت ببین." },
  { label: "انتخاب کن", title: "انتخاب مناسب تو، همین نزدیکی", description: "باشگاه‌های همکار و رویدادهای ورزشی را بررسی کن و گزینه دلخواهت را پیدا کن." },
  { label: "رزرو کن", title: "زمانت را انتخاب کن", description: "زمان ورود و اعتبار موردنیاز را ببین و رزروت را تأیید کن." },
  { label: "وارد شو", title: "آماده شروعی", description: "QR یا کد رزرو را هنگام ورود نشان بده و تمرینت را شروع کن." },
] as const;
const numbers = ["۱", "۲", "۳", "۴"];
const STAGE_MS = 4500;
const EARLY_CHECK_MS = 150;
const COMPLETED_HOLD_MS = 600;
const RESTART_MS = 400;
const SEGMENT_COUNT = stages.length - 1;
const LAST_STAGE = stages.length - 1;
const ALL_MARKS = (1 << stages.length) - 1;

type Phase = "playing" | "completed" | "restarting";

type Playback = {
  generation: number;
  phase: Phase;
  remaining: number;
  startedAt: number | null;
  raf: number | null;
};

function phaseDuration(phase: Phase) {
  if (phase === "completed") return COMPLETED_HOLD_MS;
  if (phase === "restarting") return RESTART_MS;
  return STAGE_MS;
}

function marksBefore(stage: number) {
  if (stage <= 0) return 0;
  return (1 << stage) - 1;
}

function hasMark(mask: number, index: number) {
  return (mask & (1 << index)) !== 0;
}

function stopPlaybackClock(pb: Playback) {
  if (pb.raf !== null) {
    cancelAnimationFrame(pb.raf);
    pb.raf = null;
  }
  if (pb.startedAt !== null) {
    pb.remaining = Math.max(0, pb.remaining - (performance.now() - pb.startedAt));
    pb.startedAt = null;
  }
}

function applySegmentFills(nodes: Array<HTMLElement | null>, active: number, progress: number, allComplete = false) {
  const ratio = Math.min(1, Math.max(0, progress));
  for (let i = 0; i < SEGMENT_COUNT; i++) {
    const node = nodes[i];
    if (!node) continue;
    let fill = 0;
    if (allComplete || active >= SEGMENT_COUNT) fill = 1;
    else if (i < active) fill = 1;
    else if (i === active) fill = ratio;
    node.style.setProperty("--segment-progress", String(fill));
  }
}

function Icon({ kind }: { kind: "check" | "wallet" | "play" | "pause" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === "check" ? <path d="m5 12 4 4L19 6" />
        : kind === "wallet" ? <><path d="M4 6h15v14H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12v2" /><path d="M19 10h-6v6h6M15.5 13h.01" /></>
        : kind === "play" ? <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />
        : <><path d="M8 5v14M16 5v14" /></>}
    </svg>
  );
}

function Preview({ stage }: { stage: number }) {
  return (
    <div className={s.preview} aria-hidden="true">
      <div className={s.product}>
        <div className={s.productHeader}><strong>فیت‌نت<span /></strong><span className={s.badge}>پیش‌نمایش</span></div>
        {stage === 0 && <div className={s.wallet}>
          <div className={s.walletTop}><span className={s.iconBox}><Icon kind="wallet" /></span><span>کیف پول تو<small>اعتبار برای تجربه‌های تازه</small></span></div>
          <div className={s.credit}><small>خلاصه اعتبار</small><strong>اعتبار پلن انتخابی</strong><span className={s.creditTrack}><i /></span></div>
          <div className={s.creditArrival}><span className={s.smallCheck}><Icon kind="check" /></span>اعتبار به کیف پول اضافه شد</div>
        </div>}
        {stage === 1 && <div className={s.discovery}>
          <div className={s.map}>
            <svg className={s.mapDrawing} viewBox="0 0 320 170" preserveAspectRatio="none" aria-hidden="true">
              <rect width="320" height="170" fill="#EDF4FE" />
              <path d="M0 30 320 135M30 0 160 170M270 0 170 170M0 130 320 40" stroke="white" strokeWidth="17" />
              <path d="M0 30 320 135M270 0 170 170" stroke="#C3DBFC" strokeWidth="2" />
              <rect x="35" y="68" width="46" height="28" rx="10" fill="#D8E8FC" /><rect x="233" y="104" width="43" height="34" rx="12" fill="#D8E8FC" />
            </svg>
            <span className={`${s.pin} ${s.pinOne}`} /><span className={`${s.pin} ${s.pinTwo}`} /><span className={`${s.pin} ${s.pinSelected}`}><i /></span>
          </div>
          <div className={s.place}><span className={s.placeArt}>ف</span><div><strong>فضای ورزشی منتخب</strong><small>نمونه‌ای از یک انتخاب نزدیک</small></div><span className={s.smallCheck}><Icon kind="check" /></span></div>
        </div>}
        {stage === 2 && <div className={s.reservation}>
          <div className={s.previewTitle}>یک زمان برای خودت</div>
          <div className={s.days}>{["روز اول", "روز دوم", "روز سوم"].map((day, i) => <span key={day} className={i === 1 ? s.selectedDay : undefined}><small>{day}</small><strong>{["۱", "۲", "۳"][i]}</strong></span>)}</div>
          <div className={s.summary}><span>زمان و اعتبار</span><strong>طبق انتخاب تو</strong></div>
          <div className={s.reservationSuccess}><Icon kind="check" /><span>نمایش تأیید رزرو</span></div>
        </div>}
        {stage === 3 && <div className={s.pass}>
          <div className={s.previewTitle}>کارت ورود فیت‌نت</div>
          <div className={s.qr}>
            <svg viewBox="0 0 120 120" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 8h30v30H8Zm7 7v16h16V15ZM82 8h30v30H82Zm7 7v16h16V15ZM8 82h30v30H8Zm7 7v16h16V89Z" />
              <path d="M20 20h6v6h-6M94 20h6v6h-6M20 94h6v6h-6M48 8h8v12h-8M64 16h8v18h-8M46 30h10v8H46M8 48h15v8H8M30 60h8v12h-8M84 48h10v8H84M104 58h8v16h-8M48 86h8v24h-8M64 100h10v12H64M82 84h12v8H82M102 96h10v16h-10M66 78h8v12h-8" />
            </svg>
            <span className={s.qrLabel}>نمونه</span><span className={s.scan} />
          </div>
          <small className={s.qrNote}>طرح نمایشی؛ قابل اسکن نیست</small>
          <div className={s.entrySuccess}><Icon kind="check" /><span>آماده ورود</span></div>
        </div>}
        <div className={s.productFooter}>نمایش روند استفاده · اطلاعات واقعی نیست</div>
      </div>
    </div>
  );
}

function Content({ stage }: { stage: number }) {
  return <div className={s.content}>
    <div className={s.copy}><span className={s.eyebrow}>قدم {numbers[stage]} از ۴</span><h3>{stages[stage].title}</h3><p>{stages[stage].description}</p></div>
    <Preview stage={stage} />
  </div>;
}

type JourneyState = {
  active: number;
  outgoing: number | null;
  direction: number;
  revision: number;
  phase: Phase;
  settlePulse: boolean;
  /** Bitmask of stages that have crossed the early-completion threshold. */
  completedMask: number;
};

export default function FitnetJourney() {
  const id = useId();
  const [state, setState] = useState<JourneyState>({
    active: 0,
    outgoing: null,
    direction: 1,
    revision: 0,
    phase: "playing",
    settlePulse: false,
    completedMask: 0,
  });
  const [playNonce, setPlayNonce] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [docVisible, setDocVisible] = useState(true);
  const [focusInside, setFocusInside] = useState(false);

  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const strip = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const segmentRefs = useRef<Array<HTMLElement | null>>([null, null, null]);
  const activeRef = useRef(0);
  const phaseRef = useRef<Phase>("playing");
  const completedMaskRef = useRef(0);
  const focusInsideRef = useRef(false);
  const userPausedRef = useRef(false);
  const playback = useRef<Playback>({
    generation: 0,
    phase: "playing",
    remaining: STAGE_MS,
    startedAt: null,
    raf: null,
  });

  const { active, outgoing, direction, revision, phase, settlePulse, completedMask } = state;
  const autoplayEligible = !reduceMotion && !userPaused && inView && docVisible && !focusInside;

  const paintSegments = useCallback((stageIndex: number, progress: number, allComplete = false) => {
    applySegmentFills(segmentRefs.current, stageIndex, progress, allComplete);
  }, []);

  const beginPhase = useCallback((nextPhase: Phase, remaining = phaseDuration(nextPhase)) => {
    const pb = playback.current;
    pb.generation += 1;
    stopPlaybackClock(pb);
    pb.phase = nextPhase;
    pb.remaining = remaining;
    pb.startedAt = null;
    phaseRef.current = nextPhase;
    setPlayNonce(value => value + 1);
  }, []);

  const select = useCallback((next: number, options: { focusTab?: boolean } = {}) => {
    if (next < 0 || next >= stages.length) return;
    const { focusTab = false } = options;

    const pb = playback.current;
    pb.generation += 1;
    stopPlaybackClock(pb);
    pb.phase = "playing";
    pb.remaining = STAGE_MS;
    pb.startedAt = null;
    phaseRef.current = "playing";

    applySegmentFills(segmentRefs.current, next, 0);
    activeRef.current = next;
    completedMaskRef.current = marksBefore(next);
    setPlayNonce(value => value + 1);
    setState(current => {
      if (current.active === next && current.phase === "playing") {
        return {
          ...current,
          settlePulse: false,
          phase: "playing",
          completedMask: completedMaskRef.current,
        };
      }
      return {
        active: next,
        outgoing: current.active === next ? current.outgoing : current.active,
        direction: next > current.active ? 1 : next < current.active ? -1 : current.direction,
        revision: current.active === next ? current.revision : current.revision + 1,
        phase: "playing",
        settlePulse: false,
        completedMask: completedMaskRef.current,
      };
    });

    if (focusTab) tabs.current[next]?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    activeRef.current = active;
    phaseRef.current = phase;
    if (phase === "completed") {
      paintSegments(LAST_STAGE, 1, true);
    } else if (phase === "playing") {
      // Keep fills stable while a stage is mid-progress; only snap on active changes from select/restart finish.
      if (playback.current.startedAt === null && playback.current.raf === null) {
        paintSegments(active, 0);
      }
    }
  }, [active, phase, paintSegments]);

  useEffect(() => {
    userPausedRef.current = userPaused;
  }, [userPaused]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(motionQuery.matches);
    sync();
    motionQuery.addEventListener("change", sync);
    return () => motionQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onVisibility = () => setDocVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.35),
      { threshold: [0, 0.35, 0.6, 1] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (outgoing === null) return;
    const timer = window.setTimeout(() => {
      setState(current => current.revision === revision ? { ...current, outgoing: null } : current);
    }, 360);
    return () => window.clearTimeout(timer);
  }, [outgoing, revision]);

  useEffect(() => {
    const container = strip.current;
    const tab = tabs.current[active];
    if (!container || !tab) return;
    const outer = container.getBoundingClientRect();
    const inner = tab.getBoundingClientRect();
    const delta = inner.left < outer.left ? inner.left - outer.left : inner.right > outer.right ? inner.right - outer.right : 0;
    if (delta) container.scrollLeft += delta;
  }, [active]);

  useEffect(() => {
    if (!settlePulse) return;
    const timer = window.setTimeout(() => {
      setState(current => current.settlePulse ? { ...current, settlePulse: false } : current);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [settlePulse]);

  useEffect(() => {
    const pb = playback.current;

    if (reduceMotion || !autoplayEligible || focusInsideRef.current) {
      stopPlaybackClock(pb);
      if (reduceMotion) {
        phaseRef.current = "playing";
        pb.phase = "playing";
        paintSegments(activeRef.current, 0);
      }
      return () => stopPlaybackClock(pb);
    }

    if (pb.raf !== null || pb.startedAt !== null) {
      return () => stopPlaybackClock(pb);
    }

    const activePhase = pb.phase;
    const duration = phaseDuration(activePhase);
    if (pb.remaining <= 0) pb.remaining = duration;

    const generation = pb.generation;
    const stageAtStart = activeRef.current;
    pb.startedAt = performance.now();
    const startedAt = pb.startedAt;
    const budget = pb.remaining;

    const tick = (now: number) => {
      if (playback.current.generation !== generation) return;

      if (focusInsideRef.current || userPausedRef.current || document.visibilityState !== "visible") {
        stopPlaybackClock(pb);
        // Keep React eligibility in sync so resume can restart the controller.
        if (focusInsideRef.current) setFocusInside(true);
        if (userPausedRef.current) setUserPaused(true);
        if (document.visibilityState !== "visible") setDocVisible(false);
        return;
      }

      const elapsed = now - startedAt;
      const consumed = duration - budget + elapsed;

      if (activePhase === "playing" && stageAtStart < SEGMENT_COUNT) {
        paintSegments(stageAtStart, Math.min(1, consumed / duration));
      } else if (activePhase === "playing") {
        paintSegments(stageAtStart, 1, true);
      } else if (activePhase === "completed") {
        paintSegments(LAST_STAGE, 1, true);
      }

      // Early checkmark: D − 150ms, while the stage (and remaining connector fill) stay active.
      if (activePhase === "playing" && consumed >= duration - EARLY_CHECK_MS) {
        const bit = 1 << stageAtStart;
        if ((completedMaskRef.current & bit) === 0) {
          flushSync(() => {
            completedMaskRef.current |= bit;
            setState(current => (
              current.completedMask === completedMaskRef.current
                ? current
                : { ...current, completedMask: completedMaskRef.current }
            ));
          });
        }
      }

      if (elapsed >= budget) {
        pb.raf = null;
        pb.startedAt = null;

        if (activePhase === "playing") {
          const current = activeRef.current;
          completedMaskRef.current |= (1 << current);

          if (current < LAST_STAGE) {
            pb.remaining = STAGE_MS;
            paintSegments(current, 1);
            const next = current + 1;
            flushSync(() => {
              applySegmentFills(segmentRefs.current, next, 0);
              activeRef.current = next;
              phaseRef.current = "playing";
              pb.phase = "playing";
              pb.generation += 1;
              setPlayNonce(value => value + 1);
              setState(state => ({
                active: next,
                outgoing: current,
                direction: 1,
                revision: state.revision + 1,
                phase: "playing",
                settlePulse: false,
                completedMask: completedMaskRef.current,
              }));
            });
            return;
          }

          // Stage 4 finished: all markers complete, then hold.
          paintSegments(LAST_STAGE, 1, true);
          completedMaskRef.current = ALL_MARKS;
          flushSync(() => {
            beginPhase("completed");
            activeRef.current = LAST_STAGE;
            setState(state => ({
              ...state,
              active: LAST_STAGE,
              outgoing: null,
              phase: "completed",
              settlePulse: false,
              completedMask: ALL_MARKS,
            }));
          });
          return;
        }

        if (activePhase === "completed") {
          // Restart wave: soft crossfade to stage 1 while nav fades completed chrome.
          flushSync(() => {
            beginPhase("restarting");
            activeRef.current = 0;
            setState(state => ({
              active: 0,
              outgoing: LAST_STAGE,
              direction: 0,
              revision: state.revision + 1,
              phase: "restarting",
              settlePulse: false,
              completedMask: ALL_MARKS,
            }));
          });
          return;
        }

        // Restart finished: clear early-completion state and begin a fresh stage-1 cycle.
        paintSegments(0, 0);
        completedMaskRef.current = 0;
        flushSync(() => {
          beginPhase("playing");
          activeRef.current = 0;
          setState(state => ({
            ...state,
            active: 0,
            outgoing: null,
            direction: 0,
            phase: "playing",
            settlePulse: true,
            completedMask: 0,
          }));
        });
        return;
      }

      pb.raf = requestAnimationFrame(tick);
    };

    pb.raf = requestAnimationFrame(tick);
    return () => stopPlaybackClock(pb);
  }, [autoplayEligible, reduceMotion, active, revision, playNonce, phase, beginPhase, paintSegments]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowLeft": next = (index + 1) % stages.length; break;
      case "ArrowRight": next = (index + stages.length - 1) % stages.length; break;
      case "Home": next = 0; break;
      case "End": next = stages.length - 1; break;
      default: return;
    }
    event.preventDefault();
    select(next, { focusTab: true });
  }

  const enterX = direction === 0 ? "-6px" : `${-direction * 14}px`;
  const exitX = direction === 0 ? "6px" : `${direction * 14}px`;
  const motionStyle = { "--enter-x": enterX, "--exit-x": exitX } as CSSProperties;
  const journeyComplete = phase === "completed" || phase === "restarting";

  function tabStatus(index: number) {
    if (journeyComplete) return "complete";
    if (index === active) return "active";
    if (hasMark(completedMask, index)) return "complete";
    return "upcoming";
  }

  function showCheck(index: number) {
    if (journeyComplete) return true;
    return hasMark(completedMask, index);
  }

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      dir="rtl"
      className={s.section}
      aria-labelledby={`${id}-title`}
      onFocusCapture={event => {
        const target = event.target as HTMLElement | null;
        if (target?.closest(`.${s.playbackToggle}`)) return;
        focusInsideRef.current = true;
        setFocusInside(true);
      }}
      onBlurCapture={event => {
        const next = event.relatedTarget as Node | null;
        if (!sectionRef.current?.contains(next)) {
          focusInsideRef.current = false;
          setFocusInside(false);
          return;
        }
        if ((next as HTMLElement | null)?.closest?.(`.${s.playbackToggle}`)) {
          focusInsideRef.current = false;
          setFocusInside(false);
        }
      }}
    >
      <div className={s.container}>
        <header className={s.header}>
          <div className={s.headerTop}>
            <span className={s.kicker}>مسیر تو در فیت‌نت</span>
            {!reduceMotion && (
              <button
                type="button"
                className={s.playbackToggle}
                aria-pressed={userPaused}
                aria-label={userPaused ? "ادامه پخش خودکار" : "توقف پخش خودکار"}
                onClick={() => {
                  setUserPaused(current => {
                    const next = !current;
                    userPausedRef.current = next;
                    if (current) {
                      const pb = playback.current;
                      if (pb.remaining <= 0) pb.remaining = phaseDuration(pb.phase);
                    }
                    return next;
                  });
                }}
              >
                <Icon kind={userPaused ? "play" : "pause"} />
              </button>
            )}
          </div>
          <h2 id={`${id}-title`}>از انتخاب تا ورود</h2>
          <p>چهار قدم تا تجربه بعدی تو</p>
        </header>

        <div className={s.strip} ref={strip}>
          <div className={s.navigation} data-phase={phase}>
            <div className={s.track} aria-hidden="true">
              {Array.from({ length: SEGMENT_COUNT }, (_, index) => (
                <span
                  key={index}
                  className={s.trackSegment}
                  ref={node => { segmentRefs.current[index] = node; }}
                >
                  <i />
                </span>
              ))}
            </div>
            <div className={s.tabs} role="tablist" aria-label="مراحل استفاده از فیت‌نت" aria-orientation="horizontal">
              {stages.map((stage, index) => (
                <button
                  key={stage.label}
                  ref={node => { tabs.current[index] = node; }}
                  type="button"
                  role="tab"
                  id={`${id}-tab-${index}`}
                  aria-selected={active === index}
                  aria-controls={`${id}-panel-${index}`}
                  tabIndex={active === index ? 0 : -1}
                  data-status={tabStatus(index)}
                  className={s.tab}
                  onClick={() => select(index, { focusTab: true })}
                  onKeyDown={event => onKeyDown(event, index)}
                >
                  <span
                    className={`${s.marker}${settlePulse && index === 0 && phase === "playing" ? ` ${s.markerPulse}` : ""}`}
                    aria-hidden="true"
                  >
                    {showCheck(index) ? <Icon kind="check" /> : numbers[index]}
                  </span>
                  <span className={s.tabLabel}>{stage.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={s.panelShell} style={motionStyle}>
          {stages.map((stage, index) => (
            <div
              key={stage.label}
              id={`${id}-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${index}`}
              tabIndex={0}
              hidden={index !== active}
              className={s.panel}
            >
              {index === active && (
                <div className={s.layers}>
                  {outgoing !== null && <div key={`out-${revision}`} className={s.outgoing} aria-hidden="true"><Content stage={outgoing} /></div>}
                  <div key={`in-${revision}`} className={revision ? (direction === 0 ? s.incomingSoft : s.incoming) : s.initial}>
                    <Content stage={active} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
