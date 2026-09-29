"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, GraduationCap, Radio, Trophy } from "lucide-react";

const baseItem =
  "relative flex h-16 items-center justify-center transition duration-200 active:scale-95";

export default function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isAcademy = pathname.startsWith("/academy") || pathname.startsWith("/workshops");
  const isTournaments = pathname.startsWith("/tournaments");
  const isDiscover = pathname.startsWith("/discover") || pathname.startsWith("/news");
  const isLive = pathname.startsWith("/live");

  const itemClass = (active: boolean) =>
    `${baseItem} ${active ? "text-red-500" : "text-white/40 hover:text-white/75"}`;

  return (
    <nav
      aria-label="ناوبری اصلی اسنوکریا"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#071426]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl"
    >
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5 px-2">
        <Link href="/live" aria-label="پخش زنده" className={itemClass(isLive)}>
          <Radio size={23} strokeWidth={isLive ? 2.5 : 2} />
          {isLive && <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-red-500" />}
        </Link>

        <Link href="/discover" aria-label="کشف" className={itemClass(isDiscover)}>
          <Compass size={23} strokeWidth={isDiscover ? 2.5 : 2} />
          {isDiscover && <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-red-500" />}
        </Link>

        <Link href="/" aria-label="خانه اسنوکریا" className="relative flex h-16 items-center justify-center">
          <div
            className={`absolute -top-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border bg-[#071426] transition duration-200 active:scale-95 ${
              isHome
                ? "border-red-500/50 shadow-[0_0_28px_rgba(220,20,60,0.28)]"
                : "border-white/10"
            }`}
          >
            <img src="/snookeria-logo.png" alt="" className="h-full w-full object-cover" />
          </div>
          {isHome && <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-red-500" />}
        </Link>

        <Link href="/academy" aria-label="آکادمی" className={itemClass(isAcademy)}>
          <GraduationCap size={24} strokeWidth={isAcademy ? 2.5 : 2} />
          {isAcademy && <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-red-500" />}
        </Link>

        <Link href="/tournaments" aria-label="مسابقات" className={itemClass(isTournaments)}>
          <Trophy size={23} strokeWidth={isTournaments ? 2.5 : 2} />
          {isTournaments && <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-red-500" />}
        </Link>
      </div>
    </nav>
  );
}
