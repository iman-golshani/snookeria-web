"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
type Media={id:string;media_url:string;media_type:string;alt_text:string|null;sort_order:number};
export type FeedPost={id:string;title:string;slug:string;excerpt:string|null;body:string|null;cover_image_url:string|null;category:string;post_media?:Media[]};
function FeedItem({post}:{post:FeedPost}){
 const [active,setActive]=useState(0);const [expanded,setExpanded]=useState(false);
 const media=(post.post_media||[]).slice().sort((a,b)=>a.sort_order-b.sort_order);
 if(!media.length&&post.cover_image_url)media.push({id:post.id,media_url:post.cover_image_url,media_type:"image",alt_text:post.title,sort_order:0});
 const caption=(post.body||post.excerpt||"").replace(/<br\s*\/?\s*>/gi,"\n").replace(/<\/p>/gi,"\n\n").replace(/<[^>]*>/g,"").trim();
 let touchX=0;
 const change=(n:number)=>setActive(v=>Math.max(0,Math.min(media.length-1,v+n)));
 return <article className="border-b border-white/[.07] pb-7 pt-4">
  <div className="mb-3 flex items-center gap-2 px-4"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#12342e] text-[10px] font-black text-[#56d89b]">SA</div><div className="flex-1"><p className="text-xs font-black">SNOOKERIA</p><p className="text-[9px] text-white/35">{post.category==="article"?"آموزش و مقاله":post.category==="story"?"داستان":post.category==="news"?"خبر":"دنیای اسنوکر"}</p></div></div>
  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0b2029]" onTouchStart={e=>{touchX=e.touches[0].clientX}} onTouchEnd={e=>{const d=e.changedTouches[0].clientX-touchX;if(Math.abs(d)>45)change(d>0?1:-1)}}>
   {media.length?media[active].media_type==="video"?<video key={media[active].id} src={media[active].media_url} controls playsInline className="h-full w-full object-contain"/>:<img src={media[active].media_url} alt={media[active].alt_text||post.title} className="h-full w-full object-contain"/>:<div className="flex h-full items-center justify-center"><BookOpen className="text-white/20"/></div>}
   {media.length>1&&<><span dir="ltr" className="absolute right-3 top-3 rounded-full bg-black/55 px-2 py-1 text-[10px]">{active+1}/{media.length}</span>{active>0&&<button aria-label="اسلاید قبلی" onClick={()=>change(-1)} className="absolute right-2 top-1/2 rounded-full bg-black/40 p-2"><ChevronRight size={16}/></button>}{active<media.length-1&&<button aria-label="اسلاید بعدی" onClick={()=>change(1)} className="absolute left-2 top-1/2 rounded-full bg-black/40 p-2"><ChevronLeft size={16}/></button>}</>}
  </div>
  {media.length>1&&<div className="mt-3 flex justify-center gap-1.5">{media.map((m,i)=><button key={m.id} aria-label={`اسلاید ${i+1}`} onClick={()=>setActive(i)} className={`h-1.5 rounded-full transition-all ${i===active?"w-4 bg-[#e3222b]":"w-1.5 bg-white/25"}`}/>)}</div>}
  <div className="px-4 pt-4"><h2 className="text-sm font-black leading-7">{post.title}</h2>{caption&&<><p className={`mt-1 whitespace-pre-line text-xs leading-7 text-white/65 ${expanded?"":"line-clamp-2"}`}>{caption}</p><button onClick={()=>setExpanded(!expanded)} className="mt-1 text-[11px] font-bold text-[#55d49a]">{expanded?"کمتر":"بیشتر"}</button></>}</div>
 </article>;
}
export default function DiscoverFeed({posts}:{posts:FeedPost[]}){return <div className="mx-auto max-w-[540px]">{posts.map(post=><FeedItem key={post.id} post={post}/>)}</div>}
