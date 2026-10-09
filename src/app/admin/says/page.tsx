"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cmsSupabase } from "@/lib/supabase/cms";

export default function SaysAdmin() {
 const router=useRouter();
 const [ready,setReady]=useState(false),[saving,setSaving]=useState(false);
 const [quote,setQuote]=useState(""),[author,setAuthor]=useState(""),[active,setActive]=useState(false);
 const [message,setMessage]=useState("");
 useEffect(()=>{let mounted=true;void (async()=>{
  const {data:session}=await cmsSupabase.auth.getSession();
  if(!session.session){router.replace("/admin/login");return;}
  const {data,error}=await cmsSupabase.from("academy_daily_quote").select("quote,author,is_active").eq("id",1).maybeSingle();
  if(!mounted)return;
  if(error)setMessage("خطا در دریافت اطلاعات؛ ابتدا فایل SQL مربوط به جمله روز را در Supabase اجرا کنید.");
  else if(data){setQuote(data.quote??"");setAuthor(data.author??"");setActive(Boolean(data.is_active));}
  setReady(true);
 })();return()=>{mounted=false}},[router]);
 async function save(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setMessage("");
  if(active&&!quote.trim()){setMessage("برای فعال‌سازی ابتدا متن جمله را وارد کنید.");return;}
  setSaving(true);
  const {error}=await cmsSupabase.from("academy_daily_quote").upsert({id:1,quote:quote.trim(),author:author.trim(),is_active:active,updated_at:new Date().toISOString()},{onConflict:"id"});
  setSaving(false);setMessage(error?"ذخیره انجام نشد: "+error.message:"تغییرات با موفقیت ذخیره شد.");
 }
 return <main dir="rtl" className="min-h-screen bg-[var(--page)] px-4 py-8 text-[var(--ink)]"><div className="mx-auto max-w-2xl">
  <Link href="/admin" className="text-sm text-[var(--muted)]">← بازگشت به پنل مدیریت</Link>
  <h1 className="mt-6 text-2xl font-black">جمله روز اسنوکریا</h1>
  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">جمله فعال در صفحه آکادمی، درست پیش از کلاس‌ها و دوره‌ها نمایش داده می‌شود.</p>
  {ready?<form onSubmit={save} className="mt-7 space-y-5 rounded-3xl border border-[var(--edge)] bg-[var(--surface)] p-5">
   <div><label htmlFor="quote" className="mb-2 block text-sm font-bold">متن جمله</label><textarea id="quote" rows={4} maxLength={600} value={quote} onChange={e=>setQuote(e.target.value)} placeholder="جمله الهام‌بخش امروز..." className="w-full resize-y rounded-xl border border-[var(--edge)] bg-[var(--page)] p-3 text-sm outline-none focus:border-[var(--accent)]"/></div>
   <div><label htmlFor="author" className="mb-2 block text-sm font-bold">نام گوینده (اختیاری)</label><input id="author" maxLength={120} value={author} onChange={e=>setAuthor(e.target.value)} placeholder="مثلاً: اسنوکریا" className="w-full rounded-xl border border-[var(--edge)] bg-[var(--page)] p-3 text-sm outline-none focus:border-[var(--accent)]"/></div>
   <label className="flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} className="h-5 w-5 accent-red-500"/> نمایش جمله در صفحه آکادمی</label>
   <div className="rounded-2xl border border-red-500/20 bg-red-500/[.05] p-5 text-center"><p className="text-xs font-bold text-[var(--accent)]">جمله روز</p><p className="mt-3 whitespace-pre-line text-base font-bold leading-8">{quote||"پیش‌نمایش جمله شما"}</p>{author&&<p className="mt-2 text-xs text-[var(--muted)]">— {author}</p>}</div>
   {message&&<p role="status" className="text-sm text-[var(--muted)]">{message}</p>}
   <button disabled={saving} type="submit" className="w-full rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{saving?"در حال ذخیره...":"ذخیره تغییرات"}</button>
  </form>:<p className="mt-8 text-sm text-[var(--muted)]">در حال بارگذاری...</p>}
 </div></main>;
}
