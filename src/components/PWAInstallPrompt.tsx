"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
const KEY = "snookeria-install-dismissed-until";
const WEEK = 7 * 24 * 60 * 60 * 1000;

export default function PWAInstallPrompt() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true);
    if (!mobile || standalone || pathname.startsWith("/admin")) return;
    const dismissed = Number(localStorage.getItem(KEY) || 0);
    if (dismissed > Date.now()) return;
    const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIos(isIos);
    let event: InstallPromptEvent | null = null;
    const onPrompt = (e: Event) => {
      e.preventDefault();
      event = e as InstallPromptEvent;
      setDeferred(event);
    };
    const onInstalled = () => {
      localStorage.setItem(KEY, String(Date.now() + 365 * 24 * 60 * 60 * 1000));
      setVisible(false);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    const timer = window.setTimeout(() => {
      if (isIos || event) setVisible(true);
    }, 4500);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [pathname]);

  const dismiss = () => {
    localStorage.setItem(KEY, String(Date.now() + WEEK));
    setVisible(false);
  };
  const install = async () => {
    if (ios) { setHelp(true); return; }
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setDeferred(null);
    if (choice.outcome === "accepted") setVisible(false);
    else dismiss();
  };
  if (!visible || pathname.startsWith("/admin")) return null;
  return (
    <aside dir="rtl" className="fixed inset-x-3 z-[60] mx-auto max-w-[420px] rounded-2xl border border-white/10 bg-[#101a29] p-3 text-white shadow-2xl sm:hidden" style={{ bottom: "calc(64px + env(safe-area-inset-bottom))" }} aria-label="نصب اسنوکریا">
      <div className="flex items-center gap-3">
        <img src="/snookeria-circle-transparent.png" alt="لوگوی اسنوکریا" className="h-11 w-11 shrink-0 rounded-full object-contain" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">اسنوکریا همیشه همراهت</p>
          <p className="mt-0.5 text-[11px] text-white/60">{help ? "در Safari روی Share و سپس Add to Home Screen بزن." : "دسترسی سریع از صفحه اصلی گوشی"}</p>
        </div>
        <button type="button" onClick={dismiss} aria-label="بستن پیشنهاد نصب" className="self-start rounded-full p-1 text-white/55"><X size={17}/></button>
      </div>
      {!help && <button type="button" onClick={install} className="mt-3 w-full rounded-xl bg-red-600 py-2 text-xs font-bold text-white">نصب اسنوکریا</button>}
    </aside>
  );
}
