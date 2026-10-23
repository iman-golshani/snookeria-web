"use client";
import {useEffect,useRef,useState} from "react";
import {Volume2,VolumeX,Play,RefreshCw} from "lucide-react";
import {cmsSupabase} from "@/lib/supabase/cms";

type Reel={id:string;title:string;caption:string|null;video_url:string;cover_url:string|null};
function ReelCard({reel,active}:{reel:Reel;active:boolean}){
 const ref=useRef<HTMLVideoElement>(null);
 const [muted,setMuted]=useState(true),[expanded,setExpanded]=useState(false),[error,setError]=useState(false);
 useEffect(()=>{const v=ref.current;if(!v)return;if(active){void v.play().catch(()=>{})}else{v.pause()}},[active]);
 return <section className="relative h-full w-full snap-start overflow-hidden rounded-xl bg-[#080e17] text-white">
  <video ref={ref} src={reel.video_url} poster={reel.cover_url||undefined} playsInline muted={muted} loop preload={active?"auto":"metadata"} onError={()=>setError(true)} onClick={()=>{const v=ref.current;if(v){if(v.paused)void v.play().catch(()=>{});else v.pause()}}} className="absolute inset-0 h-full w-full object-cover"/>
  {error&&<div className="absolute inset-0 flex items-center justify-center bg-black/80 text-sm">پخش این ویدیو ممکن نشد</div>}
  <button type="button" aria-label={muted?"فعال‌کردن صدا":"بی‌صداکردن"} onClick={()=>setMuted(v=>!v)} className="absolute left-3 top-3 rounded-full bg-black/50 p-2.5">{muted?<VolumeX size={20}/>:<Volume2 size={20}/>}</button>
  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 to-transparent"/>
  <div className="absolute inset-x-4 bottom-5"><p className="font-black text-sm">{reel.title}</p>{reel.caption&&<button type="button" onClick={()=>setExpanded(v=>!v)} className="mt-2 w-full text-right text-xs leading-6 whitespace-pre-wrap">{expanded?reel.caption:reel.caption.slice(0,135)}{!expanded&&reel.caption.length>135&&"… بیشتر"}</button>}</div>
 </section>
}
export default function HomeReels(){
 const [reels,setReels]=useState<Reel[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const [active,setActive]=useState(0);const viewport=useRef<HTMLDivElement>(null);
 async function load(){setLoading(true);setError("");const {data,error:e}=await cmsSupabase.from("snookeria_reels").select("id,title,caption,video_url,cover_url").eq("status","published").order("published_at",{ascending:false}).limit(40);if(e)setError("دریافت ریلزها انجام نشد: "+e.message);else setReels((data??[]) as Reel[]);setLoading(false)}
 useEffect(()=>{void load()},[]);
 useEffect(()=>{const root=viewport.current;if(!root)return;const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting&&entry.intersectionRatio>=.6){const idx=Number((entry.target as HTMLElement).dataset.index);setActive(idx)}}},{root,threshold:[.6,.85]});root.querySelectorAll("[data-index]").forEach(node=>observer.observe(node));return()=>observer.disconnect()},[reels]);
 if(loading)return <div className="flex min-h-[300px] items-center justify-center text-sm text-[var(--muted)]">در حال بارگذاری ریلزها…</div>;
 if(error)return <div className="py-16 text-center text-sm text-[var(--muted)]">{error}<button className="mt-4 mx-auto flex items-center gap-2 text-[var(--accent)]" onClick={()=>void load()}><RefreshCw size={16}/>تلاش مجدد</button></div>;
 if(!reels.length)return <div className="py-16 text-center text-sm text-[var(--muted)]"><Play className="mx-auto mb-4" size={35}/><p>هنوز ریلزی منتشر نشده است.</p><button className="mt-4 text-[var(--accent)]" onClick={()=>void load()}>به‌روزرسانی</button></div>;
 return <div ref={viewport} className="h-[min(78dvh,760px)] min-h-[400px] w-full snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-xl">
 {reels.map((reel,i)=><div data-index={i} key={reel.id} className="h-full snap-start"><ReelCard reel={reel} active={i===active}/></div>)}
 </div>
}
