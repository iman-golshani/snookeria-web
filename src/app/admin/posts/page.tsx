"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight, Check, ChevronDown, ExternalLink, FileText,
  ImagePlus, Loader2, Plus, Search, Settings2, Upload, X
} from "lucide-react";
import { cmsSupabase } from "@/lib/supabase/cms";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Post = {
  id: string; title: string; slug: string; category: string; status: string;
  published_at: string | null; created_at: string;
};

const categories = [
  ["article","مقاله"],["story","داستان"],["news","خبر"],["video","ویدئو"],["147","147"],
];

function makeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/ي/g, "ی").replace(/ك/g, "ک")
    .replace(/[^a-z0-9؀-ۿs-]/g, "")
    .replace(/s+/g, "-").replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function PostsAdminPage() {
  const router = useRouter();
  const [ready,setReady] = useState(false);
  const [posts,setPosts] = useState<Post[]>([]);
  const [showEditor,setShowEditor] = useState(false);
  const [saving,setSaving] = useState(false);
  const [uploading,setUploading] = useState(false);
  const [error,setError] = useState("");
  const [slugTouched,setSlugTouched] = useState(false);

  const [title,setTitle] = useState("");
  const [slug,setSlug] = useState("");
  const [category,setCategory] = useState("article");
  const [excerpt,setExcerpt] = useState("");
  const [body,setBody] = useState("");
  const [cover,setCover] = useState("");
  const [featured,setFeatured] = useState(false);

  const [seoTitle,setSeoTitle] = useState("");
  const [seoDescription,setSeoDescription] = useState("");
  const [focusKeyword,setFocusKeyword] = useState("");
  const [keywords,setKeywords] = useState("");
  const [canonical,setCanonical] = useState("");
  const [ogTitle,setOgTitle] = useState("");
  const [ogDescription,setOgDescription] = useState("");
  const [ogImage,setOgImage] = useState("");
  const [robotsIndex,setRobotsIndex] = useState(true);
  const [robotsFollow,setRobotsFollow] = useState(true);
  const [schemaType,setSchemaType] = useState("Article");

  async function loadPosts() {
    const { data } = await cmsSupabase
      .from("posts")
      .select("id,title,slug,category,status,published_at,created_at")
      .order("created_at",{ascending:false});
    setPosts((data ?? []) as Post[]);
  }

  useEffect(() => {
    async function boot() {
      const { data } = await cmsSupabase.auth.getSession();
      if (!data.session) { router.replace("/admin/login"); return; }
      await loadPosts();
      setReady(true);
    }
    boot();
  }, [router]);

  useEffect(() => {
    if (!slugTouched) setSlug(makeSlug(title));
  }, [title,slugTouched]);

  const previewTitle = seoTitle.trim() || title.trim() || "عنوان مطلب";
  const previewDescription = seoDescription.trim() || excerpt.trim() || "توضیحات این مطلب در نتایج جستجو نمایش داده می‌شود.";
  const publicUrl = useMemo(() => `https://snookeria.ir/discover/${slug || "slug"}`,[slug]);

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true); setError("");
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `posts/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await cmsSupabase.storage.from("cms-media").upload(path,file,{upsert:false});
    if (uploadError) { setError("آپلود تصویر انجام نشد: " + uploadError.message); setUploading(false); return; }
    const { data } = cmsSupabase.storage.from("cms-media").getPublicUrl(path);
    setCover(data.publicUrl);
    if (!ogImage) setOgImage(data.publicUrl);
    setUploading(false);
  }

  function reset() {
    setTitle(""); setSlug(""); setSlugTouched(false); setCategory("article");
    setExcerpt(""); setBody(""); setCover(""); setFeatured(false);
    setSeoTitle(""); setSeoDescription(""); setFocusKeyword(""); setKeywords("");
    setCanonical(""); setOgTitle(""); setOgDescription(""); setOgImage("");
    setRobotsIndex(true); setRobotsFollow(true); setSchemaType("Article"); setError("");
  }

  async function save(status: "draft"|"published") {
    if (!title.trim()) { setError("عنوان مطلب را وارد کنید."); return; }
    if (!slug.trim()) { setError("Slug مطلب خالی است."); return; }
    setSaving(true); setError("");
    const now = new Date().toISOString();
    const payload = {
      title:title.trim(), slug:slug.trim(), excerpt:excerpt.trim() || null, body:body || null,
      cover_image_url:cover || null, category, status, is_featured:featured,
      published_at: status === "published" ? now : null, updated_at:now,
      seo_title:seoTitle.trim() || null, seo_description:seoDescription.trim() || null,
      focus_keyword:focusKeyword.trim() || null,
      seo_keywords:keywords.split(",").map(x=>x.trim()).filter(Boolean),
      canonical_url:canonical.trim() || null,
      og_title:ogTitle.trim() || null, og_description:ogDescription.trim() || null,
      og_image_url:ogImage.trim() || cover || null,
      robots_index:robotsIndex, robots_follow:robotsFollow, schema_type:schemaType,
    };
    const { error: saveError } = await cmsSupabase.from("posts").insert(payload);
    setSaving(false);
    if (saveError) { setError(saveError.code === "23505" ? "این Slug قبلاً استفاده شده است." : saveError.message); return; }
    reset(); setShowEditor(false); await loadPosts();
  }

  if (!ready) return <main className="min-h-screen bg-[#06111c]"/>;

  if (!showEditor) return (
    <main dir="rtl" className="min-h-screen bg-[#06111c] px-4 py-6 text-white sm:px-7">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[.08] bg-[#0b202a] text-white/50"><ArrowRight size={17}/></Link>
            <div><p className="text-[10px] text-[#55d49a]">CONTENT</p><h1 className="mt-1 text-2xl font-black">مطالب</h1></div>
          </div>
          <button onClick={()=>{reset();setShowEditor(true)}} className="flex h-10 items-center gap-2 rounded-2xl bg-[#e3222b] px-4 text-xs font-bold shadow-[0_8px_30px_rgba(227,34,43,.18)]"><Plus size={16}/> مطلب جدید</button>
        </header>

        <div className="mt-7 overflow-hidden rounded-[26px] border border-white/[.07] bg-[#091b25]/80">
          {posts.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#169260]/12 text-[#55d49a]"><FileText size={20}/></div>
              <h2 className="mt-4 text-sm font-bold">هنوز مطلبی نداریم</h2>
              <p className="mt-2 text-xs text-white/30">اولین محتوای واقعی اسنوکریا را بساز.</p>
            </div>
          ) : posts.map(post=>(
            <div key={post.id} className="flex items-center justify-between border-b border-white/[.055] px-4 py-4 last:border-0 sm:px-5">
              <div className="min-w-0"><p className="truncate text-sm font-bold">{post.title}</p><p dir="ltr" className="mt-1 truncate text-left text-[10px] text-white/25">{post.slug}</p></div>
              <span className={`mr-4 shrink-0 rounded-full px-2.5 py-1 text-[9px] ${post.status==="published"?"bg-[#169260]/12 text-[#55d49a]":"bg-white/[.05] text-white/35"}`}>{post.status==="published"?"منتشر شده":"پیش‌نویس"}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );

  return (
    <main dir="rtl" className="min-h-screen bg-[#06111c] text-white">
      <div className="sticky top-0 z-30 border-b border-white/[.07] bg-[#06111c]/90 px-4 py-3 backdrop-blur-xl sm:px-7">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button onClick={()=>setShowEditor(false)} className="flex items-center gap-2 text-xs text-white/50"><X size={17}/> بستن</button>
          <div className="flex gap-2">
            <button disabled={saving} onClick={()=>save("draft")} className="h-10 rounded-xl border border-white/[.09] bg-[#0b202a] px-4 text-xs font-bold text-white/65">ذخیره پیش‌نویس</button>
            <button disabled={saving} onClick={()=>save("published")} className="flex h-10 items-center gap-2 rounded-xl bg-[#e3222b] px-4 text-xs font-black disabled:opacity-50">{saving?<Loader2 className="animate-spin" size={15}/>:<Check size={15}/>} انتشار</button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-7 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {error && <div className="rounded-2xl border border-[#e3222b]/20 bg-[#e3222b]/8 px-4 py-3 text-xs text-[#ff6871]">{error}</div>}

          <section className="rounded-[26px] border border-white/[.07] bg-[#091b25]/75 p-5 sm:p-6">
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="عنوان مطلب..." className="w-full bg-transparent text-2xl font-black outline-none placeholder:text-white/18 sm:text-3xl"/>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#06151e] px-3 py-2 text-[10px] text-white/30">
              <span dir="ltr">snookeria.ir/discover/</span>
              <input dir="ltr" value={slug} onChange={e=>{setSlugTouched(true);setSlug(makeSlug(e.target.value))}} className="min-w-0 flex-1 bg-transparent text-left text-[#55d49a] outline-none"/>
            </div>
            <textarea value={excerpt} onChange={e=>setExcerpt(e.target.value)} rows={3} placeholder="خلاصه کوتاه مطلب..." className="mt-4 w-full resize-none rounded-2xl border border-white/[.07] bg-[#071821] p-4 text-sm leading-7 outline-none placeholder:text-white/20 focus:border-[#1b9b68]/35"/>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between px-1"><h2 className="text-sm font-bold">متن مطلب</h2><span className="text-[9px] text-white/25">RICH TEXT EDITOR</span></div>
            <RichTextEditor value={body} onChange={setBody}/>
          </section>

          <section className="rounded-[26px] border border-[#1b9b68]/15 bg-gradient-to-br from-[#0b292b]/80 to-[#081923]/90 p-5 sm:p-6">
            <div className="flex items-center gap-3"><Search size={18} className="text-[#55d49a]"/><div><p className="text-[10px] text-[#55d49a]">SEO</p><h2 className="text-base font-black">بهینه‌سازی برای گوگل</h2></div></div>
            <div className="mt-5 grid gap-4">
              <Field label="عنوان سئو" value={seoTitle} set={setSeoTitle} hint={`${seoTitle.length}/60`}/>
              <Field label="Meta Description" value={seoDescription} set={setSeoDescription} textarea hint={`${seoDescription.length}/160`}/>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="کلمه کلیدی اصلی" value={focusKeyword} set={setFocusKeyword}/><Field label="کلمات کلیدی" value={keywords} set={setKeywords} placeholder="اسنوکر، آموزش اسنوکر، ..."/></div>
            </div>

            <div className="mt-6 rounded-2xl bg-white p-4 text-left" dir="ltr">
              <p className="truncate text-xs text-[#188038]">{publicUrl}</p>
              <p className="mt-1.5 text-lg leading-6 text-[#1a0dab]">{previewTitle}</p>
              <p className="mt-1 text-xs leading-5 text-[#4d5156]">{previewDescription.slice(0,160)}</p>
            </div>

            <details className="mt-5 border-t border-white/[.07] pt-4">
              <summary className="cursor-pointer text-xs font-bold text-white/55">تنظیمات پیشرفته SEO</summary>
              <div className="mt-4 grid gap-4">
                <Field label="Canonical URL" value={canonical} set={setCanonical} dir="ltr"/>
                <div className="grid gap-4 sm:grid-cols-2"><Field label="Open Graph Title" value={ogTitle} set={setOgTitle}/><Field label="OG Image URL" value={ogImage} set={setOgImage} dir="ltr"/></div>
                <Field label="Open Graph Description" value={ogDescription} set={setOgDescription} textarea/>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="text-xs text-white/45">Schema<select value={schemaType} onChange={e=>setSchemaType(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/[.08] bg-[#071821] px-3 text-white outline-none"><option>Article</option><option>NewsArticle</option><option>BlogPosting</option><option>VideoObject</option></select></label>
                  <Toggle label="Index" value={robotsIndex} set={setRobotsIndex}/>
                  <Toggle label="Follow" value={robotsFollow} set={setRobotsFollow}/>
                </div>
              </div>
            </details>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[24px] border border-white/[.07] bg-[#091b25]/80 p-5">
            <p className="text-xs font-bold">تنظیمات انتشار</p>
            <label className="mt-4 block text-[10px] text-white/35">دسته‌بندی<select value={category} onChange={e=>setCategory(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/[.08] bg-[#071821] px-3 text-xs text-white outline-none">{categories.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
            <label className="mt-4 flex items-center justify-between rounded-xl bg-[#071821] px-3 py-3 text-xs text-white/55"><span>مطلب ویژه</span><input type="checkbox" checked={featured} onChange={e=>setFeatured(e.target.checked)} className="accent-[#20a86b]"/></label>
          </section>

          <section className="rounded-[24px] border border-[#1b9b68]/14 bg-[#092522]/70 p-5">
            <div className="flex items-center gap-2"><ImagePlus size={16} className="text-[#55d49a]"/><p className="text-xs font-bold">تصویر شاخص</p></div>
            {cover ? <div className="mt-4 overflow-hidden rounded-2xl border border-white/[.07]"><img src={cover} alt="" className="aspect-video w-full object-cover"/><button onClick={()=>setCover("")} className="w-full bg-[#071821] py-2 text-[10px] text-[#ff6871]">حذف تصویر</button></div> :
            <label className="mt-4 flex aspect-video cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#35b77d]/25 bg-[#071b1d] text-center">
              {uploading?<Loader2 size={20} className="animate-spin text-[#55d49a]"/>:<Upload size={20} className="text-[#55d49a]"/>}
              <span className="mt-2 text-[10px] text-white/35">{uploading?"در حال آپلود...":"انتخاب و آپلود تصویر"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={uploadImage} disabled={uploading}/>
            </label>}
          </section>

          <section className="rounded-[24px] border border-white/[.07] bg-[#091b25]/80 p-5">
            <div className="flex items-center gap-2"><Settings2 size={15} className="text-white/35"/><p className="text-xs font-bold">وضعیت SEO</p></div>
            <div className="mt-4 space-y-2 text-[10px]">
              <SeoCheck ok={title.length>10} text="عنوان مناسب"/>
              <SeoCheck ok={seoDescription.length>=80 && seoDescription.length<=160} text="Meta Description"/>
              <SeoCheck ok={!!focusKeyword} text="کلمه کلیدی اصلی"/>
              <SeoCheck ok={!!cover} text="تصویر شاخص"/>
              <SeoCheck ok={body.length>300} text="محتوای کافی"/>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function Field({label,value,set,textarea=false,hint,placeholder,dir}: {label:string;value:string;set:(v:string)=>void;textarea?:boolean;hint?:string;placeholder?:string;dir?:"ltr"|"rtl"}) {
  const cls="mt-2 w-full rounded-xl border border-white/[.08] bg-[#071821] px-3 py-3 text-xs text-white outline-none focus:border-[#1b9b68]/40";
  return <label className="text-[10px] text-white/40"><span className="flex justify-between"><span>{label}</span>{hint&&<span dir="ltr">{hint}</span>}</span>{textarea?<textarea dir={dir} rows={3} value={value} onChange={e=>set(e.target.value)} placeholder={placeholder} className={cls+" resize-none"}/>:<input dir={dir} value={value} onChange={e=>set(e.target.value)} placeholder={placeholder} className={cls}/>}</label>;
}
function Toggle({label,value,set}:{label:string;value:boolean;set:(v:boolean)=>void}) { return <label className="mt-5 flex items-center justify-between rounded-xl bg-[#071821] px-3 py-3 text-xs text-white/55"><span>{label}</span><input type="checkbox" checked={value} onChange={e=>set(e.target.checked)} className="accent-[#20a86b]"/></label>; }
function SeoCheck({ok,text}:{ok:boolean;text:string}) { return <div className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${ok?"bg-[#35c986]":"bg-white/15"}`}/><span className={ok?"text-white/55":"text-white/25"}>{text}</span></div>; }
