import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, BookOpen, Compass } from "lucide-react";

const cms = createClient(
  process.env.NEXT_PUBLIC_CMS_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_CMS_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);

const categoryLabel: Record<string,string> = {
  article:"مقاله", story:"داستان", news:"خبر", video:"ویدئو", "147":"147"
};

export const revalidate = 60;

export default async function DiscoverPage() {
  const { data: posts } = await cms
    .from("posts")
    .select("id,title,slug,excerpt,cover_image_url,category,published_at,is_featured")
    .eq("status","published")
    .order("published_at",{ascending:false});

  const items=posts ?? [];

  return (
    <main dir="rtl" className="min-h-screen bg-[#06111c] px-4 pb-28 pt-8 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="relative overflow-hidden rounded-[32px] border border-[#15905f]/15 bg-gradient-to-br from-[#0b302d] via-[#091e29] to-[#10131c] px-6 py-10 sm:px-10">
          <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-[#e3222b]/10 blur-[80px]"/>
          <div className="absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-[#20a86b]/15 blur-[80px]"/>
          <div className="relative">
            <p dir="ltr" className="text-[10px] font-black tracking-[.25em] text-[#55d49a]">DISCOVER SNOOKERIA</p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">دنیای اسنوکر را کشف کن</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/45">داستان، آموزش، تحلیل و چیزهایی که اسنوکر را از یک بازی به بخشی از زندگی تبدیل می‌کنند.</p>
          </div>
        </header>

        {items.length===0 ? (
          <section className="mt-6 rounded-[28px] border border-white/[.08] bg-[#091b25] px-6 py-14 text-center">
            <Compass size={28} className="mx-auto text-white/20"/>
            <h2 className="mt-4 font-bold">هنوز محتوایی منتشر نشده.</h2>
          </section>
        ) : (
          <section className="mt-7 grid gap-4 sm:grid-cols-2">
            {items.map((post,index)=>(
              <Link key={post.id} href={`/discover/${post.slug}`} className={`group overflow-hidden rounded-[28px] border border-white/[.07] bg-[#091b25] transition hover:-translate-y-1 hover:border-[#20a86b]/25 ${index===0 && post.is_featured ? "sm:col-span-2" : ""}`}>
                {post.cover_image_url ? <img src={post.cover_image_url} alt={post.title} className={`w-full object-cover transition duration-500 group-hover:scale-[1.02] ${index===0&&post.is_featured?"aspect-[2/1]":"aspect-video"}`}/> :
                <div className="flex aspect-video items-center justify-center bg-[#0a2927]"><BookOpen className="text-[#55d49a]/40"/></div>}
                <div className="p-5">
                  <div className="flex items-center justify-between"><span className="text-[9px] font-bold text-[#55d49a]">{categoryLabel[post.category]??post.category}</span>{post.is_featured&&<span className="rounded-full bg-[#e3222b]/10 px-2 py-1 text-[8px] text-[#ff5964]">منتخب</span>}</div>
                  <h2 className="mt-3 text-lg font-black leading-8">{post.title}</h2>
                  {post.excerpt&&<p className="mt-2 line-clamp-2 text-xs leading-6 text-white/38">{post.excerpt}</p>}
                  <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-[#55d49a]">ادامه مطلب <ArrowLeft size={12}/></div>
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
