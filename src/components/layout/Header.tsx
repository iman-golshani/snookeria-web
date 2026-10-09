"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
export default function Header(){const p=usePathname();if(p.startsWith("/admin"))return null;return <header className="fixed inset-x-0 top-0 z-50 bg-[var(--nav)] pt-[env(safe-area-inset-top)]"><div className="mx-auto flex h-[48px] max-w-[720px] items-center justify-center px-4"><Link href="/" className="flex items-center"><span dir="ltr" className="text-[20px] font-black italic leading-none tracking-[-0.035em] text-white" style={{fontFamily:"var(--font-playfair), Georgia, serif"}}>SN<span className="text-[var(--accent)]">OO</span>KERIA</span></Link></div></header>}
