"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy,
  Presentation,
  CircleDot,
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const isAcademy = pathname === "/";
  const isTournaments = pathname.startsWith("/tournaments");
  const isWorkshops = pathname.startsWith("/workshops");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#071426]/90 backdrop-blur-xl">
      <div className="mx-auto grid max-w-lg grid-cols-3">
        {/* Workshops - Left */}
        <Link
          href="/workshops"
          className={`flex flex-col items-center gap-1 py-3 transition ${
            isWorkshops
              ? "text-red-500"
              : "text-white/45 hover:text-white"
          }`}
        >
          <Presentation size={21} />

          <span className="text-[11px]">
            کارگاه آموزشی
          </span>
        </Link>

        {/* Academy - Center */}
        <Link
          href="/"
          className={`relative flex flex-col items-center gap-1 py-3 transition ${
            isAcademy
              ? "text-red-500"
              : "text-white/45"
          }`}
        >
          <div
            className={`absolute -top-5 flex h-12 w-12 items-center justify-center rounded-full border bg-[#071426] ${
              isAcademy
                ? "border-red-600/40 shadow-[0_0_25px_rgba(220,20,60,0.25)]"
                : "border-white/10"
            }`}
          >
            <CircleDot size={24} />
          </div>

          <div className="h-5" />

          <span className="text-[11px] font-semibold">
            آکادمی
          </span>
        </Link>

        {/* Tournaments - Right */}
        <Link
          href="/tournaments"
          className={`flex flex-col items-center gap-1 py-3 transition ${
            isTournaments
              ? "text-red-500"
              : "text-white/45 hover:text-white"
          }`}
        >
          <Trophy size={21} />

          <span className="text-[11px]">
            مسابقات
          </span>
        </Link>
      </div>
    </nav>
  );
}