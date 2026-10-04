"use client";

import { useId, useState, type CSSProperties } from "react";
import styles from "./FitnetDiscovery.module.css";

export type VenueId = "sample-1" | "sample-2" | "sample-3";
export type VenueImage = { src: string; alt: string };
export interface FitnetDiscoveryProps {
  /** Real discovery destination. Omit to hide the navigation CTA. */
  discoveryUrl?: string;
  /** Optional paths in public/, e.g. /images/venues/sample-1.webp. */
  venueImages?: Partial<Record<VenueId, VenueImage>>;
}

type Venue = {
  id: VenueId;
  number: string;
  name: string;
  neighborhood: string;
  facilities: readonly string[];
  entryWindow: string;
  credits: string;
  availability: "موجود" | "محدود" | "تکمیل";
  status: "available" | "limited" | "full";
  eligibility: string;
  x: number;
  y: number;
};

// Every venue, location, time, and credit amount is demonstration data.
const VENUES: readonly Venue[] = [
  { id: "sample-1", number: "۱", name: "باشگاه نمونه ۱", neighborhood: "محلهٔ نمونهٔ سرو",
    facilities: ["بدنسازی", "کمد", "دوش"], entryWindow: "۱۶:۰۰ تا ۲۰:۰۰", credits: "۸",
    availability: "موجود", status: "available", eligibility: "ویژهٔ آقایان",
    x: 60, y: 39 },
  { id: "sample-2", number: "۲", name: "باشگاه نمونه ۲", neighborhood: "محلهٔ نمونهٔ چنار",
    facilities: ["تمرین هوازی", "کمد", "دوش"], entryWindow: "۱۰:۰۰ تا ۱۴:۰۰", credits: "۶",
    availability: "محدود", status: "limited", eligibility: "ویژهٔ آقایان",
    x: 28, y: 64 },
  { id: "sample-3", number: "۳", name: "باشگاه نمونه ۳", neighborhood: "محلهٔ نمونهٔ سپیدار",
    facilities: ["تمرین قدرتی", "کمد", "پارکینگ"], entryWindow: "۱۸:۰۰ تا ۲۲:۰۰", credits: "۱۰",
    availability: "تکمیل", status: "full", eligibility: "ویژهٔ آقایان",
    x: 78, y: 73 },
];

function Icon({ kind }: { kind: "map" | "list" | "pin" | "arrow" | "check" }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === "map" && <><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Z" /><path d="M9 3v16M15 5v16" /></>}
      {kind === "list" && <><path d="M9 6h12M9 12h12M9 18h12" /><path d="M3 6h1M3 12h1M3 18h1" /></>}
      {kind === "pin" && <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.3" /></>}
      {kind === "arrow" && <path d="M20 12H4m6-6-6 6 6 6" />}
      {kind === "check" && <path d="m5 12 4 4L19 6" />}
    </svg>
  );
}

function EquipmentArt() {
  return (
    <svg className={styles.equipment} viewBox="0 0 400 180" fill="none" aria-hidden="true">
      <path fill="#EAF2FE" d="M0 0h400v180H0z" />
      <path fill="#DFEAFA" d="M0 139 400 116v64H0z" />
      <path stroke="#C7D8F0" d="M30 0v137M106 0v132M182 0v128M258 0v124M334 0v120M0 51h400" />
      <path fill="#C3DBFC" d="m68 137 165-12 93 24-164 18z" />
      <path stroke="#170B93" strokeWidth="9" strokeLinecap="round" d="m145 111-11 31m83-31 17 27" />
      <path fill="#170B93" d="M114 95a8 8 0 0 1 8-8h109a8 8 0 0 1 8 8v10a8 8 0 0 1-8 8H122a8 8 0 0 1-8-8z" />
      <path fill="#5248B4" d="M122 87h109a8 8 0 0 1 8 8H114a8 8 0 0 1 8-8Z" />
      <g transform="translate(96 48) rotate(-12)">
        <path stroke="#170B93" strokeWidth="7" d="M0 0h69" />
        <rect x="5" y="-15" width="13" height="30" rx="3" fill="#170B93" />
        <rect x="50" y="-15" width="13" height="30" rx="3" fill="#170B93" />
        <path stroke="#E36F2E" strokeWidth="3" d="M21 0h26" />
      </g>
      <rect x="279" y="67" width="30" height="64" rx="11" fill="#170B93" />
      <rect x="284" y="58" width="20" height="13" rx="4" fill="#170B93" />
      <path stroke="#E36F2E" strokeWidth="4" d="M284 74h20" />
      <circle cx="294" cy="101" r="7" stroke="#C3DBFC" strokeWidth="2" />
    </svg>
  );
}

function VenueVisual({ image }: { image?: VenueImage }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  // Keep this demonstration self-contained: accept same-origin public paths only.
  const local = image?.src.startsWith("/") && !image.src.startsWith("//") && !image.src.includes("\\");
  return (
    <div className={styles.visual}>
      {image && local && failedSrc !== image.src ? (
        // Native img supports static export without an image optimization server.
        <img src={image.src} alt={image.alt} width="400" height="180" loading="lazy"
          decoding="async" onError={() => setFailedSrc(image.src)} />
      ) : <EquipmentArt />}
      <span className={styles.visualLabel}>فضای تمرین، به انتخاب تو</span>
    </div>
  );
}

function SchematicMap() {
  return (
    <svg className={styles.mapArt} viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
      <path fill="#F0F4FA" d="M0 0h600v400H0z" />
      <g fill="#E1E9F4" stroke="#D7E2EF" strokeWidth="1">
        <rect x="24" y="28" width="106" height="66" rx="9" />
        <rect x="24" y="115" width="106" height="79" rx="9" />
        <rect x="156" y="28" width="104" height="66" rx="9" />
        <rect x="160" y="116" width="95" height="75" rx="9" />
        <rect x="291" y="28" width="124" height="65" rx="9" />
        <rect x="448" y="29" width="126" height="64" rx="9" />
        <rect x="447" y="116" width="126" height="76" rx="9" />
        <rect x="27" y="238" width="100" height="61" rx="9" />
        <rect x="27" y="320" width="100" height="65" rx="9" />
        <rect x="158" y="316" width="104" height="69" rx="9" />
        <rect x="315" y="317" width="103" height="67" rx="9" />
        <rect x="451" y="318" width="122" height="66" rx="9" />
        <rect x="447" y="236" width="126" height="60" rx="9" />
      </g>
      <path fill="#D6E6DF" d="M316 239h92v48h-92z" />
      <g fill="#BCD3C9"><circle cx="329" cy="253" r="7" /><circle cx="350" cy="272" r="7" /><circle cx="390" cy="253" r="8" /></g>
      <path d="M-10 218h630M280-10v183q0 43 14 76t0 161" stroke="#D7E2EF" strokeWidth="24" fill="none" />
      <path d="M-10 218h630M280-10v183q0 43 14 76t0 161" stroke="white" strokeWidth="20" fill="none" />
      <path d="M-10 218h630M280-10v183q0 43 14 76t0 161" stroke="#DFE7F2" strokeDasharray="5 9" fill="none" />
      <path d="M365 156v62H169v38" stroke="#A59DDE" strokeWidth="2" strokeDasharray="4 6" fill="none" />
    </svg>
  );
}

export default function FitnetDiscovery({ discoveryUrl, venueImages }: FitnetDiscoveryProps) {
  const id = useId();
  const [view, setView] = useState<"map" | "list">("map");
  const [selectedId, setSelectedId] = useState<VenueId>("sample-1");
  const selected = VENUES.find((venue) => venue.id === selectedId)!;
  const destination = discoveryUrl?.trim();
  // Only actual navigation URLs are supported, never script or data URLs.
  const href = destination && /^(\/(?!\/)|https?:\/\/)/i.test(destination) && !/[\\\u0000-\u0020]/.test(destination)
    ? destination : undefined;

  return (
    <section id="discovery" className={styles.section} dir="rtl" lang="fa" aria-labelledby={`${id}-heading`}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}><span />کشف کن. انتخاب کن. حرکت کن.</p>
            <h2 id={`${id}-heading`}>باشگاه بعدی‌ات را<br className={styles.desktopBreak} /> همین اطراف پیدا کن</h2>
          </div>
          <div className={styles.intro}>
            <p>نزدیک خانه یا محل کار؛ باشگاه‌های همکار را روی نقشه ببین و براساس محله، امکانات و اعتبار موردنیاز انتخاب کن.</p>
            {href && <a className={styles.cta} href={href}>کشف باشگاه‌ها<Icon kind="arrow" /></a>}
          </div>
        </header>

        <div className={styles.demo} aria-describedby={`${id}-disclaimer`}>
          <div className={styles.toolbar}>
            <div className={styles.demoCaption}>
              <span className={styles.demoDot} />
              <span id={`${id}-disclaimer`}>پیش‌نمایش محصول — اطلاعات نمونه</span>
            </div>
            <div className={styles.switch} role="group" aria-label="شیوهٔ نمایش باشگاه‌های نمونه">
              <button type="button" aria-pressed={view === "map"} aria-controls={`${id}-map`}
                onClick={() => setView("map")}><Icon kind="map" />نقشه</button>
              <button type="button" aria-pressed={view === "list"} aria-controls={`${id}-list`}
                onClick={() => setView("list")}><Icon kind="list" />لیست</button>
            </div>
          </div>

          <div className={styles.workspace}>
            <div className={styles.explorer}>
              <div className={styles.explorerHeading}>
                <span>اطراف تو، انتخاب‌های تازه</span><span>۳ باشگاه نمونه</span>
              </div>
              <div className={styles.views}>
                <div id={`${id}-map`} className={styles.map} hidden={view !== "map"} inert={view !== "map"}
                  role="group" aria-label="نقشهٔ شماتیک؛ یک باشگاه نمونه را انتخاب کنید">
                  <SchematicMap />
                  <span className={`${styles.mapLabel} ${styles.labelOne}`}>محلهٔ نمونهٔ سرو</span>
                  <span className={`${styles.mapLabel} ${styles.labelTwo}`}>محلهٔ نمونهٔ چنار</span>
                  <span className={styles.parkLabel}>بوستان نمونه</span>
                  {VENUES.map((venue) => (
                    <button key={venue.id} type="button" className={styles.marker}
                      style={{ left: `${venue.x}%`, top: `${venue.y}%` } as CSSProperties}
                      aria-label={`${venue.name}، ${venue.credits} اعتبار نمونه، ${venue.availability}`}
                      aria-pressed={selectedId === venue.id} aria-controls={`${id}-preview`}
                      onClick={() => setSelectedId(venue.id)}>
                      <span className={styles.markerBubble}><span>{venue.number}</span><Icon kind="pin" /></span>
                      <span className={styles.markerCost}>{venue.credits} اعتبار</span>
                    </button>
                  ))}
                  <span className={styles.mapNote}>نقشهٔ شماتیک · موقعیت‌ها واقعی نیستند</span>
                </div>
                <div id={`${id}-list`} className={styles.listView} hidden={view !== "list"} inert={view !== "list"}>
                  <ul className={styles.venueList} aria-label="باشگاه‌های نمونه">
                    {VENUES.map((venue) => (
                      <li key={venue.id}>
                        <button type="button" className={styles.listItem} aria-pressed={selectedId === venue.id}
                          aria-controls={`${id}-preview`} onClick={() => setSelectedId(venue.id)}>
                          <span className={styles.listNumber}>{venue.number}</span>
                          <span className={styles.listInfo}><strong>{venue.name}</strong><span>{venue.neighborhood}</span></span>
                          <span className={styles.listMeta}><strong>{venue.credits} اعتبار</strong><span className={styles[venue.status]}>{venue.availability}</span></span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className={styles.listNote}>یک باشگاه را انتخاب کن و جزئیات نمونه‌اش را ببین.</p>
                </div>
              </div>
            </div>

            <div id={`${id}-preview`} className={styles.preview} role="region" aria-label="جزئیات باشگاه انتخاب‌شده">
              {/* Overlapping grid panels reserve the tallest card's natural height. */}
              {VENUES.map((venue) => (
                <article key={venue.id} className={styles.card} data-selected={selectedId === venue.id}
                  aria-hidden={selectedId !== venue.id} inert={selectedId !== venue.id}>
                  <VenueVisual image={venueImages?.[venue.id]} />
                  <div className={styles.cardBody}>
                    <div className={styles.cardTop}><span>باشگاه انتخاب‌شده · {venue.number}</span><span className={`${styles.status} ${styles[venue.status]}`}>{venue.availability}</span></div>
                    <h3>{venue.name}</h3>
                    <p className={styles.neighborhood}><Icon kind="pin" />{venue.neighborhood}</p>
                    <ul className={styles.facilities} aria-label="امکانات">{venue.facilities.map((facility) => <li key={facility}>{facility}</li>)}</ul>
                    <dl className={styles.details}>
                      <div><dt>بازهٔ ورود نمونه</dt><dd>{venue.entryWindow}</dd></div>
                      <div><dt>اعتبار هر ورود</dt><dd><strong>{venue.credits}</strong> اعتبار</dd></div>
                    </dl>
                    <p className={styles.eligibility}><Icon kind="check" /><span><span>نوع پذیرش نمونه</span>{venue.eligibility}</span></p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <footer className={styles.demoFooter}><span className={styles.footerLine} />محله، زمان و اعتبار را کنار هم ببین؛ بعد انتخاب کن.</footer>
        </div>
        <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">
          {selected.name} انتخاب شد؛ {selected.neighborhood}، {selected.credits} اعتبار نمونه، {selected.availability}.
        </p>
      </div>
    </section>
  );
}
