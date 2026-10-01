import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, BookOpen } from "lucide-react";

const cms=createClient(process.env.NEXT_PUBLIC_CMS_SUPABASE_URL!,process.env.NEXT_PUBLIC_CMS_SUPABASE_ANON_KEY!,{auth:{persistSession:false}});
const labels:Record<string,string>={article:"مقاله",story:"داستان",news:"خبر",video:"ویدئو","147":"147"};
export const revalidate=60;

export default async function DiscoverPage(){
 const {data}=await cms.from("posts").select("id,title,slug,excerpt,cover_image_url,category,published_at,is_featured").eq("status","published").order("published_at",{ascending:false});
 const posts=data??[];
 return <main dir="rtl" className="min-h-screen bg-[#06111c] pb-28 text-white">
   <div className="mx-auto max-w-3xl px-4 sm:px-6">
     <div className="flex h-16 items-center justify-between">
       <div><p className="text-[9px] font-black tracking-[.16em] text-[#55d49a]">DISCOVER</p><h1 className="mt-0.5 text-xl font-black">کشف</h1></div>
       <span className="rounded-full bg-[#0a2927] px-3 py-1.5 text-[9px] text-[#55d49a]">{posts.length.toLocaleString("fa-IR")} مطلب</span>
     </div>

     <div className="flex gap-2 overflow-x-auto pb-4 [scrollbar-width:none]">
       {["همه","مقاله","داستان","ویدئو","147"].map((x,i)=><span key={x} className={`shrink-0 rounded-full px-3.5 py-2 text-[10px] font-bold ${i===0?"bg-[#e3222b] text-white":"border border-white/[.07] bg-[#0a1b25] text-white/40"}`}>{x}</span>)}
     </div>

     {posts.length===0 ? <div className="mt-3 flex min-h-56 flex-col items-center justify-center rounded-[24px] bg-[#091b25]"><BookOpen size={22} className="text-white/15"/><p className="mt-3 text-xs text-white/35">هنوز محتوایی منتشر نشده.</p></div>:
     <section className="space-y-2.5">
       {posts.map(post=><Link key={post.id} href={`/discover/${post.slug}`} className="group flex min-h-[112px] gap-3 rounded-[22px] border border-white/[.055] bg-[#091b25]/85 p-2.5 transition active:scale-[.99] sm:min-h-[126px]">
         <div className="h-[92px] w-[118px] shrink-0 overflow-hidden rounded-[16px] bg-[#0a2927] sm:h-[106px] sm:w-[150px]">
           {post.cover_image_url?<img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center"><BookOpen size={18} className="text-[#55d49a]/30"/></div>}
         </div>
         <div className="flex min-w-0 flex-1 flex-col py-1">
           <div className="flex items-center gap-2"><span className="text-[8px] font-black text-[#55d49a]">{labels[post.category]??post.category}</span>{post.is_featured&&<span className="h-1 w-1 rounded-full bg-[#e3222b]"/>}</div>
           <h2 className="mt-1.5 line-clamp-2 text-[13px] font-black leading-6 sm:text-sm">{post.title}</h2>
           {post.excerpt&&<p className="mt-1 line-clamp-1 text-[10px] text-white/28">{post.excerpt}</p>}
           <div className="mt-auto flex items-center gap-1 text-[9px] font-bold text-white/25 group-hover:text-[#55d49a]">بخوان <ArrowLeft size={11}/></div>
         </div>
       </Link>)}
     </section>}
   </div>
 </main>;
}
