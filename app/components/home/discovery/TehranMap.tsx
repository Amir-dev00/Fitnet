"use client";

import {useCallback,useEffect,useId,useLayoutEffect,useMemo,useRef,useState} from "react";
import data from "./tehran-map-data.json";
import {getView,MIN_ZOOM,MAX_ZOOM,type Camera} from "./map-camera";
import styles from "./TehranMap.module.css";

export type TehranMarker={id:string;name:string;longitude:number;latitude:number;credits?:string;isDemo?:boolean};
export type TehranMapProps={markers?:readonly TehranMarker[];selectedId?:string;onSelect?:(id:string)=>void;assetBase?:string};
const EMPTY:readonly TehranMarker[]=[];
const W=data.width,H=data.height;
const merc=(lat:number)=>Math.log(Math.tan(Math.PI/4+lat*Math.PI/360));
export function projectTehran(longitude:number,latitude:number){const b=data.bounds;return {x:(longitude-b.west)/(b.east-b.west)*W,y:(merc(b.north)-merc(latitude))/((b.east-b.west)*Math.PI/180)*W};}
/** Historical export name retained; now checks the expanded Tehran-region data bounds. */
export function withinTehran(longitude:number,latitude:number){const b=data.bounds;return Number.isFinite(longitude)&&Number.isFinite(latitude)&&longitude>=b.west&&longitude<=b.east&&latitude>=b.south&&latitude<=b.north;}
const INITIAL={...projectTehran(51.405,35.72),zoom:3.2};
type Point={x:number;y:number};
type Gesture={points:Point[];camera:Camera};
function SvgTehranMap({markers=EMPTY,selectedId,onSelect,assetBase="/maps/tehran"}:TehranMapProps){
 const host=useRef<HTMLDivElement>(null);const help=useId();
 const [size,setSize]=useState({width:600,height:390});
 const [camera,setCamera]=useState<Camera>(INITIAL);
 const [dragEnabled,setDragEnabled]=useState(false);const [failed,setFailed]=useState(false);
 const pointers=useRef(new Map<number,Point>());const gesture=useRef<Gesture|null>(null);
 const view=getView(camera,size.width,size.height,W,H);
 const {x:cx,y:cy,width,height,left,top}=view;
 const valid=useMemo(()=>markers.filter(m=>withinTehran(m.longitude,m.latitude)),[markers]);
 const live=useRef({view,size,dragEnabled});
 useLayoutEffect(()=>{live.current={view,size,dragEnabled};});
 const commit=useCallback((c:Camera)=>setCamera(getView(c,live.current.size.width,live.current.size.height,W,H)),[]);
 const zoomAt=useCallback((factor:number,px?:number,py?:number)=>{
  const {view:v,size:s}=live.current;const nx=Math.max(MIN_ZOOM,Math.min(MAX_ZOOM,v.zoom*factor));
  const u=px===undefined?.5:px/s.width,t=py===undefined?.5:py/s.height;
  const next=getView({...v,zoom:nx},s.width,s.height,W,H);
  commit({x:v.left+u*v.width-(u-.5)*next.width,y:v.top+t*v.height-(t-.5)*next.height,zoom:nx});
 },[commit]);
 const updateSize=useCallback(()=>{const r=host.current?.getBoundingClientRect();if(r&&r.width>0&&r.height>0)setSize({width:r.width,height:r.height});},[]);
 useEffect(()=>{updateSize();const el=host.current;if(!el)return;const obs=new ResizeObserver(updateSize);obs.observe(el);return()=>obs.disconnect();},[updateSize]);
 const selected=valid.find(v=>v.id===selectedId);const selectedLon=selected?.longitude,selectedLat=selected?.latitude;
 // Follow selection without an effect-driven setState cascade (project lint rule).
 const [followId,setFollowId]=useState(selectedId);
 if(selectedId!==followId){
  setFollowId(selectedId);
  if(selectedLon!==undefined&&selectedLat!==undefined){
   const p=projectTehran(selectedLon,selectedLat);
   setCamera(c=>({...c,...p}));
  }
 }
 const [assetKey,setAssetKey]=useState(assetBase);
 if(assetBase!==assetKey){setAssetKey(assetBase);setFailed(false);}
 useEffect(()=>{const el=host.current;if(!el)return;
  const wheel=(e:WheelEvent)=>{if(!live.current.dragEnabled)return;e.preventDefault();const r=el.getBoundingClientRect();zoomAt(Math.exp(-Math.max(-100,Math.min(100,e.deltaY))*.006),e.clientX-r.left,e.clientY-r.top);};
  el.addEventListener('wheel',wheel,{passive:false});
  return()=>{el.removeEventListener('wheel',wheel);};
 },[zoomAt]);
 const visibleLabels=useMemo(()=>{
  const detail=W/width;
  const occupied:{x:number;y:number;w:number;h:number}[]=[{x:0,y:0,w:68,h:164},{x:0,y:size.height-65,w:size.width,h:65}];
  for(const m of valid){const p=projectTehran(m.longitude,m.latitude);occupied.push({x:(p.x-left)/width*size.width-58,y:(p.y-top)/height*size.height-26,w:116,h:52});}
  const out:{id:string;name:string;x:number;y:number;size:number}[]=[];
  const repeats=new Map<string,Point[]>();
  for(const l of data.labels){
   if(l.rank>=5&&detail<7||l.rank===4&&detail<2.8||l.rank===3&&detail<1.5)continue;
   const x=(l.x-left)/width*size.width,y=(l.y-top)/height*size.height;
   if(x<10||y<10||x>size.width-10||y>size.height-10)continue;
   const font=l.rank<=2?12:11;const w=Math.max(28,l.name.length*font*.58),h=20;
   const box={x:x-w/2-5,y:y-h/2-3,w:w+10,h:h+6};
   if(box.x<6||box.y<6||box.x+box.w>size.width-6||box.y+box.h>size.height-6)continue;
   if((repeats.get(l.name)||[]).some(p=>Math.hypot(p.x-x,p.y-y)<220))continue;
   if(occupied.some(b=>box.x<b.x+b.w&&box.x+box.w>b.x&&box.y<b.y+b.h&&box.y+box.h>b.y))continue;
   occupied.push(box);repeats.set(l.name,[...(repeats.get(l.name)||[]),{x,y}]);out.push({id:l.id,name:l.name,x,y,size:font});
   if(out.length>=100)break;
  }return out;
 },[width,height,left,top,size,valid]);
 const rebase=()=>{gesture.current={points:[...pointers.current.values()],camera:{x:live.current.view.x,y:live.current.view.y,zoom:live.current.view.zoom}};};
 const endPointer=(id:number)=>{pointers.current.delete(id);if(pointers.current.size)rebase();else gesture.current=null;};
 const pan=(dx:number,dy:number)=>commit({x:cx+dx*width,y:cy+dy*height,zoom:camera.zoom});
 const reset=()=>{pointers.current.clear();gesture.current=null;commit(INITIAL);};
 const metersPerPixel=(data.bounds.east-data.bounds.west)*111320*Math.cos(35.7*Math.PI/180)/W*width/size.width;
 const scaleMeters=[50,100,200,500,1000,2000,5000,10000,20000].filter(n=>n/metersPerPixel<=85).pop()||50;
 return <div className={styles.shell} dir="rtl">
  <div className={styles.topline}><span>تهران و اطراف <span className={styles.secondary}>/ نقشهٔ خیابان‌ها</span></span><span className={styles.north} aria-label="شمال نقشه در بالا است">↑ شمال</span></div>
  <div ref={host} className={styles.viewport} data-drag={dragEnabled} data-zoom={view.zoom.toFixed(3)} tabIndex={0} role="group" aria-label="نقشهٔ واقعی خیابان‌های تهران و اطراف" aria-describedby={help}
   onKeyDown={e=>{if(e.target!==e.currentTarget)return;const actions:Record<string,()=>void>={ArrowLeft:()=>pan(-.15,0),ArrowRight:()=>pan(.15,0),ArrowUp:()=>pan(0,-.15),ArrowDown:()=>pan(0,.15),'+':()=>zoomAt(1.4),'=':()=>zoomAt(1.4),'-':()=>zoomAt(1/1.4),Home:reset};if(actions[e.key]){e.preventDefault();actions[e.key]();}}}
   onDoubleClick={e=>{if(!dragEnabled||(e.target as Element).closest('button,a'))return;const r=e.currentTarget.getBoundingClientRect();zoomAt(1.7,e.clientX-r.left,e.clientY-r.top);}}
   onPointerDown={e=>{if(!dragEnabled||(e.pointerType==='mouse'&&e.button!==0)||(e.target as Element).closest('button,a'))return;e.currentTarget.setPointerCapture(e.pointerId);const r=e.currentTarget.getBoundingClientRect();pointers.current.set(e.pointerId,{x:e.clientX-r.left,y:e.clientY-r.top});rebase();}}
   onPointerMove={e=>{if(!pointers.current.has(e.pointerId)||!gesture.current)return;const r=e.currentTarget.getBoundingClientRect();pointers.current.set(e.pointerId,{x:e.clientX-r.left,y:e.clientY-r.top});const now=[...pointers.current.values()],g=gesture.current;const v=getView(g.camera,size.width,size.height,W,H);
    if(now.length>=2&&g.points.length>=2){const [a,b]=g.points,[c,d]=now;const initialDistance=Math.hypot(b.x-a.x,b.y-a.y);if(initialDistance<8)return;const z=Math.max(MIN_ZOOM,Math.min(MAX_ZOOM,g.camera.zoom*Math.hypot(d.x-c.x,d.y-c.y)/initialDistance));const n=getView({...g.camera,zoom:z},size.width,size.height,W,H);const ax=(a.x+b.x)/2/size.width,ay=(a.y+b.y)/2/size.height,bx=(c.x+d.x)/2/size.width,by=(c.y+d.y)/2/size.height;commit({x:v.left+ax*v.width-(bx-.5)*n.width,y:v.top+ay*v.height-(by-.5)*n.height,zoom:z});}
    else if(now[0]&&g.points[0])commit({x:v.x-(now[0].x-g.points[0].x)*v.width/size.width,y:v.y-(now[0].y-g.points[0].y)*v.height/size.height,zoom:v.zoom});}}
   onPointerUp={e=>endPointer(e.pointerId)} onPointerCancel={e=>endPointer(e.pointerId)} onLostPointerCapture={e=>endPointer(e.pointerId)}>
   <svg className={styles.canvas} viewBox={`${left} ${top} ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
    <image href={`${assetBase.replace(/\/$/,'')}/tehran-roads.svg`} x="0" y="0" width={W} height={H} preserveAspectRatio="none" onError={()=>setFailed(true)}/>
   </svg>
   <div className={styles.labels} aria-hidden="true">{visibleLabels.map(l=><span key={l.id} className={styles.street} style={{left:l.x,top:l.y,fontSize:l.size}}>{l.name}</span>)}</div>
   {valid.map(marker=>{const p=projectTehran(marker.longitude,marker.latitude);const x=(p.x-left)/width*100,y=(p.y-top)/height*100;if(x<5||x>95||y<10||y>86)return null;return <button key={marker.id} type="button" className={styles.pin} style={{left:`${x}%`,top:`${y}%`}} aria-label={`${marker.name}${marker.credits?`، ${marker.credits} اعتبار`:''}${marker.isDemo?'، موقعیت نمونه':''}`} aria-pressed={marker.id===selectedId} onClick={()=>onSelect?.(marker.id)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 21s7-6 7-12A7 7 0 0 0 5 9c0 6 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg><span>{marker.credits?`${marker.credits} اعتبار`:marker.name}</span></button>})}
   <div className={styles.controls} aria-label="کنترل نقشه" onPointerDown={e=>e.stopPropagation()}>
    <button type="button" onClick={()=>zoomAt(1.4)} disabled={view.zoom>=MAX_ZOOM} aria-label="بزرگ‌نمایی">+</button>
    <button type="button" onClick={()=>zoomAt(1/1.4)} disabled={view.zoom<=MIN_ZOOM} aria-label="کوچک‌نمایی">−</button>
    <button type="button" onClick={reset} aria-label="بازگشت به تهران">⌂</button>
   </div>
   <div className={styles.scale} aria-hidden="true"><span>{scaleMeters>=1000?`${(scaleMeters/1000).toLocaleString('fa-IR')} کیلومتر`:`${scaleMeters.toLocaleString('fa-IR')} متر`}</span><i style={{width:scaleMeters/metersPerPixel}}/></div>
   {failed&&<p className={styles.error} role="alert">فایل نقشه پیدا نشد؛ پوشهٔ maps/tehran را در public قرار بدهید.</p>}
   <div className={styles.bottom}><button type="button" className={styles.dragButton} aria-pressed={dragEnabled} onClick={()=>{pointers.current.clear();gesture.current=null;setDragEnabled(v=>!v);}}>{dragEnabled?'پایان جابه‌جایی':'جابه‌جایی نقشه'}</button><a className={styles.attribution} href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" dir="ltr">© OpenStreetMap contributors</a></div>
  </div>
  <p id={help} className={styles.note}>{valid.some(m=>m.isDemo)?'نشانگر باشگاه‌ها نمونه است. ':''}برای دیدن خیابان‌های فرعی نزدیک‌تر شوید. با فعال‌کردن جابه‌جایی، زوم دو‌انگشتی و چرخ ماوس هم فعال می‌شود.<span className={styles.sr}>کلیدهای جهت: جابه‌جایی؛ مثبت و منفی: زوم؛ Home: بازگشت به تهران.</span></p>
 </div>;
}

const NESHAN_RTL_TEXT = "https://static.neshan.org/sdk/mapboxgl/mapbox-gl-rtl-text.js";
const NESHAN_STYLE = "https://static.neshan.org/sdk/maplibre/styles/light.json";
const NESHAN_SDK = "https://static.neshan.org/sdk/maplibre/5.24.3/neshan-maplibre-sdk.umd.js";
const NESHAN_CSS = "https://static.neshan.org/sdk/maplibre/5.24.3/neshan-maplibre-sdk.css";
const NESHAN_HOME: [number, number] = [51.405, 35.72];
const NESHAN_ZOOM = 12;
const NESHAN_MIN_ZOOM = 11;
const NESHAN_MAX_ZOOM = 17;

type NeshanMap = {
  remove: () => void;
  zoomIn: (options?: { duration?: number }) => void;
  zoomOut: (options?: { duration?: number }) => void;
  getZoom: () => number;
  easeTo: (options: { center?: [number, number]; zoom?: number; duration?: number }) => void;
  panBy: (offset: [number, number], options?: { duration?: number }) => void;
  on: (event: string, handler: () => void) => void;
  dragPan: { enable: () => void; disable: () => void };
  scrollZoom: { enable: () => void; disable: () => void };
  boxZoom: { enable: () => void; disable: () => void };
  doubleClickZoom: { enable: () => void; disable: () => void };
  touchZoomRotate: { enable: () => void; disable: () => void };
  keyboard: { disable: () => void };
};
type NeshanMarker = { remove: () => void; getElement: () => HTMLElement };
type MapLibreApi = {
  Map: new (options: Record<string, unknown>) => NeshanMap;
  Marker: new (options: { element: HTMLElement; anchor?: string }) => { setLngLat: (lngLat: [number, number]) => { addTo: (map: NeshanMap) => NeshanMarker } };
};

let neshanSdk: Promise<MapLibreApi> | null = null;

function loadNeshanSdk() {
  const ready = () => (window as Window & { maplibregl?: { default?: MapLibreApi } }).maplibregl?.default;
  if (ready()) return Promise.resolve(ready()!);
  if (neshanSdk) return neshanSdk;
  if (!document.querySelector("link[data-neshan-map]")) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = NESHAN_CSS;
    link.dataset.neshanMap = "css";
    document.head.appendChild(link);
  }
  neshanSdk = new Promise<MapLibreApi>((resolve, reject) => {
    const finish = () => {
      const api = ready();
      if (api) resolve(api);
      else reject(new Error("neshan sdk missing"));
    };
    const existing = document.querySelector<HTMLScriptElement>("script[data-neshan-map]");
    if (existing) {
      existing.addEventListener("load", finish, { once: true });
      existing.addEventListener("error", () => reject(new Error("neshan sdk failed")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = NESHAN_SDK;
    script.async = true;
    script.dataset.neshanMap = "js";
    script.onload = finish;
    script.onerror = () => reject(new Error("neshan sdk failed"));
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    neshanSdk = null;
    throw error;
  });
  return neshanSdk;
}

function setMapGestures(map: NeshanMap, enabled: boolean) {
  for (const control of [map.dragPan, map.scrollZoom, map.boxZoom, map.doubleClickZoom, map.touchZoomRotate]) {
    if (enabled) control.enable();
    else control.disable();
  }
}

function markerButton(marker: TehranMarker, pressed: boolean) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = styles.marker;
  button.setAttribute("aria-pressed", pressed ? "true" : "false");
  button.setAttribute("aria-label", `${marker.name}${marker.credits ? `، ${marker.credits} اعتبار` : ""}${marker.isDemo ? "، موقعیت نمونه" : ""}`);
  button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s7-6 7-12A7 7 0 0 0 5 9c0 6 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg><span></span>`;
  button.querySelector("span")!.textContent = marker.credits ? `${marker.credits} اعتبار` : marker.name;
  return button;
}

function NeshanTehranMap({ markers = EMPTY, selectedId, onSelect, apiKey }: TehranMapProps & { apiKey: string }) {
  const mapNode = useRef<HTMLDivElement>(null);
  const help = useId();
  const mapRef = useRef<NeshanMap | null>(null);
  const onSelectRef = useRef(onSelect);
  const selectedIdRef = useRef(selectedId);
  const dragRef = useRef(false);
  const markerNodes = useRef(new Map<string, HTMLButtonElement>());
  const [dragEnabled, setDragEnabled] = useState(false);
  const [failed, setFailed] = useState(false);
  const [zoom, setZoom] = useState(NESHAN_ZOOM);
  const valid = useMemo(() => markers.filter((marker) => withinTehran(marker.longitude, marker.latitude)), [markers]);
  useLayoutEffect(() => { onSelectRef.current = onSelect; selectedIdRef.current = selectedId; dragRef.current = dragEnabled; });

  useEffect(() => {
    if (!mapNode.current) return;
    let map: NeshanMap | null = null;
    let cancelled = false;
    const placed: NeshanMarker[] = [];
    loadNeshanSdk().then((maplibre) => {
      if (cancelled || !mapNode.current) return;
      map = new maplibre.Map({
        container: mapNode.current,
        style: NESHAN_STYLE,
        center: NESHAN_HOME,
        zoom: NESHAN_ZOOM,
        minZoom: NESHAN_MIN_ZOOM,
        maxZoom: NESHAN_MAX_ZOOM,
        attributionControl: true,
        apiKey,
        rtl: { url: NESHAN_RTL_TEXT, lazy: false },
      });
      map.keyboard.disable();
      setMapGestures(map, dragRef.current);
      mapRef.current = map;
      const syncZoom = () => { if (map) setZoom(map.getZoom()); };
      map.on("zoom", syncZoom);
      map.on("load", () => {
        if (cancelled || !map) return;
        markerNodes.current.clear();
        for (const marker of valid) {
          const element = markerButton(marker, marker.id === selectedIdRef.current);
          element.addEventListener("click", () => onSelectRef.current?.(marker.id));
          markerNodes.current.set(marker.id, element);
          placed.push(new maplibre.Marker({ element, anchor: "center" }).setLngLat([marker.longitude, marker.latitude]).addTo(map));
        }
        const current = valid.find((marker) => marker.id === selectedIdRef.current);
        if (current) map.easeTo({ center: [current.longitude, current.latitude], duration: 0 });
      });
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => {
      cancelled = true;
      placed.forEach((marker) => marker.remove());
      markerNodes.current.clear();
      map?.remove();
      mapRef.current = null;
    };
  }, [apiKey, valid]);

  useEffect(() => {
    markerNodes.current.forEach((element, id) => {
      element.setAttribute("aria-pressed", id === selectedId ? "true" : "false");
    });
    const marker = valid.find((item) => item.id === selectedId);
    if (marker) mapRef.current?.easeTo({ center: [marker.longitude, marker.latitude], duration: 450 });
  }, [selectedId, valid]);

  useEffect(() => {
    const map = mapRef.current;
    if (map) setMapGestures(map, dragEnabled);
  }, [dragEnabled]);

  const zoomBy = (direction: 1 | -1) => {
    const map = mapRef.current;
    if (!map) return;
    if (direction > 0) map.zoomIn({ duration: 250 });
    else map.zoomOut({ duration: 250 });
  };
  const reset = () => mapRef.current?.easeTo({ center: NESHAN_HOME, zoom: NESHAN_ZOOM, duration: 450 });
  const pan = (x: number, y: number) => mapRef.current?.panBy([x, y], { duration: 200 });

  return <div className={styles.shell} dir="rtl">
    <div className={styles.topline}><span>تهران و اطراف <span className={styles.secondary}>/ نقشهٔ نشان</span></span><span className={styles.north} aria-label="شمال نقشه در بالا است">↑ شمال</span></div>
    <div className={styles.viewport} data-drag={dragEnabled} tabIndex={0} role="group" aria-label="نقشهٔ نشان برای تهران" aria-describedby={help}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        const actions: Record<string, () => void> = {
          ArrowLeft: () => pan(-80, 0), ArrowRight: () => pan(80, 0), ArrowUp: () => pan(0, -80), ArrowDown: () => pan(0, 80),
          "+": () => zoomBy(1), "=": () => zoomBy(1), "-": () => zoomBy(-1), Home: reset,
        };
        if (actions[event.key]) { event.preventDefault(); actions[event.key](); }
      }}>
      <div ref={mapNode} className={styles.mapHost} />
      <div className={styles.controls} aria-label="کنترل نقشه">
        <button type="button" onClick={() => zoomBy(1)} disabled={zoom >= NESHAN_MAX_ZOOM} aria-label="بزرگ‌نمایی">+</button>
        <button type="button" onClick={() => zoomBy(-1)} disabled={zoom <= NESHAN_MIN_ZOOM} aria-label="کوچک‌نمایی">−</button>
        <button type="button" onClick={reset} aria-label="بازگشت به تهران">⌂</button>
      </div>
      {failed && <p className={styles.error} role="alert">نقشهٔ نشان بارگذاری نشد.</p>}
      <div className={styles.bottom}><button type="button" className={styles.dragButton} aria-pressed={dragEnabled} onClick={() => setDragEnabled((value) => !value)}>{dragEnabled ? "پایان جابه‌جایی" : "جابه‌جایی نقشه"}</button></div>
    </div>
    <p id={help} className={styles.note}>{valid.some((marker) => marker.isDemo) ? "نشانگر باشگاه‌ها نمونه است. " : ""}برای دیدن خیابان‌های فرعی نزدیک‌تر شوید. با فعال‌کردن جابه‌جایی، زوم دو‌انگشتی و چرخ ماوس هم فعال می‌شود.<span className={styles.sr}>کلیدهای جهت: جابه‌جایی؛ مثبت و منفی: زوم؛ Home: بازگشت به تهران.</span></p>
  </div>;
}

export default function TehranMap(props: TehranMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_NESHAN_API_KEY;
  if (!apiKey) return <SvgTehranMap {...props} />;
  return <NeshanTehranMap {...props} apiKey={apiKey} />;
}
