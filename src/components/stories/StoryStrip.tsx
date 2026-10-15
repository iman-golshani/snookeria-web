"use client";
import {useEffect,useRef,useState} from "react";
import {cmsSupabase} from "@/lib/supabase/cms";
type Story={id:string;media_url:string|null;media_type:"text"|"image"|"video";title:string;body:string;background:string;link_url:string|null;duration_seconds:number;published_at:string;expires_at:string};
type Highlight={id:string;title:string;cover_url:string|null;sort_order:number};
const seenKey="snookeria-stories-seen-v1";
export default function StoryStrip(){
 const [stories,setStories]=useState<Story[]>([]),[highlights,setHighlights]=useState<Highlight[]>([]),[members,setMembers]=useState<{highlight_id:string;story_id:string;sort_order:number}[]>([]);
 const [group,setGroup]=useState<string|null>(null),[index,setIndex]=useState(0),[progress,setProgress]=useState(0),[paused,setPaused]=useState(false),[seen,setSeen]=useState<string[]>([]);
 const [videoDuration,setVideoDuration]=useState(0);const video=useRef<HTMLVideoElement>(null);const hold=useRef<number|null>(null);
 useEffect(()=>{try{setSeen(JSON.parse(localStorage.getItem(seenKey)||"[]"))}catch{}},[]);
 useEffect(()=>{let live=true;async function load(){const now=new Date().toISOString();const [s,h,m]=await Promise.all([
 cmsSupabase.from("snookeria_stories").select("id,media_url,media_type,title,body,background,link_url,duration_seconds,published_at,expires_at").eq("status","published").order("published_at",{ascending:true}),
 cmsSupabase.from("snookeria_highlights").select("id,title,cover_url,sort_order").eq("is_active",true).order("sort_order"),
 cmsSupabase.from("snookeria_highlight_stories").select("highlight_id,story_id,sort_order").order("sort_order")
 ]);if(!live)return;setStories((s.data??[]).filter(x=>x.published_at&&x.published_at<=now) as Story[]);setHighlights(h.data??[]);setMembers(m.data??[])}
 void load();const timer=setInterval(()=>void load(),60000);return()=>{live=false;clearInterval(timer)}},[]);
 const now=Date.now();const active=stories.filter(s=>s.media_type==="image"&&new Date(s.expires_at).getTime()>now);
 const list=group==="live"?active:group?members.filter(m=>m.highlight_id===group).map(m=>stories.find(s=>s.id===m.story_id)).filter((s):s is Story=>!!s&&s.media_type==="image"):[];
 const current=list[index];
 useEffect(()=>{if(!current)return;setSeen(old=>{if(old.includes(current.id))return old;const next=[...old,current.id].slice(-300);try{localStorage.setItem(seenKey,JSON.stringify(next))}catch{}return next})},[current?.id]);
 useEffect(()=>{setProgress(0);setVideoDuration(0)},[group,index]);
 useEffect(()=>{if(!current||paused)return;const duration=current.media_type==="video"?(videoDuration>0?videoDuration:current.duration_seconds):current.duration_seconds;
 const step=50;const timer=setInterval(()=>setProgress(p=>Math.min(100,p+100*step/(duration*1000))),step);return()=>clearInterval(timer)},[current?.id,paused,videoDuration]);
 useEffect(()=>{if(progress<100||!current)return;if(index+1<list.length){setIndex(i=>i+1)}else{setGroup(null);setIndex(0)}},[progress,current?.id,index,list.length]);
 useEffect(()=>{if(!group)return;const key=(e:KeyboardEvent)=>{if(e.key==="Escape")setGroup(null);if(e.key==="ArrowLeft")move(1);if(e.key==="ArrowRight")move(-1)};document.addEventListener("keydown",key);return()=>document.removeEventListener("keydown",key)},[group,index,list.length]);
 function move(delta:number){const next=index+delta;if(next<0)return;if(next>=list.length){setGroup(null);setIndex(0);return}setIndex(next)}
 function open(id:string){setIndex(0);setProgress(0);setPaused(false);setGroup(id)}
 const visibleHighlights=highlights.filter(h=>members.some(m=>m.highlight_id===h.id&&stories.some(s=>s.id===m.story_id&&s.media_type==="image")));
 return <><div className="mb-4 flex gap-4 overflow-x-auto px-3 py-2" dir="rtl">
 <button type="button" onClick={()=>active.length?open("live"):undefined} className="flex w-[68px] shrink-0 flex-col items-center gap-1" aria-label="استوری‌های اسنوکریا">
 <span className={`flex h-16 w-16 items-center justify-center rounded-full border-[3px] p-[3px] ${active.some(s=>!seen.includes(s.id))?"border-red-500":"border-white/25"}`}>
 <img src="/snookeria-logo-1024.png" alt="" className="h-full w-full rounded-full object-cover" /></span><span className="text-[11px] text-[var(--ink)]">اسنوکریا</span></button>
 {visibleHighlights.map(h=><button type="button" key={h.id} onClick={()=>open(h.id)} className="flex w-[68px] shrink-0 flex-col items-center gap-1" aria-label={`هایلایت ${h.title}`}>
 <span className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-white/25 p-[3px]">{h.cover_url?<img src={h.cover_url} alt="" className="h-full w-full rounded-full object-cover"/>:<span className="flex h-full w-full items-center justify-center rounded-full bg-red-500/15 text-lg text-red-400">{h.title.slice(0,1)}</span>}</span><span className="max-w-full truncate text-[11px] text-[var(--ink)]">{h.title}</span></button>)}
 </div>
 {group&&current&&<div role="dialog" aria-modal="true" aria-label="نمایش استوری" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-0 sm:p-5" dir="rtl">
 <div className="relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-[#142136] text-white sm:h-[min(90dvh,820px)] sm:rounded-2xl" style={{backgroundColor:current.background||"#142136"}}>
 {current.media_type==="image"&&current.media_url&&<img src={current.media_url} alt={current.title} className="absolute inset-0 h-full w-full object-contain"/>}
 {current.media_type==="video"&&current.media_url&&<video ref={video} src={current.media_url} autoPlay playsInline onEnded={()=>move(1)} onLoadedMetadata={e=>{const duration=e.currentTarget.duration;if(Number.isFinite(duration)&&duration>0)setVideoDuration(duration);setProgress(0)}} className="absolute inset-0 h-full w-full object-contain" />}
 <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/70"/>
 <div className="relative z-10 flex gap-1 px-3 pt-[max(12px,env(safe-area-inset-top))]">{list.map((s,i)=><div key={s.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/35"><div className="h-full bg-white" style={{width:i<index?"100%":i===index?progress+"%":"0%"}}/></div>)}</div>
 <div className="relative z-10 flex items-center justify-between px-4 py-3"><span className="text-xs font-bold">اسنوکریا · {index+1} / {list.length}</span><button onClick={()=>setGroup(null)} aria-label="بستن استوری" className="rounded-full bg-black/40 px-3 py-2 text-lg">✕</button></div>
 <div className="relative z-10 flex-1" onPointerDown={()=>{hold.current=Date.now();setPaused(true);video.current?.pause()}} onPointerUp={e=>{setPaused(false);void video.current?.play();if(hold.current!==null&&Date.now()-hold.current<250){const rect=e.currentTarget.getBoundingClientRect();move(e.clientX<rect.left+rect.width/2?1:-1)}hold.current=null}} onPointerCancel={()=>{setPaused(false);void video.current?.play()}}><span className="absolute inset-y-0 left-0 w-1/2"/><span className="absolute inset-y-0 right-0 w-1/2"/></div>
 <div className="pointer-events-none relative z-10 px-6 pb-[max(30px,env(safe-area-inset-bottom))] text-center">{current.link_url&&<a href={current.link_url} target={current.link_url.startsWith("/")?"_self":"_blank"} rel="noopener noreferrer" className="pointer-events-auto mt-4 inline-block rounded-full bg-white px-5 py-2 text-xs font-bold text-slate-900">مشاهده جزئیات ↗</a>}</div>
 </div></div>}</>
}