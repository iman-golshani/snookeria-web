"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight, Check, ExternalLink, FileText,
  ImagePlus, Loader2, Plus, Search, Settings2, Upload, X, Pencil, Trash2, ArrowUp, ArrowDown, Images
} from "lucide-react";
import { cmsSupabase } from "@/lib/supabase/cms";
import RichTextEditor from "@/components/admin/RichTextEditor";
import SquareImageCropper from "@/components/admin/SquareImageCropper";
import { makeEnglishSlug } from "@/lib/slug";

type PostMedia = { id:string; media_url:string; media_type:"image"|"video"; alt_text:string|null; sort_order:number };

type Post = {
  id: string; title: string; slug: string; category: string; status: string;
  published_at: string | null; created_at: string;
};

const defaultCategories = [
  ["article","مقاله"],["story","داستان"],["news","خبر"],["video","ویدئو"],["147","147"],
];

export default function PostsAdminPage() {
  const router = useRouter();
  const [ready,setReady] = useState(false);
  const [posts,setPosts] = useState<Post[]>([]);
  const [categories,setCategories] = useState<string[][]>(defaultCategories);
  const [showEditor,setShowEditor] = useState(false);
  const [saving,setSaving] = useState(false);
  const [uploading,setUploading] = useState(false);
  const [cropFile,setCropFile] = useState<File|null>(null);
  const [error,setError] = useState("");
  const [slugTouched,setSlugTouched] = useState(false);
  const [editingId,setEditingId] = useState<string | null>(null);

  const [title,setTitle] = useState("");
  const [slug,setSlug] = useState("");
  const [selectedCategories,setSelectedCategories] = useState<string[]>(["snookeria"]);
  const [excerpt,setExcerpt] = useState("");
  const [body,setBody] = useState("");
  const [cover,setCover] = useState("");
  const [featured,setFeatured] = useState(false);
  const [media,setMedia] = useState<PostMedia[]>([]);
  const [mediaUploading,setMediaUploading] = useState(false);

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
      const {data:cats}=await cmsSupabase.from("post_categories").select("slug,name").eq("is_active",true).order("sort_order");
      if(cats?.length)setCategories(cats.map(c=>[c.slug,c.name]));
      setReady(true);
    }
    boot();
  }, [router]);

  useEffect(() => {
    if (!slugTouched) setSlug(makeEnglishSlug(title));
  }, [title,slugTouched]);

  const previewTitle = seoTitle.trim() || title.trim() || "عنوان مطلب";
  const previewDescription = seoDescription.trim() || excerpt.trim() || "توضیحات این مطلب در نتایج جستجو نمایش داده می‌شود.";
  const publicUrl = useMemo(() => `https://snookeria.ir/discover/${slug || "slug"}`,[slug]);

  async function uploadCarousel(event: ChangeEvent<HTMLInputElement>) {
    const files=Array.from(event.target.files??[]); if(!files.length) return;
    if(!editingId){ setError("برای افزودن اسلایدها، ابتدا پست را یک‌بار به‌صورت پیش‌نویس ذخیره کنید."); return; }
    setMediaUploading(true); setError("");
    for(const file of files){
      const ext=file.name.split(".").pop()?.toLowerCase()||"jpg";
      const path=`posts/${editingId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const {error:upErr}=await cmsSupabase.storage.from("cms-media").upload(path,file,{upsert:false});
      if(upErr){setError("آپلود یکی از رسانه‌ها انجام نشد: "+upErr.message);continue;}
      const {data:urlData}=cmsSupabase.storage.from("cms-media").getPublicUrl(path);
      const type=file.type.startsWith("video/")?"video":"image";
      const {data:row,error:dbErr}=await cmsSupabase.from("post_media").insert({post_id:editingId,media_url:urlData.publicUrl,media_type:type,alt_text:title||null,sort_order:media.length}).select("*").single();
      if(dbErr)setError("ثبت رسانه انجام نشد: "+dbErr.message); else if(row)setMedia(v=>[...v,row as PostMedia]);
    }
    setMediaUploading(false); event.target.value="";
  }

  async function removeMedia(item:PostMedia){
    const {error}=await cmsSupabase.from("post_media").delete().eq("id",item.id);
    if(error){setError(error.message);return;} setMedia(v=>v.filter(x=>x.id!==item.id));
  }
  async function moveMedia(index:number,delta:number){
    const j=index+delta;if(j<0||j>=media.length)return;
    const next=[...media];[next[index],next[j]]=[next[j],next[index]];
    setMedia(next);
    await Promise.all(next.map((m,i)=>cmsSupabase.from("post_media").update({sort_order:i}).eq("id",m.id)));
  }

  function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file=event.target.files?.[0];event.target.value="";
    if(file){setError("");setCropFile(file)}
  }
  async function uploadCroppedCover(file:File){
    setCropFile(null);setUploading(true);setError("");
    const path="posts/"+Date.now()+"-"+crypto.randomUUID()+".jpg";
    const {error:uploadError}=await cmsSupabase.storage.from("cms-media").upload(path,file,{contentType:"image/jpeg",upsert:false});
    if(uploadError){setError("آپلود تصویر انجام نشد: "+uploadError.message);setUploading(false);return}
    const {data}=cmsSupabase.storage.from("cms-media").getPublicUrl(path);
    setCover(data.publicUrl);if(!ogImage)setOgImage(data.publicUrl);setUploading(false);
  }

  function reset() {
    setEditingId(null); setTitle(""); setSlug(""); setSlugTouched(false); setSelectedCategories(["snookeria"]);
    setExcerpt(""); setBody(""); setCover(""); setFeatured(false); setMedia([]);
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
      cover_image_url:cover || null, category:selectedCategories.find(x=>x!=="snookeria")||"snookeria", status, is_featured:featured,
      published_at: status === "published" ? now : null, updated_at:now,
      seo_title:seoTitle.trim() || null, seo_description:seoDescription.trim() || null,
      focus_keyword:focusKeyword.trim() || null,
      seo_keywords:keywords.split(",").map(x=>x.trim()).filter(Boolean),
      canonical_url:canonical.trim() || null,
      og_title:ogTitle.trim() || null, og_description:ogDescription.trim() || null,
      og_image_url:ogImage.trim() || cover || null,
      robots_index:robotsIndex, robots_follow:robotsFollow, schema_type:schemaType,
    };
    const query = editingId
      ? cmsSupabase.from("posts").update(payload).eq("id", editingId).select("id").single()
      : cmsSupabase.from("posts").insert(payload).select("id").single();
    const {data:savedPost,error:saveError}=await query;
    if (saveError){setSaving(false);setError(saveError.code === "23505" ? "این Slug قبلاً استفاده شده است." : saveError.message);return;}
    const postId=savedPost?.id;
    if(postId){const {error:deleteError}=await cmsSupabase.from("post_category_links").delete().eq("post_id",postId).neq("category_slug","snookeria");if(deleteError){setSaving(false);setError("ذخیره مطلب انجام شد اما دسته‌بندی‌ها به‌روزرسانی نشدند: "+deleteError.message);return;}
    const links=[...new Set(["snookeria",...selectedCategories])].filter(x=>x!=="snookeria").map(category_slug=>({post_id:postId,category_slug}));
    if(links.length){const {error:linkError}=await cmsSupabase.from("post_category_links").upsert(links,{onConflict:"post_id,category_slug"});if(linkError){setSaving(false);setError("مطلب ذخیره شد ولی دسته‌بندی‌های اضافی ثبت نشدند: "+linkError.message);return;}}}
    setSaving(false);
    reset(); setShowEditor(false); await loadPosts();
  }

  async function editPost(id:string) {
    setError("");
    const { data, error } = await cmsSupabase.from("posts").select("*").eq("id",id).single();
    if(error || !data) { setError("بارگذاری مطلب انجام نشد."); return; }
    setEditingId(data.id); setTitle(data.title||""); setSlug(data.slug||""); setSlugTouched(true);
    setSelectedCategories(["snookeria",...(data.category&&data.category!=="snookeria"?[data.category]:[])]); setExcerpt(data.excerpt||""); setBody(data.body||"");
    setCover(data.cover_image_url||""); setFeatured(!!data.is_featured);
    setSeoTitle(data.seo_title||""); setSeoDescription(data.seo_description||"");
    setFocusKeyword(data.focus_keyword||""); setKeywords((data.seo_keywords||[]).join(", "));
    setCanonical(data.canonical_url||""); setOgTitle(data.og_title||"");
    setOgDescription(data.og_description||""); setOgImage(data.og_image_url||"");
    setRobotsIndex(data.robots_index!==false); setRobotsFollow(data.robots_follow!==false);
    setSchemaType(data.schema_type||"Article");
    const {data:assigned}=await cmsSupabase.from("post_category_links").select("category_slug").eq("post_id",id);
    if(assigned)setSelectedCategories([...new Set(["snookeria",...assigned.map(x=>x.category_slug)])]);
    const {data:mediaRows}=await cmsSupabase.from("post_media").select("*").eq("post_id",id).order("sort_order",{ascending:true});
    setMedia((mediaRows??[]) as PostMedia[]); setShowEditor(true);
  }

  async function deletePost(id:string,title:string) {
    if(!window.confirm(`مطلب «${title}» حذف شود؟ این کار قابل بازگشت نیست.`)) return;
    const { error } = await cmsSupabase.from("posts").delete().eq("id",id);
    if(error) { setError("حذف مطلب انجام نشد: "+error.message); return; }
    await loadPosts();
  }

  if (!ready) return <main className="min-h-screen bg-[var(--page)]"/>;

  if (!showEditor) return (
    <main dir="rtl" className="min-h-screen bg-[var(--page)] px-4 py-6 text-white sm:px-7">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[.08] bg-[var(--surface-raised)] text-[var(--muted)]"><ArrowRight size={17}/></Link>
            <div><p className="text-[10px] text-[#55d49a]">CONTENT</p><h1 className="mt-1 text-2xl font-black">مطالب</h1></div>
          </div>
          <button onClick={()=>{reset();setShowEditor(true)}} className="flex h-10 items-center gap-2 rounded-xl bg-[#e3222b] px-4 text-xs font-bold shadow-[0_8px_30px_rgba(227,34,43,.18)]"><Plus size={16}/> مطلب جدید</button>
        </header>

        <div className="mt-7 overflow-hidden rounded-[20px] border border-white/[.08] bg-[var(--surface)] shadow-[0_18px_50px_rgba(0,0,0,.18)]">
          {posts.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#169260]/12 text-[#55d49a]"><FileText size={20}/></div>
              <h2 className="mt-4 text-sm font-bold">هنوز مطلبی نداریم</h2>
              <p className="mt-2 text-xs text-[var(--muted)]">اولین محتوای واقعی اسنوکریا را بساز.</p>
            </div>
          ) : posts.map(post=>(
            <div key={post.id} className="group flex items-center justify-between border-b border-white/[.055] px-4 py-4 transition hover:bg-white/[.025] last:border-0 sm:px-5">
              <div className="min-w-0"><p className="truncate text-sm font-bold">{post.title}</p><p dir="ltr" className="mt-1 truncate text-left text-[10px] text-white/25">{post.slug}</p></div>
              <div className="mr-4 flex shrink-0 items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[9px] ${post.status==="published"?"bg-[#169260]/12 text-[#55d49a]":"bg-white/[.05] text-white/35"}`}>{post.status==="published"?"منتشر شده":"پیش‌نویس"}</span>
                {post.status==="published" && <Link href={`/discover/${post.slug}`} target="_blank" className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#15905f]/10 text-[#55d49a]" title="مشاهده"><ExternalLink size={13}/></Link>}
                <button onClick={()=>editPost(post.id)} className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[.04] text-white/45 hover:text-white" title="ویرایش"><Pencil size={13}/></button>
                <button onClick={()=>deletePost(post.id,post.title)} className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e3222b]/8 text-[#ff5964]/70 hover:text-[#ff5964]" title="حذف"><Trash2 size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );

  return (
    <main dir="rtl" className="min-h-screen bg-[var(--page)] text-white">
      <div className="sticky top-0 z-30 border-b border-white/[.07] bg-[var(--page)]/90 px-4 py-3 backdrop-blur-xl sm:px-7">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button onClick={()=>setShowEditor(false)} className="flex items-center gap-2 text-xs text-[var(--muted)]"><X size={17}/> بستن</button>
          <div className="flex gap-2">
            <button disabled={saving} onClick={()=>save("draft")} className="h-10 rounded-xl border border-white/[.09] bg-[var(--surface-raised)] px-4 text-xs font-bold text-white/65">ذخیره پیش‌نویس</button>
            <button disabled={saving} onClick={()=>save("published")} className="flex h-10 items-center gap-2 rounded-xl bg-[#e3222b] px-4 text-xs font-black disabled:opacity-50">{saving?<Loader2 className="animate-spin" size={15}/>:<Check size={15}/>} {editingId?"به‌روزرسانی و انتشار":"انتشار"}</button>
          </div>
        </div>
      </div>

      {cropFile&&<SquareImageCropper file={cropFile} onCancel={()=>setCropFile(null)} onDone={file=>void uploadCroppedCover(file)}/>}
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-7 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
                    <section className="rounded-[20px] border border-[#1b9b68]/14 bg-[#092522]/70 p-5">
            <div className="flex items-center gap-2"><ImagePlus size={16} className="text-[#55d49a]"/><p className="text-xs font-bold">تصویر شاخص</p></div>
            {cover ? <div className="mt-4 overflow-hidden rounded-2xl border border-white/[.07]"><img src={cover} alt="" className="aspect-square w-full object-cover"/><button onClick={()=>setCover("")} className="w-full bg-[var(--surface-raised)] py-2 text-[10px] text-[#ff6871]">حذف تصویر</button></div> :
            <label className="mt-4 flex aspect-square max-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#35b77d]/25 bg-[#071b1d] text-center">
              {uploading?<Loader2 size={20} className="animate-spin text-[#55d49a]"/>:<Upload size={20} className="text-[#55d49a]"/>}
              <span className="mt-2 text-[10px] text-white/35">{uploading?"در حال آپلود...":"انتخاب و آپلود تصویر"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={uploadImage} disabled={uploading}/>
            </label>}
          </section>


          {error && <div className="rounded-2xl border border-[#e3222b]/20 bg-[#e3222b]/8 px-4 py-3 text-xs text-[#ff6871]">{error}</div>}

          <section className="rounded-[20px] border border-white/[.08] bg-[var(--surface)] shadow-[0_14px_40px_rgba(0,0,0,.14)] p-5 sm:p-6">
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="عنوان مطلب..." className="w-full bg-transparent text-2xl font-black outline-none placeholder:text-white/18 sm:text-3xl"/>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#06151e] px-3 py-2 text-[10px] text-[var(--muted)]">
              <span dir="ltr">snookeria.ir/discover/</span>
              <input dir="ltr" value={slug} onChange={e=>{setSlugTouched(true);setSlug(makeEnglishSlug(e.target.value))}} className="min-w-0 flex-1 bg-transparent text-left text-[#55d49a] outline-none"/>
            </div>
            <textarea value={excerpt} onChange={e=>setExcerpt(e.target.value)} rows={3} placeholder="خلاصه کوتاه مطلب..." className="mt-4 w-full resize-none rounded-2xl border border-white/[.07] bg-[var(--surface-raised)] p-4 text-sm leading-7 outline-none placeholder:text-white/20 focus:border-[#1b9b68]/35"/>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between px-1"><h2 className="text-sm font-bold">متن مطلب</h2><span className="text-[9px] text-white/25">RICH TEXT EDITOR</span></div>
            <RichTextEditor value={body} onChange={setBody}/>
          </section>

          <section className="rounded-[20px] border border-[#1b9b68]/15 bg-gradient-to-br from-[#0b292b]/80 to-[#081923]/90 p-5 sm:p-6">
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
              <summary className="cursor-pointer text-xs font-bold text-[var(--muted)]">تنظیمات پیشرفته SEO</summary>
              <div className="mt-4 grid gap-4">
                <Field label="Canonical URL" value={canonical} set={setCanonical} dir="ltr"/>
                <div className="grid gap-4 sm:grid-cols-2"><Field label="Open Graph Title" value={ogTitle} set={setOgTitle}/><Field label="OG Image URL" value={ogImage} set={setOgImage} dir="ltr"/></div>
                <Field label="Open Graph Description" value={ogDescription} set={setOgDescription} textarea/>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="text-xs text-white/45">Schema<select value={schemaType} onChange={e=>setSchemaType(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/[.08] bg-[var(--surface-raised)] px-3 text-white outline-none"><option>Article</option><option>NewsArticle</option><option>BlogPosting</option><option>VideoObject</option></select></label>
                  <Toggle label="Index" value={robotsIndex} set={setRobotsIndex}/>
                  <Toggle label="Follow" value={robotsFollow} set={setRobotsFollow}/>
                </div>
              </div>
            </details>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[20px] border border-white/[.07] bg-[var(--surface)] p-5">
            <p className="text-xs font-bold">تنظیمات انتشار</p>
            <Link href="/admin/categories" className="mt-3 block text-xs text-red-400">مدیریت دسته‌بندی‌ها</Link><div className="mt-4 space-y-3"><p className="text-xs text-white/60">دسته‌بندی‌های مطلب (امکان انتخاب چند مورد)</p><label className="flex items-center gap-2 text-xs text-white"><input type="checkbox" checked disabled className="accent-red-500"/>اسنوکریا — دسته اصلی تمام مطالب</label>{categories.filter(([v])=>v!=="snookeria").map(([v,l])=><label key={v} className="flex items-center gap-2 text-xs text-white/75"><input type="checkbox" checked={selectedCategories.includes(v)} onChange={e=>setSelectedCategories(prev=>e.target.checked?[...new Set([...prev,v])]:prev.filter(x=>x!==v))} className="accent-red-500"/>{l}</label>)}</div>
            <label className="mt-4 flex items-center justify-between rounded-xl bg-[var(--surface-raised)] px-3 py-3 text-xs text-[var(--muted)]"><span>مطلب ویژه</span><input type="checkbox" checked={featured} onChange={e=>setFeatured(e.target.checked)} className="accent-[#20a86b]"/></label>
          </section>

          <section className="rounded-[20px] border border-white/[.07] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2"><Images size={16} className="text-[#55d49a]"/><p className="text-xs font-bold">اسلایدهای پست</p></div>
            <p className="mt-2 text-[10px] leading-5 text-[var(--muted)]">{editingId?"چند عکس یا ویدئو انتخاب کن؛ ترتیب همین لیست در Discover نمایش داده می‌شود.":"اول پست را به‌صورت پیش‌نویس ذخیره کن، سپس برای ویرایش بازش کن و اسلایدها را اضافه کن."}</p>
            {media.length>0&&<div className="mt-4 space-y-2">{media.map((m,i)=><div key={m.id} className="flex items-center gap-2 rounded-xl bg-[var(--surface-raised)] p-2">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/20">{m.media_type==="video"?<video src={m.media_url} className="h-full w-full object-cover"/>:<img src={m.media_url} alt="" className="h-full w-full object-cover"/>}</div>
              <span className="flex-1 text-[10px] text-white/45">اسلاید {(i+1).toLocaleString("fa-IR")} · {m.media_type==="video"?"ویدئو":"تصویر"}</span>
              <button onClick={()=>moveMedia(i,-1)} disabled={i===0} className="p-2 text-[var(--muted)] disabled:opacity-15"><ArrowUp size={13}/></button>
              <button onClick={()=>moveMedia(i,1)} disabled={i===media.length-1} className="p-2 text-[var(--muted)] disabled:opacity-15"><ArrowDown size={13}/></button>
              <button onClick={()=>removeMedia(m)} className="p-2 text-[#ff5964]"><Trash2 size={13}/></button>
            </div>)}</div>}
            <label className={`mt-4 flex min-h-20 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[#35b77d]/25 bg-[#071b1d] text-center ${!editingId?"pointer-events-none opacity-40":""}`}>
              {mediaUploading?<Loader2 size={19} className="animate-spin text-[#55d49a]"/>:<div><Plus size={18} className="mx-auto text-[#55d49a]"/><span className="mt-1 block text-[10px] text-[var(--muted)]">افزودن عکس / ویدئو</span></div>}
              <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={uploadCarousel} disabled={!editingId||mediaUploading}/>
            </label>
          </section>

          <section className="rounded-[20px] border border-white/[.07] bg-[var(--surface)] p-5">
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
  const cls="mt-2 w-full rounded-xl border border-white/[.08] bg-[var(--surface-raised)] px-3 py-3 text-xs text-white outline-none focus:border-[#1b9b68]/40";
  return <label className="text-[10px] text-[var(--muted)]"><span className="flex justify-between"><span>{label}</span>{hint&&<span dir="ltr">{hint}</span>}</span>{textarea?<textarea dir={dir} rows={3} value={value} onChange={e=>set(e.target.value)} placeholder={placeholder} className={cls+" resize-none"}/>:<input dir={dir} value={value} onChange={e=>set(e.target.value)} placeholder={placeholder} className={cls}/>}</label>;
}
function Toggle({label,value,set}:{label:string;value:boolean;set:(v:boolean)=>void}) { return <label className="mt-5 flex items-center justify-between rounded-xl bg-[var(--surface-raised)] px-3 py-3 text-xs text-[var(--muted)]"><span>{label}</span><input type="checkbox" checked={value} onChange={e=>set(e.target.checked)} className="accent-[#20a86b]"/></label>; }
function SeoCheck({ok,text}:{ok:boolean;text:string}) { return <div className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${ok?"bg-[#35c986]":"bg-white/15"}`}/><span className={ok?"text-[var(--muted)]":"text-white/25"}>{text}</span></div>; }
