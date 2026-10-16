"use client";
import {useEffect,useState} from "react";
import {usePathname} from "next/navigation";
type InstallEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:"accepted"|"dismissed"}>};
export default function AdminPWAInstall(){
const pathname=usePathname();const [ios,setIos]=useState(false),[installed,setInstalled]=useState(false),[prompt,setPrompt]=useState<InstallEvent|null>(null),[dismissed,setDismissed]=useState(false);
useEffect(()=>{if(!pathname.startsWith("/admin"))return;const standalone=matchMedia("(display-mode: standalone)").matches||(navigator as Navigator&{standalone?:boolean}).standalone===true;setInstalled(standalone);setIos(/iPhone|iPad|iPod/i.test(navigator.userAgent));const handler=(event:Event)=>{event.preventDefault();setPrompt(event as InstallEvent)};window.addEventListener("beforeinstallprompt",handler);return()=>window.removeEventListener("beforeinstallprompt",handler)},[pathname]);
if(installed||dismissed||pathname==="/admin/login")return null;
return <div dir="rtl" className="mx-auto flex max-w-6xl items-center justify-between gap-3 border-b border-white/10 bg-[#142136] px-4 py-2 text-white">
<div className="min-w-0"><p className="text-xs font-bold">نسخه اپلیکیشنی مدیریت اسنوکریا</p><p className="text-[11px] text-white/60">{ios?"برای نصب، در Safari گزینه Share و سپس Add to Home Screen را بزن.":prompt?"پنل مدیریت را به‌صورت اپلیکیشن مستقل نصب کن.":"برای نصب از منوی مرورگر گزینه Install app را انتخاب کن."}</p></div>
<div className="flex shrink-0 gap-2">{prompt&&<button onClick={async()=>{await prompt.prompt();await prompt.userChoice;setPrompt(null)}} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold">نصب</button>}<button onClick={()=>setDismissed(true)} className="rounded-lg border border-white/20 px-2 py-2 text-xs" aria-label="بستن">✕</button></div>
</div>}
