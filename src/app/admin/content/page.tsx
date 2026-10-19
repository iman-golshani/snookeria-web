"use client";

import {useEffect,useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {
  ArrowLeft, BookOpen, CheckCircle2, ChevronLeft, CirclePlus,
  Images, Layers3, LayoutGrid, Sparkles, WandSparkles
} from "lucide-react";
import {cmsSupabase} from "@/lib/supabase/cms";

type RecentPost={id:string;title:string;slug:string;status:string;created_at:string};
type Dashboard={posts:number;published:number;stories:number;recent:RecentPost[]};

const tiles=[
  {href:"/admin/posts",label:"پست و مقاله",detail:"پست، اسلاید، کپشن و پیش‌نویس",icon:Images,accent:"#dc344d",soft:"rgba(220,52,77,.13)"},
  {href:"/admin/stories",label:"استوری و هایلایت",detail:"متن‌های نامحدود، استیکر لینک و هایلایت",icon:WandSparkles,accent:"#17a477",soft:"rgba(23,164,119,.12)"},
  {href:"/admin/categories",label:"دسته‌بندی‌ها",detail:"موضوع‌ها و تصویر هر دسته",icon:Layers3,accent:"#6e9de3",soft:"rgba(110,157,227,.13)"},
];

export default function ContentHub(){
  const router=useRouter();
  const [ready,setReady]=useState(false);
  const [error,setError]=useState("");
  const [dashboard,setDashboard]=useState<Dashboard>({posts:0,published:0,stories:0,recent:[]});

  useEffect(()=>{
    let active=true;
    void(async()=>{
      const {data}=await cmsSupabase.auth.getSession();
      if(!data.session){router.replace("/admin/login");return}
      const [all,published,stories,recent]=await Promise.all([
        cmsSupabase.from("posts").select("id",{head:true,count:"exact"}),
        cmsSupabase.from("posts").select("id",{head:true,count:"exact"}).eq("status","published"),
        cmsSupabase.from("snookeria_stories").select("id",{head:true,count:"exact"}),
        cmsSupabase.from("posts").select("id,title,slug,status,created_at").order("created_at",{ascending:false}).limit(5),
      ]);
      if(!active)return;
      setDashboard({posts:all.count??0,published:published.count??0,stories:stories.count??0,recent:recent.data??[]});
      setError(all.error?.message||recent.error?.message||"");
      setReady(true);
    })();
    return()=>{active=false};
  },[router]);

  return <main dir="rtl" className="min-h-screen bg-[var(--page)] px-4 pb-28 pt-7 text-[var(--ink)]">
    <div className="mx-auto max-w-3xl">
      <div className="mb-7 flex items-center justify-between">
        <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-[var(--edge)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--muted)]"><ArrowLeft size={15}/> مدیریت اصلی</Link>
        <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[.18em] text-[var(--muted)]"><span className="h-2 w-2 rounded-full bg-[#17a477]"/> SNOOKERIA STUDIO</span>
      </div>

      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#101d30] px-5 py-7 text-white shadow-2xl sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full bg-[#167d62]/20 blur-3xl"/>
        <div className="pointer-events-none absolute -right-24 -bottom-28 h-64 w-64 rounded-full bg-[#cf2945]/15 blur-3xl"/>
        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#78d4b1]"><Sparkles size={15}/> استودیوی محتوای اسنوکریا</div>
          <h1 className="mt-3 text-2xl font-black leading-relaxed sm:text-3xl">امروز چی منتشر کنیم؟</h1>
          <p className="mt-2 max-w-md text-xs leading-7 text-slate-300">یک‌بار منتشر کن؛ در سایت و اپ اسنوکریا نمایش بده. ساده، سریع و بدون صفحه‌های اضافه.</p>
          <div className="mt-6 grid grid-cols-2 gap-2"><Link href="/admin/posts" className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-2xl bg-[#d8304b] px-2 py-3 text-xs font-black text-white shadow-lg shadow-red-900/20 sm:text-sm"><CirclePlus size={18}/> مطلب جدید</Link><Link href="/admin/stories" className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 px-2 py-3 text-xs font-black text-white sm:text-sm"><WandSparkles size={18}/> ساخت استوری</Link></div>
        </div>
      </section>

      <div className="my-5 grid grid-cols-3 gap-2 sm:gap-3">
        {[
          {title:"کل مطالب",value:dashboard.posts,icon:BookOpen},
          {title:"منتشرشده",value:dashboard.published,icon:CheckCircle2},
          {title:"استوری‌ها",value:dashboard.stories,icon:LayoutGrid},
        ].map(({title,value,icon:Icon})=><div key={title} className="rounded-2xl border border-[var(--edge)] bg-[var(--surface)] px-3 py-4 text-center shadow-sm">
          <Icon size={17} className="mx-auto text-[#2baa7e]"/>
          <p className="mt-3 text-2xl font-black">{ready?value.toLocaleString("fa-IR"):"—"}</p>
          <p className="mt-1 text-[10px] text-[var(--muted)]">{title}</p>
        </div>)}
      </div>

      <h2 className="mb-3 mt-8 text-base font-black">انتشار و مدیریت</h2>
      <div className="space-y-3">{tiles.map(({href,label,detail,icon:Icon,accent,soft})=>
        <Link href={href} key={href} className="group flex items-center gap-4 rounded-[20px] border border-[var(--edge)] bg-[var(--surface)] p-4 shadow-sm transition hover:border-[#167d62]/40 hover:shadow-lg active:scale-[.99]">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl" style={{background:soft,color:accent}}><Icon size={25}/></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-black">{label}</span><span className="mt-1 block text-xs leading-6 text-[var(--muted)]">{detail}</span></span>
          <ChevronLeft size={20} className="text-[var(--muted)] transition group-hover:-translate-x-1"/>
        </Link>)}</div>

      <section className="mt-8 rounded-[22px] border border-[var(--edge)] bg-[var(--surface)] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-black">آخرین مطالب</h2>
          <Link href="/admin/posts" className="flex items-center gap-1 text-xs font-bold text-[#24ae84]">همه مطالب <ChevronLeft size={15}/></Link>
        </div>
        {!ready?<p className="py-8 text-center text-xs text-[var(--muted)]">در حال بارگذاری...</p>:
         error?<p role="alert" className="text-xs text-red-400">دریافت آمار: {error}</p>:
         dashboard.recent.length===0?<p className="py-8 text-center text-xs text-[var(--muted)]">هنوز مطلبی ثبت نشده است.</p>:
         <div className="divide-y divide-[var(--edge)]">{dashboard.recent.map(post=>
           <div key={post.id} className="flex items-center gap-3 py-3">
             <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-raised)]"><BookOpen size={17}/></span>
             <div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{post.title}</p><span className={post.status==="published"?"mt-1 block text-[10px] text-emerald-500":"mt-1 block text-[10px] text-amber-400"}>{post.status==="published"?"منتشرشده":"پیش‌نویس"}</span></div>
             <Link href={post.status==="published"?"/discover/"+encodeURIComponent(post.slug):"/admin/posts"} className="rounded-full border border-[var(--edge)] p-2 text-[var(--muted)]" aria-label={"مشاهده "+post.title}><ChevronLeft size={16}/></Link>
           </div>)}</div>}
      </section>
    </div>
  </main>;
}
