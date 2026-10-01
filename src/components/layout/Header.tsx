"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio } from "lucide-react";

export default function Header() {
  const pathname=usePathname();
  if(pathname.startsWith("/admin")) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.055] bg-[#06111c]/82 pt-[env(safe-area-inset-top)] backdrop-blur-2xl">
      <div className="mx-auto flex h-[54px] max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" dir="ltr" aria-label="Snookeria" className="flex items-center text-[14px] font-black tracking-[.12em] text-white">
          <span>SN</span>
          <span className="mx-[1px] h-[11px] w-[11px] rounded-full bg-[#e3222b] shadow-[0_0_10px_rgba(227,34,43,.4)]"/>
          <span className="mx-[1px] h-[11px] w-[11px] rounded-full bg-[#20a86b] shadow-[0_0_10px_rgba(32,168,107,.35)]"/>
          <span>KERIA</span>
        </Link>
        <Link href="/live" aria-label="Live" className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#e3222b]/10 text-[#ff5360]">
          <Radio size={16}/>
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#ff5360]"/>
        </Link>
      </div>
    </header>
  );
}
