"use client";
import {useState,type FormEvent} from "react";
import {cmsSupabase} from "@/lib/supabase/cms";
const field="w-full rounded-xl border border-white/15 bg-[#0c1a2d] px-4 py-3 text-sm text-white outline-none focus:border-red-500";
export default function CueActionRegistration({workshopId}:{workshopId:string}){
const [name,setName]=useState(""),[phone,setPhone]=useState(""),[experience,setExperience]=useState(""),[busy,setBusy]=useState(false),[success,setSuccess]=useState(false),[error,setError]=useState("");
async function submit(e:FormEvent){e.preventDefault();if(busy)return;setBusy(true);setError("");
const {data,error:err}=await cmsSupabase.rpc("register_academy_workshop",{p_workshop_id:workshopId,p_full_name:name.trim(),p_phone:phone.trim(),p_experience:experience.trim()});
setBusy(false);if(err){setError("ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.");return}
if(data==="full"){setError("ظرفیت این کارگاه تکمیل شده است.");return}
if(data==="closed"){setError("مهلت ثبت‌نام این کارگاه به پایان رسیده است.");return}
if(data==="duplicate"){setError("این شماره قبلاً برای کارگاه ثبت شده است.");return}
if(data!=="registered"){setError("ثبت‌نام انجام نشد.");return}
setSuccess(true)}
return <section id="register" className="scroll-mt-24 rounded-3xl border border-red-500/25 bg-white/[.035] p-5 sm:p-8"><h2 className="text-xl font-black">فرم ثبت‌نام کارگاه</h2><p className="mt-2 text-sm leading-7 text-white/55">برای رزرو جایگاه، اطلاعات زیر را وارد کنید. پس از ثبت درخواست، برای هماهنگی پرداخت با شما تماس گرفته می‌شود.</p>
{success?<div role="status" className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-300">درخواست ثبت‌نام شما با موفقیت ثبت شد. برای هماهنگی پرداخت و تأیید نهایی با شما تماس می‌گیریم.</div>:<form onSubmit={submit} className="mt-6 space-y-4">
<label className="block space-y-2 text-sm">نام و نام خانوادگی *<input className={field} required minLength={2} maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder="نام و نام خانوادگی"/></label>
<label className="block space-y-2 text-sm">شماره تماس *<input className={field} required type="tel" inputMode="tel" dir="ltr" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="0912xxxxxxx"/></label>
<label className="block space-y-2 text-sm">سابقه بازی *<input className={field} required maxLength={120} value={experience} onChange={e=>setExperience(e.target.value)} placeholder="مثلاً ۳ سال بازی باشگاهی"/></label>
{error&&<p role="alert" className="text-sm text-red-300">{error}</p>}
<button disabled={busy} className="w-full rounded-xl bg-red-600 px-5 py-4 text-sm font-black text-white disabled:opacity-50">{busy?"در حال ثبت...":"ثبت درخواست شرکت در کارگاه"}</button><p className="text-xs leading-6 text-white/45">ثبت فرم به معنی پرداخت یا قطعی‌شدن جایگاه نیست؛ تأیید نهایی پس از هماهنگی انجام می‌شود.</p>
</form>}</section>}
