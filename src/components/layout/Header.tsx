"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function Header(){
 const path=usePathname();
 if(path.startsWith("/admin"))return null;
 return <header className="vice-header fixed inset-x-0 top-0 z-50 border-b border-[var(--edge)] bg-[var(--nav)] pt-[env(safe-area-inset-top)]">
  <div className="vice-header-inner mx-auto flex h-[44px] max-w-[720px] items-center justify-between px-3">
   <Link href="/" aria-label="خانه اسنوکریا" className="flex h-9 w-9 items-center justify-center">
    <img src="/snookeria-circle-mark.jpg" alt="" className="h-8 w-8 rounded-full object-cover"/>
   </Link>
   <Link href="/" className="flex flex-1 flex-col items-center justify-center" dir="ltr">
    <span className="vice-wordmark text-[26px] leading-[25px] tracking-[.025em] text-[var(--ink)]" style={{fontFamily:"var(--font-brand)"}}>snookeria</span>
    <span className="vice-brand-kicker hidden">VICE COAST</span>
   </Link>
   <div className="vice-toggle-frame"><ThemeToggle/></div>
  </div>
 </header>;
}
