"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {ArrowRight,CheckCircle2,Clapperboard,ImagePlus,Loader2,Play,Plus,RefreshCw,Trash2,UploadCloud,XCircle,RotateCcw} from "lucide-react";
import {cmsSupabase} from "@/lib/supabase/cms";
import {uploadWithProgress} from "@/lib/supabase/uploadWithProgress";
import {optimizeImageToWebp} from "@/lib/media/optimizeWebp";

type Reel={id:string;title:string;caption:string|null;video_url:string;cover_url:string|null;status:"draft"|"published";created_at:string};
const MAX_FILE=50*1024*1024;
const formatBytes=(n:number)=>n>=1048576?(n/1048576).toFixed(1)+" MB":(n/1024).toFixed(0)+" KB";
export default function ReelsAdmin(){
 const router=useRouter();
 const [ready,setReady]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
 const [reels,setReels]=useState<Reel[]>([]),[title,setTitle]=useState(""),[caption,setCaption]=useState(""),[status,setStatus]=useState<"draft"|"published">("draft");
 const [video,setVideo]=useState<File|null>(null),[cover,setCover]=useState<File|null>(null),[videoUrl,setVideoUrl]=useState(""),[coverUrl,setCoverUrl]=useState(""),[progress,setProgress]=useState(0);
 const [editing,setEditing]=useState<string|null>(null);
 const videoInput=useRef<HTMLInputElement>(null),coverInput=useRef<HTMLInputElement>(null);
 const [loaded,setLoaded]=useState(false);
 const abortRef=useRef<AbortController|null>(null);
 const savedUpload=useRef<{videoFile:File|null;videoUrl:string;coverFile:File|null;coverUrl:string|null}>({videoFile:null,videoUrl:"",coverFile:null,coverUrl:null});
 const [phase,setPhase]=useState<"idle"|"video"|"cover"|"saving"|"error"|"done">("idle");
 const [sent,setSent]=useState(0),[total,setTotal]=useState(0),[speed,setSpeed]=useState(0);
 const clock=useRef({time:0,bytes:0});
 useEffect(()=>()=>abortRef.current?.abort(),[]);
 const onUploadBytes=(loaded:number,size:number)=>{
   const now=performance.now();
   if(clock.current.time&&now-clock.current.time>=300){
     setSpeed(Math.max(0,(loaded-clock.current.bytes)*1000/(now-clock.current.time)));
     clock.current={time:now,bytes:loaded};
   }else if(!clock.current.time){clock.current={time:now,bytes:loaded}}
   setSent(loaded);setTotal(size);
 };
 async function sendFile(path:string,file:File,kind:"video"|"cover"){
   const controller=new AbortController();
   abortRef.current=controller;
   clock.current={time:0,bytes:0};
   setSent(0);setTotal(file.size);setProgress(0);setSpeed(0);setPhase(kind);
   try{await uploadWithProgress(path,file,setProgress,{signal:controller.signal,onBytes:onUploadBytes})}
   finally{abortRef.current=null}
 }
 function cancelUpload(){abortRef.current?.abort()}

 async function reload(){
  const {data,error:e}=await cmsSupabase.from("snookeria_reels").select("id,title,caption,video_url,cover_url,status,created_at").order("created_at",{ascending:false}).limit(100);
  if(e){setLoaded(false);setError("جدول ریلز هنوز آماده نیست یا دسترسی مدیریت تنظیم نشده است. ابتدا SQL ریلز را در پروژه CMS اجرا کن. ("+e.message+")");return}
  setLoaded(true);setReels((data??[]) as Reel[]);
 }
 useEffect(()=>{let mounted=true;void(async()=>{const{data}=await cmsSupabase.auth.getSession();if(!mounted)return;if(!data.session){router.replace("/admin/login");return}const {data:isAdmin,error:accessError}=await cmsSupabase.rpc("is_cms_admin");if(accessError||!isAdmin){router.replace("/admin");return}await reload();if(mounted)setReady(true)})();return()=>{mounted=false}},[router]);
 useEffect(()=>{if(!video)return;const u=URL.createObjectURL(video);setVideoUrl(u);return()=>URL.revokeObjectURL(u)},[video]);
 useEffect(()=>{if(!cover)return;const u=URL.createObjectURL(cover);setCoverUrl(u);return()=>URL.revokeObjectURL(u)},[cover]);
 function reset(force=false){if(saving&&!force){cancelUpload();return}savedUpload.current={videoFile:null,videoUrl:"",coverFile:null,coverUrl:null};setPhase("idle");setError("");setNotice("");setEditing(null);setTitle("");setCaption("");setStatus("draft");setVideo(null);setCover(null);setVideoUrl("");setCoverUrl("");setProgress(0)}
 function selectVideo(file?:File){if(!file)return;setError("");if(!["video/mp4","video/webm","video/quicktime"].includes(file.type)){setError("فرمت فایل باید MP4، WebM یا MOV باشد.");return}if(file.size>MAX_FILE){setError("برای نسخه اولیه حداکثر حجم ویدیو ۵۰ مگابایت است. ویدیو را ابتدا خروجی کم‌حجم بگیر.");return}setVideo(file);savedUpload.current.videoFile=null; savedUpload.current.videoUrl=""}
 function selectCover(file?:File){if(!file)return;if(!file.type.startsWith("image/")){setError("کاور باید تصویر باشد.");return}if(file.size>12*1024*1024){setError("حجم کاور باید کمتر از ۱۲ مگابایت باشد.");return}setCover(file);savedUpload.current.coverFile=null; savedUpload.current.coverUrl=null}
 async function save(){
  if(saving)return;
  if(!title.trim()){setError("عنوان ریلز را وارد کن.");return}
  if(!video&&!editing){setError("یک ویدیو انتخاب کن.");return}
  if(!loaded){setError("ابتدا جدول ریلز را در Supabase ایجاد کن.");return}
  setSaving(true);setError("");setNotice("");setProgress(0);
  try{
   let uploadedVideo=editing?reels.find(r=>r.id===editing)?.video_url||"":"";
   let uploadedCover=editing?reels.find(r=>r.id===editing)?.cover_url||null:null;
   if(video){
     if(savedUpload.current.videoFile===video && savedUpload.current.videoUrl){
       uploadedVideo=savedUpload.current.videoUrl;
     }else{
       const path="reels/"+crypto.randomUUID()+"."+((video.type==="video/webm")?"webm":video.type==="video/quicktime"?"mov":"mp4");
       await sendFile(path,video,"video");
       uploadedVideo=cmsSupabase.storage.from("cms-media").getPublicUrl(path).data.publicUrl;
       savedUpload.current.videoFile=video;savedUpload.current.videoUrl=uploadedVideo;
     }
   }
   if(cover){
     if(savedUpload.current.coverFile===cover && savedUpload.current.coverUrl){
       uploadedCover=savedUpload.current.coverUrl;
     }else{
       setPhase("cover");
       const optimized=await optimizeImageToWebp(cover,{maxEdge:1080,quality:0.78});
       const path="reels/"+crypto.randomUUID()+".webp";
       await sendFile(path,optimized,"cover");
       uploadedCover=cmsSupabase.storage.from("cms-media").getPublicUrl(path).data.publicUrl;
       savedUpload.current.coverFile=cover;savedUpload.current.coverUrl=uploadedCover;
     }
   }
   setPhase("saving");
   const payload={title:title.trim(),caption:caption.trim(),video_url:uploadedVideo,cover_url:uploadedCover,status,published_at:status==="published"?new Date().toISOString():null,updated_at:new Date().toISOString()};
   const res=editing?await cmsSupabase.from("snookeria_reels").update(payload).eq("id",editing):await cmsSupabase.from("snookeria_reels").insert(payload);
   if(res.error)throw res.error;
   setPhase("done");reset(true);setNotice("ریلز با موفقیت ذخیره شد.");await reload();
  }catch(e){
    if(e instanceof DOMException && e.name==="AbortError"){setError("آپلود لغو شد. می‌توانی دوباره روی ذخیره بزنی. فایل‌های کامل آپلودشده دوباره ارسال نمی‌شوند.")}
    else setError("ذخیره ریلز کامل نشد؛ با زدن دکمه تلاش مجدد می‌توانی ادامه بدهی. "+String(e));
    setPhase("error");
  }finally{setSaving(false)}
 }
 async function remove(item:Reel){
  if(!confirm("ریلز حذف شود؟ این کار قابل بازگشت نیست."))return;
  const {error:e}=await cmsSupabase.from("snookeria_reels").delete().eq("id",item.id);
  if(e)setError(e.message);else await reload();
 }
 function edit(item:Reel){savedUpload.current={videoFile:null,videoUrl:"",coverFile:null,coverUrl:null};setPhase("idle");setEditing(item.id);setTitle(item.title);setCaption(item.caption||"");setStatus(item.status);setVideo(null);setCover(null);setVideoUrl(item.video_url);setCoverUrl(item.cover_url||"");window.scrollTo({top:0,behavior:"smooth"})}
 return <main dir="rtl" className="min-h-screen bg-[var(--page)] px-4 pb-24 pt-5 text-[var(--ink)]"><div className="mx-auto max-w-2xl">
 <header className="mb-6 flex items-center justify-between"><Link href="/admin/content" className="rounded-full border border-[var(--edge)] p-2.5"><ArrowRight size={20}/></Link><div className="text-center"><h1 className="text-lg font-black">استودیوی ریلز</h1><span className="text-[10px] text-[var(--muted)]">ویدیوهای کوتاه اسنوکریا</span></div><button onClick={()=>reset()} disabled={saving} aria-label="ریلز جدید" className="rounded-full bg-[#d82c45] p-2.5 text-white"><Plus size={22}/></button></header>
 {error&&<p role="alert" className="mb-4 rounded-xl bg-red-500/10 p-3 text-xs leading-7 text-red-500">{error}</p>}
 {notice&&<p role="status" className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-500"><CheckCircle2 size={17}/>{notice}</p>}
 <section className="overflow-hidden rounded-3xl border border-[var(--edge)] bg-[var(--surface)] p-4 sm:p-6">
 <div className="mb-4 flex items-center gap-2"><Clapperboard className="text-[#17a477]"/><h2 className="font-black">{editing?"ویرایش ریلز":"ریلز جدید"}</h2></div>
 <div className="mx-auto mb-4 max-w-[280px] overflow-hidden rounded-2xl bg-[#101c23]">
  <div className="relative aspect-[9/16]">
   {videoUrl?<video key={videoUrl} src={videoUrl} controls playsInline preload="metadata" poster={coverUrl||undefined} className="h-full w-full object-contain"/>:<div className="flex h-full flex-col items-center justify-center gap-3 text-white/60"><Play size={46}/><p className="text-xs">پیش‌نمایش ریلز ۹:۱۶</p></div>}
  </div>
 </div>
 {coverUrl&&<div className="mb-4 flex items-center gap-3 rounded-xl bg-[var(--surface-raised)] p-2"><img src={coverUrl} alt="کاور انتخاب‌شده" className="h-20 w-14 rounded-lg object-cover"/><div className="text-xs leading-6"><strong>کاور ریلز</strong><p className="text-[var(--muted)]">همین تصویر در فهرست ریلز و قبل از پخش نمایش داده می‌شود.</p></div></div>}
 <div className="grid grid-cols-2 gap-2">
  <button onClick={()=>videoInput.current?.click()} disabled={saving} className="flex items-center justify-center gap-2 rounded-xl border border-[var(--edge)] bg-[var(--surface-raised)] px-3 py-3 text-xs font-bold"><UploadCloud size={18}/> انتخاب ویدیو</button>
  <button onClick={()=>coverInput.current?.click()} disabled={saving} className="flex items-center justify-center gap-2 rounded-xl border border-[var(--edge)] bg-[var(--surface-raised)] px-3 py-3 text-xs font-bold"><ImagePlus size={18}/> تصویر کاور</button>
 </div>
 <input ref={videoInput} hidden type="file" accept="video/mp4,video/webm,video/quicktime,.mov" onChange={e=>{selectVideo(e.target.files?.[0]);e.target.value=""}}/>
 <input ref={coverInput} hidden type="file" accept="image/*" onChange={e=>{selectCover(e.target.files?.[0]);e.target.value=""}}/>
 <p className="mt-3 text-center text-[11px] leading-6 text-[var(--muted)]">{video?"ویدیو: "+video.name+" — "+(video.size/1024/1024).toFixed(1)+" MB":"فرمت پیشنهادی MP4 عمودی ۹:۱۶، حداکثر ۵۰ مگابایت"}</p>
 <div className="mt-5 space-y-3">
  <label className="block text-xs font-bold">عنوان ریلز<input value={title} onChange={e=>setTitle(e.target.value)} maxLength={130} placeholder="یک نکته آموزشی اسنوکر..." className="mt-2 w-full rounded-xl border border-[var(--edge)] bg-[var(--surface-raised)] p-3 text-sm outline-none"/></label>
  <label className="block text-xs font-bold">کپشن<textarea value={caption} onChange={e=>setCaption(e.target.value)} rows={4} placeholder="توضیحات، هشتگ و دعوت به تعامل..." className="mt-2 w-full resize-y rounded-xl border border-[var(--edge)] bg-[var(--surface-raised)] p-3 text-sm outline-none"/></label>
  <label className="block text-xs font-bold">وضعیت انتشار<select value={status} onChange={e=>setStatus(e.target.value as "draft"|"published")} className="mt-2 w-full rounded-xl border border-[var(--edge)] bg-[var(--surface-raised)] p-3 text-sm"><option value="draft">پیش‌نویس</option><option value="published">منتشرشده</option></select></label>
 </div>
 {saving&&<div className="mt-5 rounded-2xl border border-[#16a877]/30 bg-[#16a877]/5 p-4" role="status" aria-live="polite">
   <div className="mb-2 flex justify-between gap-2 text-xs font-bold"><span>{phase==="video"?"در حال آپلود ویدیو":phase==="cover"?"در حال آپلود کاور":"در حال ثبت اطلاعات ریلز"}</span><span dir="ltr">{phase==="saving"?"ثبت نهایی":progress+"%"}</span></div>
   <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-raised)]"><div className="h-full rounded-full bg-[#16a877] transition-all" style={{width:(phase==="saving"?100:progress)+"%"}}/></div>
   {phase!=="saving"&&<div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--muted)]"><span dir="ltr">{formatBytes(sent)} / {formatBytes(total)}</span><span dir="ltr">{speed?formatBytes(speed)+"/s":"در حال اتصال..."}</span>{speed>0&&sent<total&&<span>زمان تقریبی باقی‌مانده: {Math.ceil((total-sent)/speed)} ثانیه</span>}</div>}
   {(phase==="video"||phase==="cover")&&<button type="button" onClick={cancelUpload} className="mt-3 flex items-center gap-2 rounded-lg border border-red-400/30 px-3 py-2 text-xs text-red-500"><XCircle size={16}/> لغو آپلود</button>}
 </div>}
 <button disabled={saving||!ready||!loaded} onClick={()=>void save()} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#087c43] px-4 py-3 text-sm font-black text-white disabled:opacity-50">{saving?<Loader2 className="animate-spin" size={20}/>:<CheckCircle2 size={19}/>} {phase==="error"?<><RotateCcw size={18}/> تلاش مجدد</>:editing?"ذخیره تغییرات":"ذخیره ریلز"}</button>
 <p className="mt-3 text-[11px] leading-6 text-[var(--muted)]">پیشرفت، سرعت و لغو آپلود در همین صفحه قابل مشاهده است. تلاش مجدد فایل‌های کامل آپلودشده را دوباره ارسال نمی‌کند؛ آپلود نیمه‌تمام هنوز از ابتدا شروع می‌شود. صفحه را تا پایان ذخیره باز نگه دار.</p>
 </section>
 <section className="mt-7"><div className="mb-4 flex items-center justify-between"><h2 className="font-black">ریلزهای ثبت‌شده</h2><button onClick={()=>void reload()} aria-label="بازخوانی" className="rounded-full border border-[var(--edge)] p-2"><RefreshCw size={17}/></button></div>
 <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{reels.map(item=><div key={item.id} className="overflow-hidden rounded-xl border border-[var(--edge)] bg-[var(--surface)]"><div className="relative aspect-[9/16] bg-[#152627]">{item.cover_url?<img src={item.cover_url} alt={item.title} loading="lazy" className="h-full w-full object-cover"/>:<video src={item.video_url} preload="none" playsInline className="h-full w-full object-cover"/>}<span className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] text-white">{item.status==="published"?"منتشرشده":"پیش‌نویس"}</span></div><div className="p-3"><p className="line-clamp-2 min-h-10 text-xs font-bold">{item.title}</p><div className="mt-3 flex gap-2"><button onClick={()=>edit(item)} className="flex-1 rounded-lg bg-[var(--surface-raised)] px-2 py-2 text-xs">ویرایش</button><button onClick={()=>void remove(item)} aria-label="حذف" className="rounded-lg bg-red-500/10 p-2 text-red-500"><Trash2 size={17}/></button></div></div></div>)}</div>
 {!ready&&<p className="text-center text-xs text-[var(--muted)]">در حال بارگذاری...</p>}
 </section>
 </div></main>
}
