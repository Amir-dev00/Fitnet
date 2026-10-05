'use client';

import { useEffect, useId, useRef, useState } from 'react';
import styles from './FitnetReferral.module.css';

export type FitnetReferralProps = {
  /** Real absolute HTTP(S) invitation URL. No invented default. */
  referralUrl?: string;
  /** Existing root-relative or absolute HTTP(S) account destination. */
  accountUrl?: string;
  className?: string;
};

type CopyState = 'idle' | 'copying' | 'success' | 'error';
type DemoPhase = 'pending' | 'playing' | 'completed' | 'restarting';

const STEPS = ['ارسال دعوت', 'اولین خرید اشتراک دوست', 'دریافت اعتبار هدیه'] as const;
const SEGMENT_COUNT = 2;
const REFERRAL_MOBILE_MQ = '(max-width: 480px)';

/** Single synchronized timeline (ms). */
const TIMELINE = {
  initialHold: 500,
  connectorFill: 1500,
  finalEmphasis: 500,
  completedHold: 2000,
  softReset: 400,
} as const;

const SEG0_START = TIMELINE.initialHold;
const SEG0_END = SEG0_START + TIMELINE.connectorFill;
const SEG1_END = SEG0_END + TIMELINE.connectorFill;
const EMPHASIS_END = SEG1_END + TIMELINE.finalEmphasis;
const HOLD_END = EMPHASIS_END + TIMELINE.completedHold;
const CYCLE_MS = HOLD_END + TIMELINE.softReset;

const FEEDBACK = {
  idle: 'اعتبار هدیه پس از اولین خرید موفق اشتراک دوستت به تو تعلق می‌گیرد.',
  copying: 'در حال کپی لینک…',
  success: 'لینک دعوت کپی شد؛ می‌توانی آن را با دوستت به اشتراک بگذاری.',
  error: 'کپی خودکار انجام نشد. لینک را در کادر انتخاب کن و از گزینهٔ کپی دستگاهت استفاده کن.',
} as const;

type DemoSnapshot = {
  phase: DemoPhase;
  activeStep: number;
  completedMask: number;
  fillingSegment: number;
  segmentProgress: number;
  allConnectorsFull: boolean;
};

type Playback = {
  generation: number;
  offsetMs: number;
  startedAt: number | null;
  raf: number | null;
};

function validUrl(value: string | undefined, allowInternal: boolean): string | undefined {
  if (!value || /[\s\\\u0000-\u001f\u007f]/.test(value) || /%(?:0[0-9a-f]|1[0-9a-f]|7f|5c)/i.test(value)) return;
  if (/(?:\{|\}|<|>|placeholder|YOUR[_-]|TODO)/i.test(value)) return;
  if (allowInternal && value.startsWith('/') && !value.startsWith('//')) {
    if (value.split(/[?#]/)[0] === '/') return;
    return value;
  }
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return;
    if (/(^|\.)(example\.(com|org|net)|localhost)$|\.(invalid|test|example)$/i.test(url.hostname)) return;
    return url.href;
  } catch {
    return;
  }
}

function hasMark(mask: number, index: number) {
  return (mask & (1 << index)) !== 0;
}

function stopClock(clock: Playback) {
  if (clock.raf !== null) {
    cancelAnimationFrame(clock.raf);
    clock.raf = null;
  }
  if (clock.startedAt !== null) {
    clock.offsetMs = (clock.offsetMs + performance.now() - clock.startedAt) % CYCLE_MS;
    clock.startedAt = null;
  }
}

/** Derive connector fill, active step, and checks from one elapsed time. */
function snapshotAt(elapsedMs: number): DemoSnapshot {
  const t = ((elapsedMs % CYCLE_MS) + CYCLE_MS) % CYCLE_MS;

  if (t < SEG0_START) {
    return {
      phase: 'pending',
      activeStep: -1,
      completedMask: 0,
      fillingSegment: 0,
      segmentProgress: 0,
      allConnectorsFull: false,
    };
  }

  if (t < SEG0_END) {
    return {
      phase: 'playing',
      activeStep: 0,
      completedMask: 0,
      fillingSegment: 0,
      segmentProgress: (t - SEG0_START) / TIMELINE.connectorFill,
      allConnectorsFull: false,
    };
  }

  if (t < SEG1_END) {
    return {
      phase: 'playing',
      activeStep: 1,
      completedMask: 1,
      fillingSegment: 1,
      segmentProgress: (t - SEG0_END) / TIMELINE.connectorFill,
      allConnectorsFull: false,
    };
  }

  if (t < EMPHASIS_END) {
    return {
      phase: 'playing',
      activeStep: 2,
      completedMask: 3,
      fillingSegment: 1,
      segmentProgress: 1,
      allConnectorsFull: false,
    };
  }

  if (t < HOLD_END) {
    return {
      phase: 'completed',
      activeStep: 2,
      completedMask: 7,
      fillingSegment: 1,
      segmentProgress: 1,
      allConnectorsFull: true,
    };
  }

  return {
    phase: 'restarting',
    activeStep: -1,
    completedMask: 7,
    fillingSegment: 0,
    segmentProgress: 0,
    allConnectorsFull: true,
  };
}

function applySegmentFills(
  nodes: Array<HTMLElement | null>,
  snapshot: DemoSnapshot,
  vertical: boolean,
) {
  const ratio = Math.min(1, Math.max(0, snapshot.segmentProgress));
  for (let i = 0; i < SEGMENT_COUNT; i++) {
    const node = nodes[i];
    if (!node) continue;
    let fill = 0;
    if (snapshot.allConnectorsFull || snapshot.phase === 'restarting') {
      fill = snapshot.phase === 'restarting' ? 1 : 1;
    } else if (i < snapshot.fillingSegment) {
      fill = 1;
    } else if (i === snapshot.fillingSegment) {
      fill = ratio;
    }
    node.style.setProperty('--segment-progress', String(fill));
    node.dataset.vertical = vertical ? 'true' : 'false';
  }
}

function Icon({ kind }: { kind: 'link' | 'purchase' | 'wallet' | 'copy' }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {kind === 'link' && (
        <path d="m11 17 6-6M10 19l-1 1a4.2 4.2 0 0 1-6-6l5-5a4.2 4.2 0 0 1 6 0M18 9l1-1a4.2 4.2 0 0 1 6 6l-5 5a4.2 4.2 0 0 1-6 0" />
      )}
      {kind === 'purchase' && (
        <>
          <rect x="4" y="6" width="20" height="17" rx="3" />
          <path d="M4 12h20M8 18h5M9 4v4M19 4v4" />
        </>
      )}
      {kind === 'wallet' && (
        <>
          <path d="M23 10V8a2 2 0 0 0-2-2H7a3 3 0 0 0 0 6h16v11H7a3 3 0 0 1-3-3V9" />
          <path d="M24 14h-6a2 2 0 0 0 0 5h6v-5Z" />
          <path d="M18.5 16.5h.2" />
        </>
      )}
      {kind === 'copy' && (
        <>
          <rect x="10" y="9" width="13" height="15" rx="2" />
          <path d="M17 6V4H5v15h2" />
        </>
      )}
    </svg>
  );
}

export default function FitnetReferral({ referralUrl, accountUrl, className }: FitnetReferralProps) {
  const id = useId();
  const visualRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const mounted = useRef(false);
  const operation = useRef(0);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playback = useRef<Playback>({ generation: 0, offsetMs: 0, startedAt: null, raf: null });
  const isMobileRef = useRef(false);

  const [observed, setObserved] = useState(false);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [demo, setDemo] = useState<DemoSnapshot>(() => snapshotAt(0));
  const [tick, setTick] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const playingRef = useRef(false);

  const invite = validUrl(referralUrl, false);
  const account = validUrl(accountUrl, true);
  const enabled = observed && !reduced;
  const playing = enabled && visible && documentVisible && !paused;

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    mounted.current = true;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia(REFERRAL_MOBILE_MQ);
    const syncMotion = () => setReduced(media.matches);
    const syncMobile = () => {
      isMobileRef.current = mobile.matches;
      setIsMobile(mobile.matches);
    };
    const syncVisibility = () => setDocumentVisible(document.visibilityState === 'visible');
    syncMotion();
    syncMobile();
    syncVisibility();
    media.addEventListener('change', syncMotion);
    mobile.addEventListener('change', syncMobile);
    document.addEventListener('visibilitychange', syncVisibility);
    let observer: IntersectionObserver | undefined;
    const node = visualRef.current;
    if ('IntersectionObserver' in window && node) {
      observer = new IntersectionObserver(
        ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.3),
        { threshold: [0, 0.3] },
      );
      observer.observe(node);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- IO gate after observer attaches
      setObserved(true);
    }
    return () => {
      mounted.current = false;
      operation.current += 1;
      if (feedbackTimer.current !== null) clearTimeout(feedbackTimer.current);
      stopClock(playback.current);
      observer?.disconnect();
      media.removeEventListener('change', syncMotion);
      mobile.removeEventListener('change', syncMobile);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, []);

  useEffect(() => {
    operation.current += 1;
    if (feedbackTimer.current !== null) clearTimeout(feedbackTimer.current);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset stale copy UI when invitation URL prop changes
    setCopyState('idle');
  }, [invite]);

  useEffect(() => {
    const clock = playback.current;
    if (!playing || reduced) {
      stopClock(clock);
      if (reduced) {
        applySegmentFills(segmentRefs.current, snapshotAt(0), isMobileRef.current);
      } else {
        applySegmentFills(segmentRefs.current, snapshotAt(clock.offsetMs), isMobileRef.current);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- sync paused frame to React for step chrome
        setDemo(snapshotAt(clock.offsetMs));
      }
      return;
    }

    clock.generation += 1;
    const generation = clock.generation;
    if (clock.startedAt === null) clock.startedAt = performance.now();

    const frame = (now: number) => {
      if (!mounted.current || clock.generation !== generation) return;
      if (!playingRef.current) return;

      const elapsed = clock.startedAt === null ? clock.offsetMs : clock.offsetMs + (now - clock.startedAt);
      const snapshot = snapshotAt(elapsed);
      applySegmentFills(segmentRefs.current, snapshot, isMobileRef.current);
      setDemo(snapshot);
      clock.raf = requestAnimationFrame(frame);
    };

    clock.raf = requestAnimationFrame(frame);
    return () => {
      clock.generation += 1;
      stopClock(clock);
    };
  }, [playing, reduced, tick]);

  useEffect(() => {
    if (reduced) stopClock(playback.current);
  }, [reduced]);

  async function copyInvitation() {
    if (!invite) return;
    const current = ++operation.current;
    if (feedbackTimer.current !== null) clearTimeout(feedbackTimer.current);
    setCopyState('copying');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(invite);
      if (!mounted.current || current !== operation.current) return;
      setCopyState('success');
      feedbackTimer.current = setTimeout(() => {
        if (mounted.current && current === operation.current) setCopyState('idle');
      }, 2500);
    } catch {
      if (mounted.current && current === operation.current) setCopyState('error');
    }
  }

  function stepStatus(index: number): 'upcoming' | 'active' | 'complete' {
    if (reduced) return 'upcoming';
    if (demo.phase === 'completed') return 'complete';
    if (demo.phase === 'restarting') return 'upcoming';
    if (hasMark(demo.completedMask, index)) return 'complete';
    if (index === demo.activeStep) return 'active';
    return 'upcoming';
  }

  function showCheck(index: number) {
    if (reduced) return false;
    if (demo.phase === 'completed') return true;
    if (demo.phase === 'restarting') return false;
    return hasMark(demo.completedMask, index);
  }

  return (
    <section
      className={[styles.section, className].filter(Boolean).join(' ')}
      dir="rtl"
      lang="fa"
      aria-labelledby={`${id}-heading`}
      data-reduced={reduced}
    >
      <div className={styles.band}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" />
            دعوت از دوستان
          </p>
          <h2 id={`${id}-heading`} className={styles.headline}>
            فیتنت را معرفی کن، اعتبار بگیر
          </h2>
          <p className={styles.description}>
            لینک دعوتت را با دوستت به اشتراک بگذار؛ بعد از اولین خرید اشتراک او، اعتبار هدیه به کیف پول تو اضافه
            می‌شود.
          </p>
          {invite ? (
            <>
              <div className={styles.linkRow}>
                <label className={styles.srOnly} htmlFor={`${id}-url`}>
                  لینک دعوت تو
                </label>
                <input
                  id={`${id}-url`}
                  className={styles.url}
                  type="text"
                  dir="ltr"
                  readOnly
                  value={invite}
                  spellCheck={false}
                  onFocus={(event) => event.currentTarget.select()}
                />
                <button
                  type="button"
                  className={styles.copyButton}
                  onClick={() => void copyInvitation()}
                  disabled={copyState === 'copying'}
                  aria-busy={copyState === 'copying'}
                  aria-label={copyState === 'success' ? 'لینک کپی شد' : 'کپی لینک دعوت'}
                >
                  <span className={styles.buttonLayer} data-visible={copyState !== 'success'} aria-hidden="true">
                    <Icon kind="copy" />
                    کپی لینک دعوت
                  </span>
                  <span className={styles.buttonLayer} data-visible={copyState === 'success'} aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path
                        d="m4 10 4 4 8-8"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    لینک کپی شد
                  </span>
                </button>
              </div>
              <div className={styles.feedback} aria-hidden="true">
                {Object.entries(FEEDBACK).map(([state, text]) => (
                  <p key={state} data-visible={copyState === state}>
                    {text}
                  </p>
                ))}
              </div>
              <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">
                {copyState === 'success' || copyState === 'error' ? FEEDBACK[copyState] : ''}
              </p>
            </>
          ) : (
            <>
              <div className={styles.linkPreview}>
                <Icon kind="link" />
                <span className={styles.abstractLink} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.previewLabel}>پیش‌نمایش</span>
              </div>
              {account ? (
                <a className={styles.accountLink} href={account}>
                  دریافت لینک دعوت در حساب کاربری <span aria-hidden="true">←</span>
                </a>
              ) : null}
            </>
          )}
        </div>
        <div ref={visualRef} className={styles.visual} data-enabled={enabled}>
          <p className={styles.visualLabel}>نمایش مراحل دریافت اعتبار</p>
          <div
            className={styles.stepsNav}
            data-phase={reduced ? 'static' : demo.phase}
            data-layout={isMobile ? 'vertical' : 'horizontal'}
          >
            <div className={styles.track} aria-hidden="true">
              {Array.from({ length: SEGMENT_COUNT }, (_, index) => (
                <span
                  key={index}
                  className={styles.trackSegment}
                  ref={(node) => {
                    segmentRefs.current[index] = node;
                  }}
                >
                  <i />
                </span>
              ))}
            </div>
            <ol className={styles.steps}>
              {STEPS.map((label, index) => (
                <li key={label} className={styles.step} data-status={stepStatus(index)}>
                  <div className={styles.iconCircle}>
                    <Icon kind={index === 0 ? 'link' : index === 1 ? 'purchase' : 'wallet'} />
                  </div>
                  <span className={styles.statusCircle} data-checked={showCheck(index) ? 'true' : 'false'} aria-hidden="true">
                    <span className={styles.stepNumber}>{['۱', '۲', '۳'][index]}</span>
                    <svg viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true">
                      <path
                        className={styles.check}
                        pathLength={1}
                        d="m6 12 4 4 8-8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className={styles.stepLabel}>{label}</span>
                </li>
              ))}
            </ol>
          </div>
          {reduced ? (
            <ol className={styles.stepsStatic} aria-label="مراحل دریافت اعتبار دعوت">
              {STEPS.map((label, index) => (
                <li key={label}>
                  <span>{index + 1}</span>
                  {label}
                </li>
              ))}
            </ol>
          ) : null}
          <p className={styles.visualNote}>این نمایش فقط مراحل را توضیح می‌دهد؛ وضعیت واقعی حساب تو نیست.</p>
          <div className={styles.toggleSlot}>
            {enabled ? (
              <button
                type="button"
                className={styles.motionToggle}
                onClick={() => {
                  setPaused((value) => !value);
                  setTick((value) => value + 1);
                }}
              >
                {paused ? 'پخش نمایش' : 'توقف نمایش'}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
