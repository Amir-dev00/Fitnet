'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import styles from './FitnetPartners.module.css';

const INTERVAL = 3200;
const EXIT = 180;
const ENTER = 260;
const TABS = ['رزروهای امروز', 'ورودها', 'تسویه‌ها'] as const;
type TabIndex = 0 | 1 | 2;
type Phase = 'idle' | 'out' | 'in';
type SampleRow = {
  id: string;
  username: string;
  detail: string;
  state: string;
  tone: 'neutral' | 'accent' | 'complete';
};
type SampleView = { heading: string; caption: string; detailLabel: string; rows: readonly SampleRow[] };
const VIEWS: readonly SampleView[] = [
  {
    heading: 'برنامهٔ مراجعه، در یک نگاه', caption: 'شناسهٔ رزرو و بازهٔ ورود را کنار هم ببین.', detailLabel: 'بازهٔ ورود',
    rows: [
      { id: 'BK-101', username: 'sample_01', detail: '۰۹:۰۰ تا ۱۰:۳۰', state: 'تأییدشده', tone: 'complete' },
      { id: 'BK-102', username: 'sample_02', detail: '۱۱:۰۰ تا ۱۲:۳۰', state: 'تأییدشده', tone: 'complete' },
      { id: 'BK-103', username: 'sample_03', detail: '۱۶:۰۰ تا ۱۷:۳۰', state: 'لغوشده', tone: 'neutral' },
    ],
  },
  {
    heading: 'وضعیت حضور، روشن و قابل پیگیری', caption: 'ورود ثبت‌شده را از مراجعهٔ در انتظار جدا کن.', detailLabel: 'بازهٔ ورود',
    rows: [
      { id: 'BK-101', username: 'sample_01', detail: '۰۹:۰۰ تا ۱۰:۳۰', state: 'ورود ثبت‌شده', tone: 'complete' },
      { id: 'BK-102', username: 'sample_02', detail: '۱۱:۰۰ تا ۱۲:۳۰', state: 'در انتظار ورود', tone: 'accent' },
      { id: 'BK-103', username: 'sample_03', detail: '۱۶:۰۰ تا ۱۷:۳۰', state: 'لغوشده', tone: 'neutral' },
    ],
  },
  {
    heading: 'مسیر تسویه، قابل مشاهده', caption: 'وضعیت بررسی و پرداخت هر رکورد را دنبال کن.', detailLabel: 'مرحله',
    rows: [
      { id: 'ST-201', username: 'sample_04', detail: 'بررسی سوابق', state: 'در حال بررسی', tone: 'accent' },
      { id: 'ST-202', username: 'sample_05', detail: 'بررسی تکمیل‌شده', state: 'در انتظار پرداخت', tone: 'neutral' },
      { id: 'ST-203', username: 'sample_06', detail: 'پرداخت ثبت‌شده', state: 'پرداخت‌شده', tone: 'complete' },
    ],
  },
];
const nextTab = (index: TabIndex): TabIndex => ((index + 1) % 3) as TabIndex;

export type FitnetPartnersProps = { className?: string };

export default function FitnetPartners({ className }: FitnetPartnersProps) {
  const id = useId();
  const previewRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const hasEntered = useRef(false);
  const [entering, setEntering] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [focusBlocked, setFocusBlocked] = useState(false);
  const [focusedTab, setFocusedTab] = useState<TabIndex>(0);
  const [view, setView] = useState<{ active: TabIndex; target: TabIndex; phase: Phase; manual: boolean }>({ active: 0, target: 0, phase: 'idle', manual: false });

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => {
      setReduced(motion.matches);
      if (motion.matches) {
        setUserPaused(true);
        setEntering(false);
        setView((current) => ({ active: current.target, target: current.target, phase: 'idle', manual: false }));
      }
    };
    const syncVisibility = () => setDocumentVisible(document.visibilityState === 'visible');
    syncMotion(); syncVisibility();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time playback gate after media and visibility sync
    setReady(true);
    motion.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    const element = previewRef.current;
    let observer: IntersectionObserver | undefined;
    if (element && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        const qualifies = entry.isIntersecting && entry.intersectionRatio >= 0.3;
        setVisible(qualifies);
        if (qualifies && !hasEntered.current) {
          hasEntered.current = true;
          setEntering(!motion.matches);
        }
      }, { threshold: [0, 0.3] });
      observer.observe(element);
    } else {
      // Progressive enhancement: visible static content and usable preview without IO.
      setVisible(true);
      hasEntered.current = true;
    }
    return () => {
      observer?.disconnect();
      motion.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, []);

  const running = ready && visible && documentVisible && !userPaused && !focusBlocked;

  // The only timer: it schedules either a dwell, exit, or entrance phase.
  // Cleanup cancels stale work on selection, visibility, preference changes and Strict Mode remounts.
  useEffect(() => {
    let delay: number;
    let advance: () => void;
    if (view.phase === 'out' && !view.manual && !running) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- cancel a pending automatic exit when playback stops
      setView((current) => ({ ...current, target: current.active, phase: 'idle' }));
      return;
    }
    if (view.phase === 'out') {
      delay = reduced ? 0 : EXIT;
      advance = () => setView((current) => ({ ...current, active: current.target, phase: reduced ? 'idle' : 'in' }));
    } else if (view.phase === 'in') {
      delay = reduced ? 0 : ENTER;
      advance = () => setView((current) => ({ ...current, phase: 'idle' }));
    } else {
      if (!running) return;
      delay = INTERVAL;
      advance = () => setView((current) => {
        const target = nextTab(current.active);
        return reduced ? { active: target, target, phase: 'idle', manual: false } : { ...current, target, phase: 'out', manual: false };
      });
    }
    const timer = window.setTimeout(advance, delay);
    return () => window.clearTimeout(timer);
  }, [view.active, view.target, view.phase, view.manual, running, reduced]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- keep the roving tab aligned with automatic cycles
  useEffect(() => { if (!focusBlocked) setFocusedTab(view.active); }, [view.active, focusBlocked]);

  function selectTab(index: TabIndex) {
    setFocusedTab(index);
    setView((current) => {
      if (reduced || index === current.active) return { active: index, target: index, phase: 'idle', manual: true };
      return { ...current, target: index, phase: 'out', manual: true };
    });
  }

  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: TabIndex) {
    let next: TabIndex;
    // DOM order is right-to-left: ArrowLeft advances visually toward the left.
    if (event.key === 'ArrowLeft') next = nextTab(index);
    else if (event.key === 'ArrowRight') next = ((index + 2) % 3) as TabIndex;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 2;
    else return;
    event.preventDefault();
    setFocusedTab(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="partners" dir="rtl" lang="fa" aria-labelledby={`${id}-heading`}
      className={[styles.section, className].filter(Boolean).join(' ')} data-entering={entering} data-reduced={reduced}>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}><span aria-hidden="true" />برای باشگاه‌ها</p>
          <h2 id={`${id}-heading`} className={styles.headline}>باشگاهت را به انتخاب بعدی ورزشکارها تبدیل کن</h2>
          <p className={styles.description}>ظرفیت قابل رزرو باشگاهت را در فیت‌نت ارائه کن و رزروها، ورود ورزشکارها و وضعیت تسویه را از یک پنل دنبال کن.</p>
        </div>
        <div className={styles.actions}>
          <a className={styles.primary} href="/contact/?path=gym">درخواست همکاری باشگاه <span aria-hidden="true">←</span></a>
          <a className={styles.secondary} href="/contact/?path=organizer">همکاری به‌عنوان برگزارکننده <span aria-hidden="true">←</span></a>
        </div>
        <div ref={previewRef} className={styles.preview}
          onAnimationEnd={(event) => { if (event.target === event.currentTarget) setEntering(false); }}
          onFocusCapture={(event) => {
            const target = event.target;
            if (target instanceof HTMLElement && target.matches(':focus-visible')) setFocusBlocked(true);
          }}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusBlocked(false);
          }}>
          <div className={styles.previewHeader}>
            <div className={styles.brand}><img className={styles.brandMark} src="/brand/logo-reverse.webp" alt="" width={1124} height={1078} /><span>فیت‌نت <span className={styles.brandSub}>/ پنل همکاری</span></span></div>
            <span className={styles.samplePill}>نسخهٔ نمایشی</span>
          </div>
          <p className={styles.previewLabel}>پیش‌نمایش پنل باشگاه — اطلاعات نمونه</p>
          <div className={styles.surface}>
            <div className={styles.toolbar}>
              <span>نمای کلی باشگاه</span>
            </div>
            <div className={styles.tabs} role="tablist" aria-label="نماهای نمونهٔ پنل باشگاه">
              {TABS.map((label, i) => {
                const index = i as TabIndex;
                return <button key={label} type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`}
                  aria-selected={view.active === index} tabIndex={focusedTab === index ? 0 : -1}
                  ref={(node) => { tabRefs.current[index] = node; }}
                  className={styles.tab} onFocus={() => setFocusedTab(index)} onClick={() => selectTab(index)} onKeyDown={(event) => navigateTabs(event, index)}>
                  {label}
                </button>;
              })}
            </div>
            <div className={styles.panelSlot}>
              {VIEWS.map((data, index) => <div key={index} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`}
                hidden={view.active !== index} className={styles.panel} data-phase={view.active === index ? view.phase : 'idle'}>
                <div className={styles.panelHeading}><h3>{data.heading}</h3><p>{data.caption}</p></div>
                <div className={styles.tableHead} aria-hidden="true"><span>شناسه / کاربر نمونه</span><span>{data.detailLabel}</span><span>وضعیت</span></div>
                <ul className={styles.rows} aria-label={TABS[index]}>
                  {data.rows.map((row, rowIndex) => <li key={row.id} className={styles.row} style={{ animationDelay: `${rowIndex * 45}ms` }}>
                    <div className={styles.identity}><bdi className={styles.record}>{row.id}</bdi><bdi className={styles.username}>{row.username}</bdi></div>
                    <div className={styles.detail}><span className={styles.mobileLabel}>{data.detailLabel}: </span>{row.detail}</div>
                    <span className={styles.badge} data-tone={row.tone}><span aria-hidden="true" />{row.state}</span>
                  </li>)}
                </ul>
              </div>)}
            </div>
            <div className={styles.panelFooter}><span aria-hidden="true" className={styles.footerMark} />اطلاعات ثابت و نمونه؛ بدون تراکنش واقعی</div>
          </div>
          <p className={styles.previewNote}>از رزرو تا تسویه، وضعیت‌ها را یک‌جا دنبال کن.</p>
        </div>
      </div>
    </section>
  );
}
