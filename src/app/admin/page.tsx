"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, LogOut, MessageCircle, Target, Wrench } from "lucide-react";
import { cmsSupabase } from "@/lib/supabase/cms";

const items = [
  { title: "مطالب و مقالات", text: "مقاله، خبر، داستان، ویدئو و 147", href: "/admin/posts", icon: BookOpen, tone: "red" },
  { title: "Snookeria Says", text: "جمله و پیام فعال اسنوکریا", href: "/admin/says", icon: MessageCircle, tone: "green" },
  { title: "Shot of the Day", text: "تصویر، سؤال و پاسخ ضربه روز", href: "/admin/shots", icon: Target, tone: "green" },
  { title: "کارگاه‌ها", text: "ساخت کارگاه و مدیریت ثبت‌نام", href: "/admin/workshops", icon: Wrench, tone: "red" },
];

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    cmsSupabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/admin/login");
      else setReady(true);
    });
  }, [router]);

  async function logout() {
    await cmsSupabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (!ready) return <main className="min-h-screen bg-[#05090d]" />;

  return (
    <main dir="rtl" className="min-h-screen bg-[#05090d] px-4 py-6 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between border-b border-white/[0.07] pb-5">
          <div>
            <p dir="ltr" className="text-[10px] font-black tracking-[.24em] text-[#32c889]">SNOOKERIA CMS</p>
            <h1 className="mt-1 text-2xl font-black">پنل مدیریت</h1>
          </div>
          <button onClick={logout} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/45 hover:text-[#ff4b53]" aria-label="خروج">
            <LogOut size={18} />
          </button>
        </header>

        <section className="mt-7 grid gap-3 sm:grid-cols-2">
          {items.map(({ title, text, href, icon: Icon, tone }) => (
            <Link key={href} href={href}
              className={`rounded-[26px] border p-5 transition hover:-translate-y-0.5 ${tone === "green" ? "border-[#16a36a]/20 bg-[#07130f]" : "border-[#e3222b]/20 bg-[#10090b]"}`}>
              <Icon size={22} className={tone === "green" ? "text-[#32c889]" : "text-[#ff4b53]"} />
              <h2 className="mt-4 font-black">{title}</h2>
              <p className="mt-1.5 text-xs leading-6 text-white/35">{text}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
