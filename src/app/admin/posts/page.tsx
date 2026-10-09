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
import {uploadWithProgress} from "@/lib/supabase/uploadWithProgress";
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
  const [postSearch,setPostSearch]=useState("");
  const [postFilter,setPostFilter]=useState<"all"|"published"|"draft">("all");
  const [categories,setCategories] = useState<string[][]>(defaultCategories);
  const [showEditor,setShowEditor] = useState(false);
  const [saving,setSaving] = useState(false);
  const [uploading,setUploading] = useState(false);
  const [uploadProgress,setUploadProgress]=useState<number|null>(null);
  const [mediaProgress,setMediaProgress]=useState<number|null>(null);
  const [cropFile,setCropFile] = useState<File|null>(null);
  const [cropMode,setCropMode]=useState<"cover"|"new-slide"|"edit-slide">("cover");
  const [cropQueue,setCropQueue]=useState<File[]>([]);
  const [cropSlideId,setCropSlideId]=useState<string|null>(null);
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
  const [pendingSlides,setPendingSlides]=useState<{id:string;file:File;url:string}[]>([]);
  const [uploadLabel,setUploadLabel]=useState("");
  const [mainSlide,setMainSlide]=useState<string|null>(null);

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

  function uploadCarousel(event:ChangeEvent<HTMLInputElement>){
    const files=Array.from(event.target.files??[]);event.target.value="";
    if(!files.length)return;
    if(files.some(f=>!f.type.startsWith("image/"))){setError("فقط تصویر برای اسلایدها قابل انتخاب است.");return;}
    const available=Math.max(0,10-media.length-pendingSlides.length-(cover?1:0));
    if(files.length>available){setError(`حداکثر ۱۰ تصویر شامل تصویر اصلی مجاز است. ظرفیت باقی‌مانده: ${available.toLocaleString("fa-IR")}`);return;}
    setError("");setCropMode("new-slide");setCropQueue(files.slice(1));setCropFile(files[0]);
  }
  function nextCrop(){setCropQueue(prev=>{const [first,...rest]=prev;setCropFile(first??null);return rest;});}
  function cancelCrop(){setCropFile(null);setCropQueue([]);setCropSlideId(null);}
  function finishCrop(file:File){
    if(cropMode==="cover"){void uploadCroppedCover(file);return;}
    if(cropMode==="edit-slide"&&cropSlideId){
      const id=cropSlideId;setPendingSlides(prev=>prev.map(p=>{if(p.id!==id)return p;URL.revokeObjectURL(p.url);return {...p,file,url:URL.createObjectURL(file)};}));
      setCropSlideId(null);setCropFile(null);return;
    }
    setPendingSlides(prev=>[...prev,{id:crypto.randomUUID(),file,url:URL.createObjectURL(file)}]);
    nextCrop();
  }
  function recropPending(id:string){
    const slide=pendingSlides.find(p=>p.id===id);if(!slide)return;
    setCropQueue([]);setCropSlideId(id);setCropMode("edit-slide");setCropFile(slide.file);
  }
  function movePending(index:number,delta:number){
    const j=index+delta;if(j<0||j>=pendingSlides.length)return;
    setPendingSlides(prev=>{const next=[...prev];[next[index],next[j]]=[next[j],next[index]];return next});
  }
  function removePending(id:string){
    if(mainSlide==="pending:"+id)setMainSlide(null);
    setPendingSlides(prev=>{const target=prev.find(x=>x.id===id);if(target)URL.revokeObjectURL(target.url);return prev.filter(x=>x.id!==id)});
  }

  async function removeMedia(item:PostMedia){
    const {error}=await cmsSupabase.from("post_media").delete().eq("id",item.id);
    if(error){setError(error.message);return;} if(mainSlide===item.id)setMainSlide(null);setMedia(v=>v.filter(x=>x.id!==item.id));
  }
  async function moveMedia(index:number,delta:number){
    const j=index+delta;if(j<0||j>=media.length)return;
    const next=[...media];[next[index],next[j]]=[next[j],next[index]];
    setMedia(next);
    await Promise.all(next.map((m,i)=>cmsSupabase.from("post_media").update({sort_order:i}).eq("id",m.id)));
  }

  function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file=event.target.files?.[0];event.target.value="";
    if(file){setError("");setCropMode("cover");setCropQueue([]);setCropFile(file)}
  }
  async function uploadCroppedCover(file:File){
    setCropFile(null);setUploading(true);setError("");
    const path="posts/"+Date.now()+"-"+crypto.randomUUID()+".jpg";
    try{setUploadProgress(0);await uploadWithProgress(path,file,p=>setUploadProgress(p))}catch(e){setError("آپلود تصویر انجام نشد: "+(e instanceof Error?e.message:String(e)));setUploading(false);setUploadProgress(null);return}
    const {data}=cmsSupabase.storage.from("cms-media").getPublicUrl(path);
    setCover(data.publicUrl);if(!ogImage)setOgImage(data.publicUrl);setUploading(false);setUploadProgress(null);
  }

  function reset() {
    setEditingId(null); setTitle(""); setSlug(""); setSlugTouched(false); setSelectedCategories(["snookeria"]);
    setExcerpt(""); setBody(""); setCover(""); setFeatured(false); setMedia([]);
    setPendingSlides(old=>{old.forEach(x=>URL.revokeObjectURL(x.url));return []});setMainSlide(null);setCropFile(null);setCropQueue([]);setCropSlideId(null);
    setSeoTitle(""); setSeoDescription(""); setFocusKeyword(""); setKeywords("");
    setCanonical(""); setOgTitle(""); setOgDescription(""); setOgImage("");
    setRobotsIndex(true); setRobotsFollow(true); setSchemaType("Article"); setError("");
  }

  async function save(status: "draft"|"published") {
    if (!title.trim()) { setError("عنوان مطلب را وارد کنید."); return; }
    if (!slug.trim()) { setError("Slug مطلب خالی است."); return; }
    if(media.length+pendingSlides.length+(cover?1:0)>10){setError("حداکثر ۱۰ تصویر مجاز است.");return;}
    setSaving(true); setError("");
    const now = new Date().toISOString();
    const payload = {
      title:title.trim(), slug:slug.trim(), excerpt:excerpt.trim() || null, body:body || null,
      cover_image_url:cover || null, category:selectedCategories.find(x=>x!=="snookeria")||"snookeria", status:pendingSlides.length?"draft":status, is_featured:featured,
      published_at: status === "published" && !pendingSlides.length ? now : null, updated_at:now,
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
    const uploadedRowsForMain:{id:string;url:string;pendingId:string}[]=[];
    if(postId&&pendingSlides.length){
      setMediaUploading(true);
      let order=media.length;
      const uploadedRows:{id:string;media_url:string;sort_order:number}[]=[];
      const uploadedPendingIds:string[]=[];
      for(let i=0;i<pendingSlides.length;i++){
        const slide=pendingSlides[i];setUploadLabel(`تصویر ${i+1} از ${pendingSlides.length}`);setMediaProgress(0);
        const ext=slide.file.name.split(".").pop()?.toLowerCase()||"jpg";
        const path=`posts/${postId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
        try{
          await uploadWithProgress(path,slide.file,p=>setMediaProgress(p));
          const {data:url}=cmsSupabase.storage.from("cms-media").getPublicUrl(path);
          const {data:mediaRow,error:mediaError}=await cmsSupabase.from("post_media").insert({post_id:postId,media_url:url.publicUrl,media_type:"image",alt_text:title||null,sort_order:order++}).select("id,media_url,sort_order").single();
          if(mediaError||!mediaRow)throw new Error(mediaError?.message||"ثبت تصویر انجام نشد");
          uploadedRows.push(mediaRow);uploadedPendingIds.push(slide.id);uploadedRowsForMain.push({id:mediaRow.id,url:mediaRow.media_url,pendingId:slide.id});
        }catch(e){
          setSaving(false);setMediaUploading(false);setError("مطلب به‌صورت پیش‌نویس ذخیره شد اما آپلود اسلایدها کامل نشد: "+(e instanceof Error?e.message:String(e)));
          setEditingId(postId);setMediaProgress(null);
          if(uploadedRows.length){setMedia(prev=>[...prev,...uploadedRows.map(row=>({...row,media_type:"image" as const,alt_text:title||null}))]);setPendingSlides(prev=>prev.filter(p=>!uploadedPendingIds.includes(p.id)));}
          return;
        }
      }
      setMediaUploading(false);setMediaProgress(null);
      setMedia(prev=>[...prev,...uploadedRows.map(row=>({...row,media_type:"image" as const,alt_text:title||null}))]);
    }
    if(postId&&mainSlide){
      const chosen=media.find(m=>m.id===mainSlide)?.media_url||uploadedRowsForMain.find(m=>"pending:"+m.pendingId===mainSlide)?.url;
      if(chosen){const {error:mainError}=await cmsSupabase.from("posts").update({cover_image_url:chosen,og_image_url:ogImage.trim()||chosen}).eq("id",postId);if(mainError){setSaving(false);setError("تعیین تصویر اصلی انجام نشد: "+mainError.message);setEditingId(postId);return;}}
    }
    if(postId&&status==="published"){
      const {error:publishError}=await cmsSupabase.from("posts").update({status:"published",published_at:now}).eq("id",postId);
      if(publishError){setSaving(false);setError("تصاویر ثبت شدند اما انتشار نهایی انجام نشد: "+publishError.message);setEditingId(postId);return;}
    }
    setSaving(false);
    reset(); setShowEditor(false); await loadPosts();
  }

  async function editPost(id:string) {
    setError("");setMainSlide(null);setPendingSlides(prev=>{prev.forEach(p=>URL.revokeObjectURL(p.url));return []});
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
    if(editingId===id){reset();setShowEditor(false)}
    await loadPosts();
  }

  const filteredPosts=posts.filter(p=>(postFilter==="all"||(postFilter==="published"?p.status==="published":p.status!=="published"))&&(!postSearch.trim()||p.title.toLowerCase().includes(postSearch.trim().toLowerCase())||p.slug.toLowerCase().includes(postSearch.trim().toLowerCase())));

  if (!ready) return <main className="min-h-screen bg-[var(--page)]"/>;

  if (!showEditor) return (
    <main dir="rtl" className="min-h-screen bg-[var(--page)] pb-20 text-[var(--ink)]">
      <header className="sticky top-0 z-40 border-b border-[var(--edge)] bg-[var(--page)]/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3"><Link href="/admin" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--edge)] bg-[var(--surface)]" aria-label="بازگشت"><ArrowRight size={17}/></Link><div><p className="text-[10px] font-bold text-[var(--accent)]">SNOOKERIA STUDIO</p><h1 className="text-lg font-black">مدیریت مطالب</h1></div></div>
          <button onClick={()=>{reset();setShowEditor(true)}} className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-xs font-bold text-white"><Plus size={17}/> مطلب جدید</button>
        </div>
      </header>
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-7">
        {error&&<p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">{error}</p>}
        <section className="grid grid-cols-3 gap-3">{[{label:"کل مطالب",value:posts.length},{label:"منتشرشده",value:posts.filter(p=>p.status==="published").length},{label:"پیش‌نویس",value:posts.filter(p=>p.status!=="published").length}].map(item=><div key={item.label} className="rounded-2xl border border-[var(--edge)] bg-[var(--surface)] p-3 shadow-sm sm:p-5"><p className="text-[10px] text-[var(--muted)] sm:text-xs">{item.label}</p><p className="mt-3 text-2xl font-black">{item.value.toLocaleString("fa-IR")}</p></div>)}</section>
        <section className="rounded-2xl border border-[var(--edge)] bg-[var(--surface)] p-3 sm:p-4">
          <div className="flex items-center gap-2 rounded-xl border border-[var(--edge)] bg-[var(--surface-raised)] px-3"><Search size={16} className="text-[var(--muted)]"/><input value={postSearch} onChange={e=>setPostSearch(e.target.value)} placeholder="جستجوی عنوان یا شناسه مطلب" className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none"/></div>
          <div className="mt-3 flex flex-wrap gap-2">{([{key:"all",label:"همه"},{key:"published",label:"منتشرشده"},{key:"draft",label:"پیش‌نویس"}] as const).map(f=><button key={f.key} onClick={()=>setPostFilter(f.key)} className={`rounded-xl px-4 py-2 text-xs font-bold ${postFilter===f.key?"bg-[var(--accent)] text-white":"bg-[var(--surface-raised)] text-[var(--muted)]"}`}>{f.label}</button>)}</div>
        </section>
        <section className="space-y-3">{filteredPosts.map(post=><article key={post.id} className="rounded-2xl border border-[var(--edge)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
          <div className="flex items-start justify-between gap-3"><div className="min-w-0 flex-1"><div className="mb-2 flex items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${post.status==="published"?"bg-emerald-500/10 text-emerald-500":"bg-amber-500/10 text-amber-500"}`}>{post.status==="published"?"منتشرشده":"پیش‌نویس"}</span><span className="text-[10px] text-[var(--muted)]">{new Date(post.created_at).toLocaleDateString("fa-IR")}</span></div><h2 className="text-sm font-bold leading-7 sm:text-base">{post.title}</h2><p dir="ltr" className="mt-1 truncate text-left text-[11px] text-[var(--muted)]">{post.slug}</p></div><FileText size={20} className="shrink-0 text-[var(--muted)]"/></div>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--edge)] pt-3"><button onClick={()=>void editPost(post.id)} className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-xs font-bold text-white sm:flex-none"><Pencil size={15}/> ویرایش کامل</button>{post.status==="published"&&<Link href={`/discover/${post.slug}`} target="_blank" className="flex min-h-10 items-center gap-2 rounded-xl border border-[var(--edge)] px-3 text-xs"><ExternalLink size={15}/> مشاهده</Link>}<button onClick={()=>void deletePost(post.id,post.title)} className="mr-auto flex min-h-10 items-center gap-2 rounded-xl bg-red-500/10 px-3 text-xs text-red-500"><Trash2 size={15}/> حذف</button></div>
        </article>)}{filteredPosts.length===0&&<div className="rounded-2xl border border-dashed border-[var(--edge)] p-12 text-center text-sm text-[var(--muted)]">مطلبی پیدا نشد.</div>}</section>
      </div>
    </main>
  );

  return (
    <main dir="rtl" className="min-h-screen bg-[var(--page)] text-white">
      <div className="sticky top-0 z-40 border-b border-[var(--edge)] bg-[var(--page)]/95 px-4 py-3 backdrop-blur-xl sm:px-7">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button onClick={()=>setShowEditor(false)} className="flex items-center gap-2 text-xs text-[var(--muted)]"><X size={17}/> بستن</button>
          <div className="flex gap-2">
            <button disabled={saving||uploading||mediaUploading} onClick={()=>save("draft")} className="h-10 rounded-xl border border-white/[.09] bg-[var(--surface-raised)] px-4 text-xs font-bold text-white/65">ذخیره پیش‌نویس</button>
            <button disabled={saving} onClick={()=>save("published")} className="flex h-10 items-center gap-2 rounded-xl bg-[#e3222b] px-4 text-xs font-black disabled:opacity-50">{saving?<Loader2 className="animate-spin" size={15}/>:<Check size={15}/>} {editingId?"به‌روزرسانی و انتشار":"انتشار"}</button>
          </div>
        </div>
      </div>

      {cropFile&&<SquareImageCropper key={cropFile.name+cropFile.size+cropMode} file={cropFile} onCancel={cancelCrop} onDone={finishCrop}/>}
      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-7"><div className="mb-4 flex items-center justify-between"><div><p className="text-[10px] font-bold text-[var(--accent)]">CONTENT EDITOR</p><h1 className="mt-1 text-xl font-black">{editingId?"ویرایش کامل مطلب":"مطلب جدید"}</h1></div>{editingId&&<button onClick={()=>void deletePost(editingId,title)} className="rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-500">حذف مطلب</button>}</div><div className="grid gap-4 lg:grid-cols-2">          <section className="rounded-[20px] border border-[var(--edge)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2"><ImagePlus size={16} className="text-[#55d49a]"/><p className="text-xs font-bold">تصویر شاخص</p></div>
            {cover ? <div className="mt-4 overflow-hidden rounded-2xl border border-white/[.07]"><img src={cover} alt="" className="aspect-square max-h-72 w-full object-contain bg-black/20"/><button onClick={()=>setCover("")} className="w-full bg-[var(--surface-raised)] py-2 text-[10px] text-[#ff6871]">حذف تصویر</button><label className="block cursor-pointer bg-[var(--surface-raised)] py-3 text-center text-xs">تعویض تصویر<input type="file" accept="image/*" className="hidden" onChange={uploadImage} disabled={uploading}/></label></div> :
            <label className="mt-4 flex aspect-square max-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#35b77d]/25 bg-[#071b1d] text-center">
              {uploading?<Loader2 size={20} className="animate-spin text-[#55d49a]"/>:<Upload size={20} className="text-[#55d49a]"/>}
              <span className="mt-2 text-[10px] text-white/35">{uploading?"در حال آپلود...":"انتخاب و آپلود تصویر"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={uploadImage} disabled={uploading}/>
            </label>}
          </section>
          <section className="rounded-[20px] border border-[var(--edge)] bg-[var(--surface)] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Images size={17} className="text-[var(--accent)]"/><h2 className="text-sm font-bold">گالری تصاویر پست</h2></div><span className="rounded-full bg-[var(--surface-raised)] px-3 py-1 text-xs">{(media.length+pendingSlides.length+(cover?1:0)).toLocaleString("fa-IR")} / ۱۰</span></div>
            <p className="mt-2 text-xs leading-6 text-[var(--muted)]">روی «انتخاب به‌عنوان اصلی» بزن تا همان عکس اولین اسلاید شود. ترتیب بقیه تصاویر با فلش‌ها قابل تغییر است.</p>
            {mediaUploading&&<div className="mt-4 rounded-xl bg-[var(--surface-raised)] p-3 text-xs"><div className="mb-2 flex justify-between"><span>{uploadLabel||"در حال آپلود تصاویر"}</span><span>{mediaProgress??0}٪</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{width:(mediaProgress??0)+"%"}}/></div></div>}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {cover&&<div className="relative overflow-hidden rounded-xl border-2 border-[var(--accent)] bg-[var(--surface-raised)]"><img src={cover} alt="تصویر اصلی" className="aspect-square w-full object-cover"/><span className="absolute right-2 top-2 rounded-lg bg-[var(--accent)] px-2 py-1 text-[10px] font-bold text-white">تصویر اصلی</span></div>}
              {media.map((m,i)=><div key={m.id} className="overflow-hidden rounded-xl border border-[var(--edge)] bg-[var(--surface-raised)]"><div className="relative"><img src={m.media_url} alt="" className="aspect-square w-full object-cover"/>{(mainSlide===m.id||(!mainSlide&&!cover&&i===0))&&<span className="absolute right-2 top-2 rounded-lg bg-[var(--accent)] px-2 py-1 text-[10px] text-white">اولین اسلاید</span>}</div><button type="button" onClick={()=>setMainSlide(m.id)} className="w-full bg-[var(--surface)] py-2 text-[10px] font-bold text-[var(--accent)]">{mainSlide===m.id?"تصویر اصلی ✓":"انتخاب به‌عنوان اصلی"}</button><div className="flex items-center justify-between px-1 py-1"><button type="button" aria-label="انتقال به قبل" disabled={i===0} onClick={()=>void moveMedia(i,-1)} className="rounded-lg p-2 disabled:opacity-20"><ArrowUp size={16}/></button><span className="text-[10px] text-[var(--muted)]">{i+1}</span><button type="button" aria-label="انتقال به بعد" disabled={i===media.length-1} onClick={()=>void moveMedia(i,1)} className="rounded-lg p-2 disabled:opacity-20"><ArrowDown size={16}/></button><button type="button" aria-label="حذف تصویر" onClick={()=>void removeMedia(m)} className="rounded-lg p-2 text-red-400"><Trash2 size={16}/></button></div></div>)}
              {pendingSlides.map((m,i)=><div key={m.id} className="overflow-hidden rounded-xl border border-dashed border-[var(--accent)] bg-[var(--surface-raised)]"><img src={m.url} alt="" className="aspect-square w-full object-cover"/><button type="button" onClick={()=>recropPending(m.id)} className="w-full bg-[var(--surface-raised)] py-2 text-[10px] font-bold">برش مجدد تصویر</button><button type="button" onClick={()=>setMainSlide("pending:"+m.id)} className="w-full bg-[var(--surface)] py-2 text-[10px] font-bold text-[var(--accent)]">{mainSlide==="pending:"+m.id?"تصویر اصلی ✓":"انتخاب به‌عنوان اصلی"}</button><div className="flex items-center justify-between px-1 py-1"><button type="button" aria-label="انتقال به قبل" disabled={i===0} onClick={()=>movePending(i,-1)} className="rounded-lg p-2 disabled:opacity-20"><ArrowUp size={16}/></button><span className="text-[10px] text-[var(--muted)]">جدید</span><button type="button" aria-label="انتقال به بعد" disabled={i===pendingSlides.length-1} onClick={()=>movePending(i,1)} className="rounded-lg p-2 disabled:opacity-20"><ArrowDown size={16}/></button><button type="button" aria-label="حذف تصویر" onClick={()=>removePending(m.id)} className="rounded-lg p-2 text-red-400"><Trash2 size={16}/></button></div></div>)}
              {media.length+pendingSlides.length+(cover?1:0)<10&&<label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--edge)] bg-[var(--surface-raised)] text-[var(--muted)]"><ImagePlus size={25}/><span className="text-center text-xs">افزودن تصاویر</span><input type="file" accept="image/*" multiple className="hidden" onChange={uploadCarousel} disabled={saving||mediaUploading}/></label>}
            </div>
            {pendingSlides.length>0&&<p className="mt-3 text-xs text-[var(--muted)]">تصاویر جدید هنگام ذخیره یا انتشار مطلب، به‌ترتیب آپلود می‌شوند.</p>}
          </section></div></div>
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-7 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          


          {uploading&&uploadProgress!==null&&<div className="rounded-xl border border-[var(--edge)] bg-[var(--surface)] p-3 text-xs"><div className="mb-2 flex justify-between"><span>آپلود تصویر شاخص</span><span>{uploadProgress}٪</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-red-500 transition-all" style={{width:uploadProgress+"%"}}/></div></div>}
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
