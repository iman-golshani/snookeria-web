"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {cmsSupabase} from "@/lib/supabase/cms";
import {uploadWithProgress} from "@/lib/supabase/uploadWithProgress";

type Category={slug:string;name:string;image_url:string|null;sort_order:number;is_active:boolean};
const empty:Category={slug:"",name:"",image_url:null,sort_order:100,is_active:true};
const inputClass="w-full rounded-xl border border-white/10 bg-white/[.06] p-3 text-sm text-white outline-none focus:border-red-500/60";

export default function CategoriesAdmin(){
 const router=useRouter();
 const [items,setItems]=useState<Category[]>([]);
 const [ready,setReady]=useState(false);
 const [editing,setEditing]=useState<Category|null>(null);
 const [originalSlug,setOriginalSlug]=useState<string|null>(null);
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);
 const [uploading,setUploading]=useState(false);
 const [uploadProgress,setUploadProgress]=useState<number|null>(null);
 async function reload(){
  const {data,error:e}=await cmsSupabase.from("post_categories").select("slug,name,image_url,sort_order,is_active").order("sort_order");
  if(e)setError("خطا در دریافت دسته‌بندی‌ها: "+e.message);
  else{setItems(data??[]);setError("")}
 }
 useEffect(()=>{void(async()=>{
  const {data}=await cmsSupabase.auth.getSession();
  if(!data.session){router.replace("/admin/login");return}
  await reload();setReady(true);
 })()},[router]);
 function openCreate(){setEditing({...empty});setOriginalSlug(null);setError("")}
 function openEdit(item:Category){setEditing({...item});setOriginalSlug(item.slug);setError("")}
 function close(){if(!busy&&!uploading){setEditing(null);setOriginalSlug(null);setError("")}}
 async function uploadCover(file:File){
  if(!file.type.startsWith("image/")){setError("فقط تصویر قابل آپلود است.");return}
  if(file.size>5*1024*1024){setError("حجم تصویر نباید بیشتر از ۵ مگابایت باشد.");return}
  setUploading(true);setError("");
  const ext=(file.name.split(".").pop()||"jpg").toLowerCase();
  const path="categories/"+crypto.randomUUID()+"."+ext;
  let uploaded=false;
  try{setUploadProgress(0);await uploadWithProgress(path,file,p=>setUploadProgress(p));uploaded=true}catch(e){setError("آپلود تصویر ناموفق بود: "+(e instanceof Error?e.message:String(e)))}
  if(uploaded){
   const {data}=cmsSupabase.storage.from("cms-media").getPublicUrl(path);
   setEditing(prev=>prev?{...prev,image_url:data.publicUrl}:prev);
  }
  setUploading(false);setUploadProgress(null);
 }
 async function save(){
  if(!editing||busy||uploading)return;
  if(!editing.name.trim()){setError("نام دسته‌بندی را وارد کن.");return}
  if(!/^[a-z0-9][a-z0-9_-]*$/.test(editing.slug)){setError("شناسه باید با حروف انگلیسی کوچک یا عدد شروع شود.");return}
  setBusy(true);setError("");
  const payload={name:editing.name.trim(),image_url:editing.image_url,sort_order:editing.sort_order,is_active:originalSlug==="snookeria"?true:editing.is_active};
  const {error:e}=originalSlug
   ?await cmsSupabase.from("post_categories").update(payload).eq("slug",originalSlug)
   :await cmsSupabase.from("post_categories").insert({...payload,slug:editing.slug});
  setBusy(false);
  if(e){setError("ذخیره انجام نشد: "+e.message);return}
  setEditing(null);setOriginalSlug(null);await reload();
 }
 async function removeCategory(item:Category){
  if(item.slug==="snookeria"||busy)return;
  if(!window.confirm("دسته‌بندی «"+item.name+"» حذف شود؟ مطالب حذف نمی‌شوند و همچنان در اسنوکریا باقی می‌مانند."))return;
  setBusy(true);setError("");
  // Keep legacy single-category field valid when deleting an old category.
  const {error:legacyError}=await cmsSupabase.from("posts").update({category:"snookeria"}).eq("category",item.slug);
  if(legacyError){setBusy(false);setError("پیش از حذف، انتقال مطالب به اسنوکریا انجام نشد: "+legacyError.message);return}
  const {error:e}=await cmsSupabase.from("post_categories").delete().eq("slug",item.slug);
  setBusy(false);
  if(e){setError("حذف انجام نشد: "+e.message+". در صورت خطای دسترسی، SQL مجوز حذف دسته‌بندی را اجرا کن.");return}
  if(originalSlug===item.slug){setEditing(null);setOriginalSlug(null)}
  await reload();
 }
 if(!ready)return <main className="min-h-screen bg-[var(--page)]"/>;
 return <main dir="rtl" className="min-h-screen bg-[var(--page)] px-4 py-7 text-white"><div className="mx-auto max-w-2xl">
  <Link href="/admin" className="text-xs text-red-400">بازگشت به مدیریت</Link>
  <div className="mt-5 flex items-center justify-between gap-3"><div><h1 className="text-xl font-black">مدیریت دسته‌بندی‌ها</h1><p className="mt-2 text-xs leading-6 text-[var(--muted)]">برای ویرایش کامل، دسته‌بندی را باز کن. اسنوکریا دسته اصلی و ثابت است.</p></div><button onClick={openCreate} className="shrink-0 rounded-xl bg-red-600 px-4 py-3 text-xs font-bold">+ دسته جدید</button></div>
  {error&&!editing&&<p role="alert" className="mt-4 rounded-xl bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}
  <div className="mt-6 space-y-3">{items.map(item=><div key={item.slug} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-3">
   {item.image_url?<img src={item.image_url} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover"/>:<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-600/20 text-xl text-red-400">{item.name.slice(0,1)}</div>}
   <div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{item.name}</div><div dir="ltr" className="truncate text-right text-[11px] text-white/40">{item.slug}</div>{!item.is_active&&<span className="text-[10px] text-amber-400">غیرفعال</span>}</div>
   <button onClick={()=>openEdit(item)} className="rounded-xl bg-white/10 px-3 py-2.5 text-xs">ویرایش کامل</button>
   {item.slug!=="snookeria"&&<button disabled={busy} onClick={()=>void removeCategory(item)} className="rounded-xl bg-red-500/15 px-3 py-2.5 text-xs text-red-300 disabled:opacity-40">حذف</button>}
  </div>)}</div>
  {editing&&<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3" onClick={close}><section role="dialog" aria-modal="true" aria-label="ویرایش دسته‌بندی" onClick={e=>e.stopPropagation()} className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/15 bg-[#152033] p-5 shadow-2xl">
   <div className="flex items-center justify-between"><h2 className="text-lg font-black">{originalSlug?"ویرایش کامل دسته‌بندی":"ساخت دسته‌بندی جدید"}</h2><button onClick={close} aria-label="بستن" className="rounded-lg bg-white/10 px-3 py-2">✕</button></div>
   {error&&<p role="alert" className="mt-4 rounded-xl bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}
   <div className="mt-5 space-y-4">
    <label className="block text-xs text-white/70">نام دسته‌بندی<input className={inputClass+" mt-2"} value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})}/></label>
    <label className="block text-xs text-white/70">شناسه انگلیسی (Slug)<input dir="ltr" disabled={!!originalSlug} className={inputClass+" mt-2 disabled:opacity-50"} placeholder="snooker-rules" value={editing.slug} onChange={e=>setEditing({...editing,slug:e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g,"")})}/></label>
    <div><p className="mb-2 text-xs text-white/70">عکس دایره‌ای دسته‌بندی</p><label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-white/20 p-3"><span className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10">{editing.image_url?<img src={editing.image_url} alt="کاور دسته‌بندی" className="h-full w-full object-cover"/>:"＋"}</span><span className="text-xs text-white/70">{uploading?"در حال آپلود...":"انتخاب یا تغییر عکس (حداکثر ۵ مگابایت)"}</span><input type="file" accept="image/*" className="hidden" disabled={uploading||busy} onChange={e=>{const f=e.target.files?.[0];if(f)void uploadCover(f);e.target.value=""}}/></label>{uploading&&uploadProgress!==null&&<div className="mt-3 text-xs"><div className="mb-2 flex justify-between"><span>در حال آپلود کاور</span><span>{uploadProgress}٪</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-red-500 transition-all" style={{width:uploadProgress+"%"}}/></div></div>}{editing.image_url&&<button onClick={()=>setEditing({...editing,image_url:null})} className="mt-2 text-xs text-red-300">حذف عکس کاور</button>}</div>
    {originalSlug!=="snookeria"&&<label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={editing.is_active} onChange={e=>setEditing({...editing,is_active:e.target.checked})} className="accent-red-500"/>دسته‌بندی فعال باشد</label>}
   </div>
   <div className="mt-6 flex flex-wrap gap-3"><button disabled={busy||uploading} onClick={()=>void save()} className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold disabled:opacity-40">{busy?"در حال ذخیره...":"ذخیره تغییرات"}</button><button onClick={close} className="rounded-xl bg-white/10 px-5 py-3 text-sm">انصراف</button>{originalSlug&&originalSlug!=="snookeria"&&<button disabled={busy||uploading} onClick={()=>void removeCategory(editing)} className="mr-auto rounded-xl border border-red-500/40 px-4 py-3 text-xs text-red-300">حذف دسته‌بندی</button>}</div>
  </section></div>}
 </div></main>
}
