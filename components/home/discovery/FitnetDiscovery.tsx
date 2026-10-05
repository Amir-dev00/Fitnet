"use client";

import { useId, useState } from "react";
import TehranMap from "./TehranMap";
import {DEMO_VENUES, type Venue} from "./venues";
import styles from "./FitnetDiscovery.module.css";

export type VenueId = string;
export type VenueImage = { src: string; alt: string };
export interface FitnetDiscoveryProps {
  /** Real discovery destination. Omit to hide the navigation CTA. */
  discoveryUrl?: string;
  venues?: readonly Venue[];
  assetBase?: string;
  /** Optional paths in public/, e.g. /images/venues/sample-1.webp. */
  venueImages?: Partial<Record<VenueId, VenueImage>>;
}

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

export default function FitnetDiscovery({ discoveryUrl, venueImages, venues = DEMO_VENUES, assetBase }: FitnetDiscoveryProps) {
  const id = useId();
  const [view, setView] = useState<"map" | "list">("map");
  const [selectedId, setSelectedId] = useState<VenueId>(venues[0]?.id ?? "");
  const selected = venues.find((venue) => venue.id === selectedId) ?? venues[0];
  const selectedKey = selected?.id;
  const demo = venues.some(v => v.isDemo);
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
              <span id={`${id}-disclaimer`}>{demo ? "نقشهٔ واقعی تهران — باشگاه‌ها نمونه‌اند" : "کشف باشگاه‌ها در تهران"}</span>
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
                <span>اطراف تو، انتخاب‌های تازه</span><span>{new Intl.NumberFormat("fa-IR").format(venues.length)} باشگاه{demo ? " نمونه" : ""}</span>
              </div>
              <div className={styles.views}>
                <div id={`${id}-map`} className={styles.map} hidden={view !== "map"}
                  role="group" aria-label="نقشهٔ خیابان‌های تهران؛ یک باشگاه را انتخاب کنید">
                  <TehranMap markers={venues} selectedId={selectedKey} onSelect={setSelectedId} assetBase={assetBase} />
                </div>
                <div id={`${id}-list`} className={styles.listView} hidden={view !== "list"}>
                  <ul className={styles.venueList} aria-label="فهرست باشگاه‌ها">
                    {venues.map((venue) => (
                      <li key={venue.id}>
                        <button type="button" className={styles.listItem} aria-pressed={selectedKey === venue.id}
                          aria-controls={`${id}-preview`} onClick={() => setSelectedId(venue.id)}>
                          <span className={styles.listNumber}>{venue.number}</span>
                          <span className={styles.listInfo}><strong>{venue.name}</strong><span>{venue.neighborhood}</span></span>
                          <span className={styles.listMeta}><strong>{venue.credits} اعتبار</strong><span className={styles[venue.status]}>{venue.availability}</span></span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className={styles.listNote}>یک باشگاه را انتخاب کن و جزئیاتش را ببین.</p>
                </div>
              </div>
            </div>

            <div id={`${id}-preview`} className={styles.preview} role="region" aria-label="جزئیات باشگاه انتخاب‌شده">
              {venues.length === 0 && <p>هنوز باشگاهی برای نمایش اضافه نشده است.</p>}
              {/* Overlapping grid panels reserve the tallest card's natural height. */}
              {venues.map((venue) => (
                <article key={venue.id} className={styles.card} data-selected={selectedKey === venue.id}
                  aria-hidden={selectedKey !== venue.id}>
                  <VenueVisual image={venueImages?.[venue.id]} />
                  <div className={styles.cardBody}>
                    <div className={styles.cardTop}><span>باشگاه انتخاب‌شده · {venue.number}</span><span className={`${styles.status} ${styles[venue.status]}`}>{venue.availability}</span></div>
                    <h3>{venue.name}</h3>
                    <p className={styles.neighborhood}><Icon kind="pin" />{venue.neighborhood}</p>
                    <ul className={styles.facilities} aria-label="امکانات">{venue.facilities.map((facility) => <li key={facility}>{facility}</li>)}</ul>
                    <dl className={styles.details}>
                      <div><dt>بازهٔ ورود</dt><dd>{venue.entryWindow}</dd></div>
                      <div><dt>اعتبار هر ورود</dt><dd><strong>{venue.credits}</strong> اعتبار</dd></div>
                    </dl>
                    <p className={styles.eligibility}><Icon kind="check" /><span><span>نوع پذیرش</span>{venue.eligibility}</span></p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <footer className={styles.demoFooter}><span className={styles.footerLine} />محله، زمان و اعتبار را کنار هم ببین؛ بعد انتخاب کن.</footer>
        </div>
        <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">
          {selected ? `${selected.name} انتخاب شد؛ ${selected.credits} اعتبار، ${selected.availability}.` : "باشگاهی برای نمایش وجود ندارد."}
        </p>
      </div>
    </section>
  );
}
