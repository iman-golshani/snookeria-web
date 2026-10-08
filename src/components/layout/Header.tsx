"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
export default function Header(){const p=usePathname();if(p.startsWith("/admin"))return null;return <header className="fixed inset-x-0 top-0 z-50 bg-[var(--nav)] pt-[env(safe-area-inset-top)]"><div className="mx-auto flex h-[48px] max-w-[720px] items-center px-4"><Link href="/" className="flex items-center gap-2"><img src="/snookeria-circle-transparent.png" alt="Snookeria" className="h-7 w-7 rounded-full object-cover"/><span dir="ltr" className="text-[13px] font-black tracking-[.12em] text-white">SNOOKERIA</span></Link></div></header>}
