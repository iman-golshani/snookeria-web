"use client";

import {useCallback,useEffect,useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {ArrowRight,BookOpen,Check,ChevronLeft,Clapperboard,Grid2X2,ImagePlus,Images,Layers3,MoreHorizontal,Plus,RefreshCw,Sparkles,Video,WandSparkles,X} from "lucide-react";
import {cmsSupabase} from "@/lib/supabase/cms";

type Tab="posts"|"reels"|"stories";
type Post={id:string;title:string;slug:string;status:string;cover_image_url:string|null;category:string;created_at:string};
type Story={id:string;title:string;media_url:string|null;status:string;created_at:string};
type Reel={id:string;title:string;video_url:string;cover_url:string|null;status:string;created_at:string};

const nav=[
  {id:"reels" as const,label:"ریلز",Icon:Clapperboard},
  {id:"posts" as const,label:"پست‌ها",Icon:Grid2X2},
  {id:"stories" as const,label:"استوری‌ها",Icon:Images},
];

export default function ContentStudio(){
  const router=useRouter();
  const [tab,setTab]=useState<Tab>("posts");
  const [createOpen,setCreateOpen]=useState(false);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState("");
  const [posts,setPosts]=useState<Post[]>([]);
  const [stories,setStories]=useState<Story[]>([]);
  const [reels,setReels]=useState<Reel[]>([]);
  const [reelsAvailable,setReelsAvailable]=useState(true);

  const load=useCallback(async()=>{
    setError("");
    const [p,s,r]=await Promise.all([
      cmsSupabase.from("posts").select("id,title,slug,status,cover_image_url,category,created_at").order("created_at",{ascending:false}).limit(60),
      cmsSupabase.from("snookeria_stories").select("id,title,media_url,status,created_at").order("created_at",{ascending:false}).limit(60),
      cmsSupabase.from("snookeria_reels").select("id,title,video_url,cover_url,status,created_at").order("created_at",{ascending:false}).limit(60),
    ]);
    if(p.error||s.error)setError(p.error?.message||s.error?.message||"خطا در دریافت محتوا");
    setPosts((p.data||[]) as Post[]);
    setStories((s.data||[]) as Story[]);
    if(r.error){setReelsAvailable(false);setReels([])}else{setReelsAvailable(true);setReels((r.data||[]) as Reel[])}
  },[]);

  useEffect(()=>{
    let live=true;
    void(async()=>{
      const {data}=await cmsSupabase.auth.getSession();
      if(!live)return;
      if(!data.session){router.replace("/admin/login");return}
      await load();
      if(live)setLoading(false);
    })();
    return()=>{live=false};
  },[load,router]);

  async function refresh(){setRefreshing(true);await load();setRefreshing(false)}
  const count=tab==="posts"?posts.length:tab==="stories"?stories.length:reels.length;

  return <main dir="rtl" className="min-h-screen bg-[var(--page)] pb-32 text-[var(--ink)]">
    <div className="mx-auto w-full max-w-[560px]">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--edge)] bg-[var(--surface)]/95 px-4 backdrop-blur-xl">
        <Link href="/admin" aria-label="بازگشت به مدیریت" className="rounded-full p-2 text-[var(--ink)]"><ArrowRight size={23}/></Link>
        <div className="text-center"><h1 className="text-[15px] font-black tracking-tight">استودیوی اسنوکریا</h1><p className="text-[10px] font-semibold tracking-[.20em] text-[var(--muted)]" dir="ltr">SNOOKERIA STUDIO</p></div>
        <button onClick={()=>setCreateOpen(true)} aria-label="ساخت محتوای جدید" className="flex size-10 items-center justify-center rounded-full bg-[#d82c45] text-white shadow-lg shadow-red-800/20"><Plus size={26}/></button>
      </header>

      <section className="px-4 pt-5">
        <div className="flex items-center justify-between">
          <div><h2 className="text-lg font-black">محتوای من</h2><p className="mt-1 text-xs text-[var(--muted)]">مدیریت همه محتواها با نمایی نزدیک به اپ</p></div>
          <button onClick={()=>void refresh()} disabled={refreshing} aria-label="به‌روزرسانی" className="rounded-full border border-[var(--edge)] bg-[var(--surface)] p-2.5 text-[var(--muted)]"><RefreshCw size={18} className={refreshing?"animate-spin":""}/></button>
        </div>

        <div className="mt-5 flex gap-2 rounded-2xl bg-[var(--surface-raised)] p-1.5">
          {nav.map(({id,label,Icon})=><button key={id} onClick={()=>setTab(id)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-xs font-extrabold transition ${tab===id?"bg-[var(--surface)] text-[var(--ink)] shadow-sm":"text-[var(--muted)]"}`}><Icon size={17}/>{label}</button>)}
        </div>

        <div className="my-5 flex items-center justify-between">
          <div className="flex items-center gap-2"><span className="text-sm font-black">{tab==="posts"?"گالری پست‌ها":tab==="stories"?"استوری‌های اسنوکریا":"ریلزهای اسنوکریا"}</span><span className="rounded-full bg-[var(--surface-raised)] px-2 py-1 text-[10px] text-[var(--muted)]">{count.toLocaleString("fa-IR")}</span></div>
          <Link href={tab==="posts"?"/admin/posts":tab==="stories"?"/admin/stories":"/admin/reels"} className="flex items-center gap-1 text-xs font-bold text-[#139a72]">مدیریت کامل <ChevronLeft size={16}/></Link>
        </div>
        {error&&<p role="alert" className="mb-4 rounded-xl bg-red-500/10 p-3 text-xs text-red-500">{error}</p>}
        {loading?<div className="grid grid-cols-3 gap-1.5">{Array.from({length:9}).map((_,i)=><div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-[var(--surface-raised)]"/>)}</div>:
        tab==="reels"&&!reelsAvailable?<div className="rounded-2xl border border-[var(--edge)] bg-[var(--surface)] p-8 text-center"><Clapperboard className="mx-auto mb-3 text-[#17a477]" size={30}/><p className="font-black">زیرساخت ریلز در حال فعال‌سازی</p><p className="mt-2 text-xs leading-6 text-[var(--muted)]">برای ذخیره ریلز باید جدول مربوطه در Supabase ایجاد شود.</p><Link href="/admin/reels" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#087c43] px-4 py-3 text-xs font-bold text-white">رفتن به مدیریت ریلز <ChevronLeft size={16}/></Link></div>:
        count===0?<div className="rounded-2xl border border-dashed border-[var(--edge)] bg-[var(--surface)] px-5 py-14 text-center"><ImagePlus className="mx-auto text-[var(--muted)]" size={34}/><p className="mt-4 text-sm font-black">هنوز محتوایی در این بخش نیست</p><p className="mt-2 text-xs text-[var(--muted)]">با دکمه + اولین محتوا رو بساز.</p><button onClick={()=>setCreateOpen(true)} className="mt-5 rounded-xl bg-[#087c43] px-5 py-3 text-xs font-bold text-white">ساخت محتوا</button></div>:
        <div className="grid grid-cols-3 gap-1.5">
          {tab==="posts"&&posts.map(p=><Link key={p.id} href="/admin/posts" title={p.title} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--surface-raised)]">{p.cover_image_url?<img src={p.cover_image_url} alt={p.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition group-hover:scale-105"/>:<div className="flex h-full items-center justify-center"><BookOpen size={27} className="text-[var(--muted)]"/></div>}<span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-2 pt-8 text-[10px] font-bold text-white line-clamp-2">{p.title}</span>{p.status!=="published"&&<span className="absolute right-1.5 top-1.5 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-black text-black">پیش‌نویس</span>}</Link>)}
          {tab==="stories"&&stories.map(s=><Link key={s.id} href="/admin/stories" title={s.title} className="relative aspect-[9/16] overflow-hidden rounded-xl bg-[var(--surface-raised)]">{s.media_url?<img src={s.media_url} alt={s.title} loading="lazy" decoding="async" className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center"><Images size={26}/></div>}<span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-2 pt-8 text-[10px] font-bold text-white line-clamp-2">{s.title}</span></Link>)}
          {tab==="reels"&&reels.map(r=><Link key={r.id} href="/admin/reels" title={r.title} className="relative aspect-[9/16] overflow-hidden rounded-xl bg-[#152b2b]">{r.cover_url?<img src={r.cover_url} alt={r.title} loading="lazy" decoding="async" className="h-full w-full object-cover"/>:<Video className="absolute inset-0 m-auto text-white/60" size={32}/>}<Clapperboard size={16} className="absolute left-2 top-2 text-white drop-shadow"/><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-2 pt-8 text-[10px] font-bold text-white line-clamp-2">{r.title}</span></Link>)}
        </div>}
      </section>

      <section className="mx-4 mt-8 rounded-[22px] border border-[var(--edge)] bg-[var(--surface)] p-4">
        <div className="flex items-center gap-2"><Sparkles size={19} className="text-[#19ae85]"/><h2 className="text-sm font-black">ابزارهای استودیو</h2></div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href="/admin/posts" className="flex min-h-16 items-center gap-3 rounded-2xl bg-[var(--surface-raised)] p-3"><BookOpen size={23} className="text-[#dc344d]"/><span className="text-xs font-bold">ویرایش پست‌ها</span></Link>
          <Link href="/admin/stories" className="flex min-h-16 items-center gap-3 rounded-2xl bg-[var(--surface-raised)] p-3"><WandSparkles size={23} className="text-[#17a477]"/><span className="text-xs font-bold">استوری‌ساز</span></Link>
          <Link href="/admin/reels" className="flex min-h-16 items-center gap-3 rounded-2xl bg-[var(--surface-raised)] p-3"><Clapperboard size={23} className="text-[#ab7cec]"/><span className="text-xs font-bold">مدیریت ریلز</span></Link>
          <Link href="/admin/categories" className="flex min-h-16 items-center gap-3 rounded-2xl bg-[var(--surface-raised)] p-3"><Layers3 size={23} className="text-[#6e9de3]"/><span className="text-xs font-bold">دسته‌بندی‌ها</span></Link>
        </div>
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto flex h-[76px] max-w-[560px] items-center justify-around border-t border-[var(--edge)] bg-[var(--surface)]/95 px-4 pb-2 backdrop-blur-xl">
        <button onClick={()=>setTab("posts")} aria-label="پست‌ها" className={tab==="posts"?"text-[#087c43]":"text-[var(--muted)]"}><Grid2X2 size={25}/></button>
        <button onClick={()=>setTab("reels")} aria-label="ریلز" className={tab==="reels"?"text-[#087c43]":"text-[var(--muted)]"}><Clapperboard size={25}/></button>
        <button onClick={()=>setCreateOpen(true)} aria-label="افزودن محتوا" className="flex size-12 items-center justify-center rounded-2xl bg-[#d82c45] text-white shadow-md"><Plus size={28}/></button>
        <button onClick={()=>setTab("stories")} aria-label="استوری‌ها" className={tab==="stories"?"text-[#087c43]":"text-[var(--muted)]"}><Images size={25}/></button>
        <Link href="/admin" aria-label="پنل اصلی" className="text-[var(--muted)]"><MoreHorizontal size={27}/></Link>
      </nav>

      {createOpen&&<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setCreateOpen(false)}}>
        <section role="dialog" aria-modal="true" aria-label="ساخت محتوای جدید" className="w-full max-w-md rounded-t-[28px] bg-[var(--surface)] px-5 pb-8 pt-3 text-[var(--ink)] shadow-2xl sm:rounded-[28px]">
          <div className="mx-auto mb-5 h-1.5 w-11 rounded-full bg-[var(--edge)]"/>
          <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-black">ایجاد محتوا</h2><button onClick={()=>setCreateOpen(false)} aria-label="بستن"><X size={23}/></button></div>
          <p className="mb-5 text-xs text-[var(--muted)]">چه چیزی برای دنیای اسنوکر منتشر کنیم؟</p>
          {[{href:"/admin/reels",label:"ریلز",sub:"آپلود ویدیو عمودی و انتخاب کاور",Icon:Clapperboard,color:"#a977ec"},{href:"/admin/posts",label:"پست",sub:"عکس، اسلاید، کپشن و مقاله",Icon:Images,color:"#da3e56"},{href:"/admin/stories",label:"استوری",sub:"متن، تصویر، استیکر لینک و هایلایت",Icon:WandSparkles,color:"#15a67c"}].map(({href,label,sub,Icon,color})=><Link key={href} href={href} className="mb-2 flex items-center gap-3 rounded-2xl border border-[var(--edge)] p-3.5 transition hover:bg-[var(--surface-raised)]"><span className="flex size-12 items-center justify-center rounded-xl" style={{background:color+"19",color}}><Icon size={25}/></span><span className="flex-1"><span className="block text-sm font-black">{label}</span><span className="mt-1 block text-xs text-[var(--muted)]">{sub}</span></span><ChevronLeft size={20}/></Link>)}
        </section>
      </div>}
    </div>
  </main>;
}
