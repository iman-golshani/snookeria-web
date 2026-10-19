"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function Header(){
  const path=usePathname();
  if(path.startsWith("/admin"))return null;
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--edge)] bg-[var(--nav)] pt-[env(safe-area-inset-top)]">
    <div className="mx-auto flex h-[44px] max-w-[720px] items-center justify-between px-3">
      <Link href="/" aria-label="خانه اسنوکریا" className="flex h-9 w-9 items-center justify-center">
        <img src="/snookeria-circle-mark.jpg" alt="" className="h-8 w-8 rounded-full object-cover"/>
      </Link>
      <Link href="/" className="flex flex-1 items-center justify-center" dir="ltr">
        <span className="text-[26px] leading-none tracking-[.025em] text-[var(--ink)]" style={{fontFamily:"var(--font-brand)"}}>SNOOKERIA</span>
      </Link>
      <ThemeToggle/>
    </div>
  </header>;
}
