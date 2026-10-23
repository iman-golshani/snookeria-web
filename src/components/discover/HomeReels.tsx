"use client";
import {useEffect,useRef,useState} from "react";
import {Maximize2,Play,RefreshCw,Volume2,VolumeX,X} from "lucide-react";
import {cmsSupabase} from "@/lib/supabase/cms";
type Reel={id:string;title:string;caption:string|null;video_url:string;cover_url:string|null};

function ReelPreview({reel,onOpen}:{reel:Reel;onOpen:()=>void}){
 const [expanded,setExpanded]=useState(false);
 return <article className="mb-4 overflow-hidden rounded-xl border border-[var(--edge)] bg-[var(--surface)]">
  <button type="button" onClick={onOpen} aria-label={`تماشای ریلز ${reel.title} در تمام صفحه`} className="relative block w-full overflow-hidden bg-[#0c1321]">
   <div className="relative aspect-[9/13] w-full">
    {reel.cover_url?<img src={reel.cover_url} alt={reel.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover"/>:<video src={reel.video_url} playsInline muted preload="metadata" className="absolute inset-0 h-full w-full object-cover"/>}
    <div className="absolute inset-0 flex items-center justify-center"><span className="rounded-full bg-black/55 p-4 text-white"><Play size={28} fill="currentColor"/></span></div>
    <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-2 text-[11px] font-bold text-white"><Maximize2 size={13}/> تمام‌صفحه</span>
   </div>
  </button>
  <div className="px-4 py-3" dir="rtl">
   <h3 className="text-sm font-black leading-6 text-[var(--ink)]">{reel.title}</h3>
   {reel.caption&&<><p className={`mt-1 whitespace-pre-line text-xs leading-6 text-[var(--muted)] ${expanded?"":"line-clamp-2"}`}>{reel.caption}</p><button type="button" onClick={()=>setExpanded(v=>!v)} className="mt-1 text-xs font-bold text-[var(--accent)]">{expanded?"بستن کپشن":"بیشتر"}</button></>}
  </div>
 </article>
}

function ReelScreen({reels,index,onClose}:{reels:Reel[];index:number;onClose:()=>void}){
 const [active,setActive]=useState(index),[muted,setMuted]=useState(false),[captionOpen,setCaptionOpen]=useState(false),[paused,setPaused]=useState(false);
 const refs=useRef<(HTMLVideoElement|null)[]>([]);
 const box=useRef<HTMLDivElement>(null);
 useEffect(()=>{const original=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=original;refs.current.forEach(v=>v?.pause())}},[]);
 useEffect(()=>{refs.current.forEach((video,i)=>{if(!video)return;video.muted=muted;if(i===active&&!captionOpen&&!paused)void video.play().catch(()=>{});else video.pause()})},[active,muted,captionOpen,paused]);
 useEffect(()=>{const key=(event:KeyboardEvent)=>{if(event.key==="Escape"){if(captionOpen)setCaptionOpen(false);else onClose()}if(event.key==="ArrowDown")setActive(i=>Math.min(i+1,reels.length-1));if(event.key==="ArrowUp")setActive(i=>Math.max(0,i-1))};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[captionOpen,reels.length,onClose]);
 useEffect(()=>{box.current?.querySelector(`[data-reel="${active}"]`)?.scrollIntoView({block:"start",behavior:"instant"})},[active]);
 const current=reels[active];
 return <div className="fixed inset-0 z-[200] bg-black text-white" role="dialog" aria-modal="true" aria-label="تماشای ریلز" dir="rtl">
  <div ref={box} className="mx-auto h-[100dvh] w-full max-w-[550px] snap-y snap-mandatory overflow-y-auto overscroll-contain">
   {reels.map((r,i)=><section key={r.id} data-reel={i} className="relative h-[100dvh] w-full snap-start bg-black">
    <video ref={v=>{refs.current[i]=v}} src={r.video_url} poster={r.cover_url||undefined} playsInline loop preload={Math.abs(i-active)<=1?"metadata":"none"} muted={muted} onClick={()=>{const v=refs.current[i];if(!v)return;if(v.paused){void v.play().catch(()=>{});setPaused(false)}else{v.pause();setPaused(true)}}} className="h-full w-full object-contain"/>
    {i===active&&<div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent"/>}
   </section>)}
  </div>
  <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto flex max-w-[550px] justify-between p-3">
   <button onClick={onClose} className="pointer-events-auto rounded-full bg-black/60 p-3" aria-label="بستن ریلز"><X size={21}/></button>
   <button onClick={()=>setMuted(v=>!v)} className="pointer-events-auto rounded-full bg-black/60 p-3" aria-label={muted?"فعال کردن صدا":"قطع صدا"}>{muted?<VolumeX size={21}/>:<Volume2 size={21}/>}</button>
  </div>
  <div className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto flex max-w-[550px] items-end gap-3 px-5" dir="rtl">
   <p className="min-w-0 flex-1 truncate text-xs font-bold drop-shadow-lg">{current.title}</p>
   {current.caption&&<button type="button" onClick={()=>setCaptionOpen(true)} className="pointer-events-auto shrink-0 rounded-full bg-black/65 px-4 py-2 text-xs font-bold">توضیحات</button>}
  </div>
  {captionOpen&&<div className="absolute inset-0 z-20 flex items-end bg-black/60" onClick={()=>setCaptionOpen(false)}>
   <section onClick={e=>e.stopPropagation()} className="max-h-[68dvh] w-full overflow-y-auto rounded-t-3xl bg-[var(--surface)] px-5 pb-9 pt-4 text-[var(--ink)]">
    <div className="mb-4 flex items-center justify-between"><h2 className="text-base font-black">توضیحات ریلز</h2><button type="button" onClick={()=>setCaptionOpen(false)} aria-label="بستن توضیحات"><X/></button></div>
    <p className="text-sm font-bold">{current.title}</p><p className="mt-3 whitespace-pre-line text-sm leading-8 text-[var(--muted)]">{current.caption}</p>
   </section>
  </div>}
 </div>
}

export default function HomeReels(){
 const [reels,setReels]=useState<Reel[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const [open,setOpen]=useState<number|null>(null);
 async function load(){setLoading(true);setError("");const {data,error:e}=await cmsSupabase.from("snookeria_reels").select("id,title,caption,video_url,cover_url").eq("status","published").order("published_at",{ascending:false}).limit(40);if(e)setError("دریافت ریلزها انجام نشد: "+e.message);else setReels((data??[]) as Reel[]);setLoading(false)}
 useEffect(()=>{void load()},[]);
 if(loading)return <div className="py-16 text-center text-xs text-[var(--muted)]">در حال بارگذاری ریلزها…</div>;
 if(error)return <div className="py-16 text-center text-sm text-[var(--muted)]">{error}<button className="mx-auto mt-4 flex items-center gap-2 text-[var(--accent)]" onClick={()=>void load()}><RefreshCw size={16}/> تلاش مجدد</button></div>;
 if(!reels.length)return <div className="py-16 text-center text-sm text-[var(--muted)]"><Play className="mx-auto mb-4" size={35}/><p>هنوز ریلزی منتشر نشده است.</p><button className="mt-4 text-[var(--accent)]" onClick={()=>void load()}>به‌روزرسانی</button></div>;
 return <><div className="mx-auto w-full max-w-[600px]">{reels.map((reel,i)=><ReelPreview key={reel.id} reel={reel} onOpen={()=>setOpen(i)}/>)}</div>{open!==null&&<ReelScreen reels={reels} index={open} onClose={()=>setOpen(null)}/>}</>;
}
