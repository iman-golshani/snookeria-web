"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

const TRIGGER = 78;
export default function PWAPullToRefresh() {
  const pathname = usePathname();
  const router = useRouter();
  const start = useRef<{ x: number; y: number } | null>(null);
  const distance = useRef(0);
  const busy = useRef(false);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const installed = window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true);
    if (!installed || pathname.startsWith("/admin")) return;
    const onStart = (e: TouchEvent) => {
      if (busy.current || window.scrollY > 2 || e.touches.length !== 1) { start.current = null; return; }
      const target = e.target as Element | null;
      if (target?.closest("input, textarea, select, video, [contenteditable=true]")) { start.current = null; return; }
      start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      distance.current = 0;
    };
    const onMove = (e: TouchEvent) => {
      if (!start.current || busy.current || e.touches.length !== 1) return;
      const dy = e.touches[0].clientY - start.current.y;
      const dx = e.touches[0].clientX - start.current.x;
      if (dy <= 0 || Math.abs(dx) > dy || window.scrollY > 2) {
        if (Math.abs(dx) > dy || window.scrollY > 2) { start.current = null; setPull(0); }
        return;
      }
      distance.current = Math.min(120, dy * 0.48);
      setPull(distance.current);
      if (e.cancelable) e.preventDefault();
    };
    const onEnd = () => {
      if (!start.current) return;
      start.current = null;
      const shouldRefresh = distance.current >= TRIGGER && !busy.current;
      distance.current = 0;
      if (shouldRefresh) {
        busy.current = true;
        setRefreshing(true);
        setPull(TRIGGER);
        router.refresh();
        // Full reload ensures client-side feed state and server-rendered content both update.
        window.location.reload();
      } else setPull(0);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    window.addEventListener("touchcancel", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [pathname, router]);

  if (pull <= 0 && !refreshing) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(48px+env(safe-area-inset-top))] z-[70] flex justify-center" aria-live="polite">
      <div className="flex items-center gap-2 rounded-b-2xl border border-white/10 bg-[#101a29] px-4 py-2 text-xs text-white shadow-xl" style={{ transform: `translateY(${Math.min(0, pull - 35)}px)` }}>
        {refreshing ? <LoaderCircle size={17} className="animate-spin text-red-500"/> : <span className="h-2 w-2 rounded-full bg-red-500" />}
        
      </div>
    </div>
  );
}
