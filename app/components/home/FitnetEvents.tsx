'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';
import styles from './FitnetEvents.module.css';

export type EventCover = { src: string; alt: string };
export type EventMoment = { iso: string; label: string };
export type ApprovedFitnetEvent = {
  id: string;
  approved: true;
  title: string;
  cover?: EventCover;
  start?: EventMoment;
  end?: EventMoment;
  location?: string;
  eligibilityLabel?: string;
  creditPrice?: number;
  availability?: 'Available' | 'Limited' | 'Full';
  destinationUrl?: string;
};
export type FitnetEventsProps = {
  events?: readonly ApprovedFitnetEvent[];
  demoCovers?: readonly EventCover[];
  className?: string;
};

const DEMO_ITEMS: readonly ApprovedFitnetEvent[] = [
  { id: 'demo-training', approved: true, title: 'نمونهٔ رویداد تمرین گروهی' },
  { id: 'demo-workshop', approved: true, title: 'نمونهٔ کارگاه ورزشی' },
  { id: 'demo-yoga', approved: true, title: 'نمونهٔ کلاس یوگا' },
  { id: 'demo-run', approved: true, title: 'نمونهٔ دویدن آزاد' },
  { id: 'demo-cycle', approved: true, title: 'نمونهٔ کارگاه دوچرخه' },
];

const DEMO_DESCRIPTIONS = [
  'تمرین گروهی در فضایی مناسب؛ اطلاعات نمونه.',
  'آشنایی با یک مهارت ورزشی؛ اطلاعات نمونه.',
  'تمرکز و کشش آرام؛ اطلاعات نمونه.',
  'دویدن همراه دیگران؛ اطلاعات نمونه.',
  'آموزش پایهٔ دوچرخه؛ اطلاعات نمونه.',
] as const;

const availabilityLabels = {
  Available: 'ظرفیت موجود',
  Limited: 'ظرفیت محدود',
  Full: 'تکمیل ظرفیت',
} as const;

const INTERVAL = 6000;
const ITEM_HEIGHT = 62;

const digits = (value: number) => String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

function wrap(min: number, max: number, value: number) {
  const size = max - min;
  return ((((value - min) % size) + size) % size) + min;
}

function wrapIndex(step: number, len: number) {
  if (len <= 0) return 0;
  return ((step % len) + len) % len;
}

function safeUrl(value?: string, localOnly = false): string | undefined {
  if (!value || /[\s\\\u0000-\u001f\u007f]/.test(value)) return;
  if (/%(?:0[0-9a-f]|1[0-9a-f]|7f|5c)/i.test(value)) return;
  if (value.startsWith('/') && !value.startsWith('//')) {
    const path = value.split(/[?#]/)[0];
    if (!localOnly && (path === '/' || /(?:placeholder|your[-_]|todo|example)/i.test(path))) return;
    return value;
  }
  if (localOnly) return;
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return;
    if (/(^|\.)(example\.(com|org|net)|localhost)$|\.(invalid|test|example)$/i.test(url.hostname)) return;
    if (!url.hostname || /(?:placeholder|your[-_]|todo)/i.test(url.pathname)) return;
    return url.href;
  } catch {
    return;
  }
}

function validMoment(moment?: EventMoment): moment is EventMoment {
  return (
    !!moment?.label.trim()
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(moment.iso)
    && Number.isFinite(Date.parse(moment.iso))
  );
}

function Illustration({ variant }: { variant: number }) {
  const tone = variant % 5;
  const fills = ['#C3DBFC', '#EDECF7', '#DCE8F8', '#E8E6F4', '#D4E4F7'];
  return (
    <svg className={styles.coverArt} viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
      <rect width="400" height="500" fill={fills[tone]} />
      <path d="M0 360 400 180V500H0Z" fill="#ACCAEE" opacity=".85" />
      <path d="M40 310 220 260 360 330 80 370Z" fill="#170B93" opacity={tone % 2 ? 1 : .88} />
      {tone === 0 && <circle cx="290" cy="130" r="44" fill="#E36F2E" />}
      {tone === 1 && <circle cx="250" cy="150" r="50" stroke="#E36F2E" strokeWidth="16" />}
      {tone === 2 && <rect x="120" y="200" width="160" height="18" rx="9" fill="#C3DBFC" />}
      {tone === 3 && <ellipse cx="280" cy="140" rx="70" ry="24" fill="#E36F2E" opacity=".85" />}
      {tone === 4 && (
        <g stroke="#E36F2E" strokeWidth="14">
          <circle cx="220" cy="160" r="52" fill="none" />
        </g>
      )}
    </svg>
  );
}

function CoverMedia({ cover, variant }: { cover?: EventCover; variant: number }) {
  const [ready, setReady] = useState(false);
  const src = safeUrl(cover?.src, true);
  return (
    <>
      <div className={styles.coverLayer}>
        <Illustration variant={variant} />
        {src && (
          <img
            className={styles.coverPhoto}
            src={src}
            alt=""
            width={400}
            height={500}
            loading="eager"
            decoding="async"
            draggable={false}
            data-ready={ready ? 'true' : 'false'}
            onLoad={(event) => setReady(event.currentTarget.naturalWidth > 0)}
            onError={() => setReady(false)}
          />
        )}
      </div>
    </>
  );
}

type CardStatus = 'active' | 'prev' | 'next' | 'hidden';

function getCardStatus(index: number, currentIndex: number, len: number): CardStatus {
  let diff = index - currentIndex;
  if (diff > len / 2) diff -= len;
  if (diff < -len / 2) diff += len;
  if (diff === 0) return 'active';
  if (diff === -1) return 'prev';
  if (diff === 1) return 'next';
  return 'hidden';
}

export default function FitnetEvents({ events, demoCovers, className }: FitnetEventsProps) {
  const sectionId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const enteredRef = useRef(false);
  const reducedRef = useRef(false);

  const [entering, setEntering] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [focusBlocked, setFocusBlocked] = useState(false);
  const [step, setStep] = useState(0);

  const seen = new Set<string>();
  const approved = (events ?? []).filter((event) => {
    if (event.approved !== true || !event.id?.trim() || !event.title?.trim() || seen.has(event.id)) return false;
    seen.add(event.id);
    return true;
  }).slice(0, 2);
  const demo = approved.length === 0;
  const items: readonly ApprovedFitnetEvent[] = demo
    ? DEMO_ITEMS.map((item, index) => ({
        ...item,
        cover: demoCovers?.[index] ?? item.cover,
      }))
    : approved;
  const len = items.length;
  const carousel = len > 1;
  const currentIndex = wrapIndex(step, len);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => {
      reducedRef.current = media.matches;
      setReduced(media.matches);
      if (media.matches) setUserPaused(true);
    };
    const syncVisibility = () => setDocumentVisible(document.visibilityState === 'visible');
    syncMotion();
    syncVisibility();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- gate
    setReady(true);
    media.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    const shell = shellRef.current;
    const section = sectionRef.current;
    let observer: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window && shell && section) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.target === shell) setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.3);
            if (entry.target === section && entry.isIntersecting && !enteredRef.current) {
              enteredRef.current = true;
              setEntering(!media.matches);
            }
          }
        },
        { threshold: [0, 0.3] },
      );
      observer.observe(shell);
      observer.observe(section);
    } else {
      setVisible(true);
      enteredRef.current = true;
    }
    return () => {
      observer?.disconnect();
      media.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, []);

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const running = ready && visible && documentVisible && carousel && !userPaused && !focusBlocked;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(nextStep, INTERVAL);
    return () => window.clearTimeout(timer);
  }, [running, step, nextStep]);

  function handleChipClick(index: number) {
    if (!carousel || index === currentIndex) return;
    const forward = (index - currentIndex + len) % len;
    const backward = (currentIndex - index + len) % len;
    if (forward <= backward) setStep((value) => value + forward);
    else setStep((value) => value - backward);
    setFocusBlocked(false);
  }

  function onShellKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!carousel) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      nextStep();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setStep((value) => value - 1);
    }
  }

  function onFocusOut(event: FocusEvent<HTMLElement>) {
    const next = event.relatedTarget;
    if (next instanceof Node && shellRef.current?.contains(next)) return;
    setFocusBlocked(false);
  }

  function chipDescription(event: ApprovedFitnetEvent, variant: number, demoMode: boolean) {
    if (demoMode) return DEMO_DESCRIPTIONS[variant % DEMO_DESCRIPTIONS.length] ?? DEMO_DESCRIPTIONS[0];
    const start = validMoment(event.start) ? event.start : undefined;
    return [event.location, start?.label].filter(Boolean).join(' · ') || 'جزئیات رویداد';
  }

  function chipMeta(event: ApprovedFitnetEvent, demoMode: boolean) {
    if (demoMode) return 'اطلاعات نمونه';
    const price = typeof event.creditPrice === 'number' && Number.isFinite(event.creditPrice) && event.creditPrice >= 0
      ? event.creditPrice
      : undefined;
    const status = event.availability && availabilityLabels[event.availability];
    return [price !== undefined ? `${digits(price)} اعتبار` : undefined, status].filter(Boolean).join(' · ');
  }

  return (
    <section
      id="events"
      ref={sectionRef}
      className={[styles.section, className].filter(Boolean).join(' ')}
      dir="rtl"
      lang="fa"
      aria-labelledby={`${sectionId}-heading`}
      data-entering={entering}
      data-reduced={reduced || undefined}
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true" />{demo ? 'پیش‌نمایش رویدادها' : 'رویدادهای تأییدشده'}</p>
            <h2 id={`${sectionId}-heading`} className={styles.headline}>گاهی، جور دیگری ورزش کن</h2>
          </div>
          <p className={styles.description}>
            کنار تمرین‌های همیشگی، رویدادهای ورزشی تأییدشده را کشف کن؛ زمان، محل و اعتبار موردنیاز را ببین و تجربهٔ بعدی‌ات را انتخاب کن.
          </p>
        </header>
        {demo && (
          <p className={styles.notice}>اطلاعات نمونه؛ این پیش‌نمایش‌ها رویداد واقعی یا امکان رزرو ارائه نمی‌کنند.</p>
        )}

        <div
          ref={shellRef}
          className={styles.shell}
          data-single={!carousel || undefined}
          tabIndex={carousel ? 0 : undefined}
          role={carousel ? 'region' : undefined}
          aria-roledescription={carousel ? 'کاروسل' : undefined}
          aria-label={carousel ? (demo ? 'پیش‌نمایش رویدادها' : 'رویدادهای تأییدشده') : undefined}
          onKeyDown={onShellKeyDown}
          onFocusCapture={(event) => {
            if (!carousel) return;
            // Pause only when the carousel region itself receives keyboard focus, not chip/card clicks.
            if (event.target === event.currentTarget) setFocusBlocked(true);
          }}
          onBlurCapture={onFocusOut}
        >
          <div className={styles.rail}>
            <div className={styles.railFadeTop} aria-hidden="true" />
            <div className={styles.railFadeBottom} aria-hidden="true" />
            <div className={styles.railList} style={{ height: Math.max(220, ITEM_HEIGHT * Math.min(len, 4)) }}>
              {items.map((event, index) => {
                const isActive = index === currentIndex;
                const distance = index - currentIndex;
                const wrappedDistance = wrap(-(len / 2), len / 2, distance);
                return (
                  <div
                    key={event.id}
                    className={styles.railItem}
                    data-animate={!reduced ? 'true' : 'false'}
                    style={{
                      transform: `translateY(${wrappedDistance * ITEM_HEIGHT}px)`,
                      opacity: 1 - Math.abs(wrappedDistance) * 0.25,
                    }}
                  >
                    <button
                      type="button"
                      className={styles.chip}
                      data-active={isActive || undefined}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => handleChipClick(index)}
                    >
                      <span className={styles.chipIndex} aria-hidden="true">{digits(index + 1)}</span>
                      <span className={styles.chipLabel}>{event.title}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.stage}>
            <div className={styles.cardStack}>
              {items.map((event, index) => {
                const status = carousel ? getCardStatus(index, currentIndex, len) : 'active';
                const destination = demo || status !== 'active' ? undefined : safeUrl(event.destinationUrl);
                const description = chipDescription(event, index, demo);
                const meta = chipMeta(event, demo);
                return (
                  <article
                    key={event.id}
                    className={styles.card}
                    data-status={status}
                    data-animate={!reduced ? 'true' : 'false'}
                    aria-hidden={status === 'hidden' ? true : undefined}
                    inert={status === 'hidden' ? true : undefined}
                    onClick={() => {
                      if (status === 'prev' || status === 'next') handleChipClick(index);
                    }}
                  >
                    <CoverMedia cover={event.cover} variant={index} />
                    {status === 'active' && (
                      <div className={styles.cardOverlay} dir="rtl">
                        {meta ? <p className={styles.cardBadge}>{meta}</p> : null}
                        <h3 className={styles.cardTitle} id={`${sectionId}-title-${event.id}`}>{event.title}</h3>
                        <p className={styles.cardDescription}>{description}</p>
                      </div>
                    )}
                    {destination && status === 'active' && (
                      <a href={destination} className={styles.cardLink} aria-label={`صفحهٔ رویداد: ${event.title}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
