"use client";
import Link from "next/link";
import {usePathname,useRouter} from "next/navigation";
import {ArrowRight,ExternalLink,House,LogOut,Menu,X} from "lucide-react";
import {useState} from "react";
import {cmsSupabase} from "@/lib/supabase/cms";
import ThemeToggle from "@/components/layout/ThemeToggle";
const sections=[["/admin","داشبورد"],["/admin/posts","مطالب"],["/admin/stories","استوری‌ها"],["/admin/categories","دسته‌بندی‌ها"],["/admin/analytics","آمار"],["/admin/consultations","درخواست‌های آموزش"],["/admin/says","جمله روز"],["/admin/shots","ضربه روز"],["/admin/workshops","کارگاه‌ها"]];
export default function AdminHeader(){
 const pathname=usePathname(),router=useRouter(),[menu,setMenu]=useState(false);
 if(pathname==="/admin/login"||pathname.startsWith("/admin/manifest"))return null;
 const current=sections.find(([href])=>href!=="/admin"&&(pathname===href||pathname.startsWith(href+"/")));
 const title=current?.[1]||"داشبورد";
 async function logout(){setMenu(false);await cmsSupabase.auth.signOut();router.replace("/admin/login")}
 return <><header dir="rtl" className="sticky top-0 z-[80] border-b border-white/10 bg-[#101a29]/95 text-white shadow-[0_4px_22px_rgba(0,0,0,.18)] backdrop-blur-xl">
 <div className="mx-auto flex h-[56px] max-w-6xl items-center gap-3 px-4 sm:px-6">
 <button type="button" onClick={()=>setMenu(v=>!v)} aria-label="فهرست مدیریت" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[.07]">{menu?<X size={19}/>:<Menu size={19}/>}</button>
 <Link href="/admin" className="flex min-w-0 flex-1 items-center gap-2.5"><img src="/snookeria-circle-mark.jpg" alt="" className="h-9 w-9 rounded-full bg-white/5 object-contain"/><span className="min-w-0"><span className="block text-[9px] font-extrabold tracking-[.17em] text-[#fb6476]" dir="ltr">SNOOKERIA STUDIO</span><span className="block truncate text-[13px] font-black">{title}</span></span></Link>
 {pathname!=="/admin"&&<Link href="/admin" aria-label="داشبورد" className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5"><House size={17}/></Link>}
 <ThemeToggle admin/><Link href="/" aria-label="مشاهده سایت" className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5"><ExternalLink size={16}/></Link>
 </div>
 </header>
 {menu&&<><button aria-label="بستن فهرست" className="fixed inset-0 z-[85] bg-black/60" onClick={()=>setMenu(false)}/><nav dir="rtl" className="fixed inset-y-0 right-0 z-[90] w-[min(84vw,310px)] overflow-y-auto border-l border-white/10 bg-[#101a29] px-4 pb-8 pt-[max(20px,env(safe-area-inset-top))] text-white shadow-2xl">
 <div className="mb-5 flex items-center justify-between"><b className="text-sm">بخش‌های مدیریت</b><button onClick={()=>setMenu(false)} aria-label="بستن" className="rounded-lg bg-white/10 p-2"><X size={18}/></button></div>
 <div className="space-y-1">{sections.map(([href,label])=><Link key={href} href={href} onClick={()=>setMenu(false)} className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${pathname===href?"bg-[#ec3650]/15 font-bold text-[#ff7d8c]":"text-white/75 hover:bg-white/5"}`}><span>{label}</span>{pathname===href&&<span className="h-1.5 w-1.5 rounded-full bg-[#ec3650]"/>}</Link>)}</div>
 <button onClick={()=>void logout()} className="mt-6 flex w-full items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70"><LogOut size={16}/> خروج از حساب</button>
 </nav></>}
 </>;
}