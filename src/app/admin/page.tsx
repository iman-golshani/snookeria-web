"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpLeft,
  BarChart3,
  BookOpen,
  Eye,
  FileText,
  LogOut,
  MessageCircle,
  Plus,
  Target,
  Users,
  Wrench,
} from "lucide-react";
import { cmsSupabase } from "@/lib/supabase/cms";

type Counts = {
  posts: number;
  published: number;
  shots: number;
  workshops: number;
  registrations: number;
};

const nav = [
  { title: "مطالب", href: "/admin/posts", icon: BookOpen },
  { title: "Snookeria Says", href: "/admin/says", icon: MessageCircle },
  { title: "Shot of the Day", href: "/admin/shots", icon: Target },
  { title: "کارگاه‌ها", href: "/admin/workshops", icon: Wrench },
];

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [counts, setCounts] = useState<Counts>({
    posts: 0,
    published: 0,
    shots: 0,
    workshops: 0,
    registrations: 0,
  });

  useEffect(() => {
    async function boot() {
      const { data: sessionData } = await cmsSupabase.auth.getSession();
      if (!sessionData.session) {
        router.replace("/admin/login");
        return;
      }

      const [posts, published, shots, workshops, registrations] = await Promise.all([
        cmsSupabase.from("posts").select("*", { count: "exact", head: true }),
        cmsSupabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
        cmsSupabase.from("shots_of_the_day").select("*", { count: "exact", head: true }),
        cmsSupabase.from("workshops").select("*", { count: "exact", head: true }),
        cmsSupabase.from("workshop_registrations").select("*", { count: "exact", head: true }),
      ]);

      setCounts({
        posts: posts.count ?? 0,
        published: published.count ?? 0,
        shots: shots.count ?? 0,
        workshops: workshops.count ?? 0,
        registrations: registrations.count ?? 0,
      });
      setReady(true);
    }

    boot();
  }, [router]);

  async function logout() {
    await cmsSupabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (!ready) return <main className="min-h-screen bg-[#07090c]" />;

  const stats = [
    { label: "کل مطالب", value: counts.posts, icon: FileText },
    { label: "منتشر شده", value: counts.published, icon: Eye },
    { label: "Shotها", value: counts.shots, icon: Target },
    { label: "ثبت‌نام‌ها", value: counts.registrations, icon: Users },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-[#07090c] text-white">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-7">
        <header className="flex items-center justify-between">
          <div>
            <p dir="ltr" className="text-[9px] font-semibold tracking-[.28em] text-white/35">
              SNOOKERIA / ADMIN
            </p>
            <h1 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">Overview</h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.08] px-3 text-[11px] text-white/45 transition hover:bg-white/[0.04] hover:text-white"
            >
              مشاهده سایت
              <ArrowUpLeft size={14} />
            </Link>
            <button
              onClick={logout}
              aria-label="خروج"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-white/35 transition hover:bg-white/[0.04] hover:text-[#ff4b53]"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <div className="mt-7 grid gap-5 lg:grid-cols-[180px_1fr]">
          <aside className="h-fit rounded-2xl border border-white/[0.07] bg-white/[0.018] p-2">
            <p className="px-3 pb-2 pt-2 text-[10px] font-medium text-white/25">مدیریت محتوا</p>
            <nav className="space-y-1">
              {nav.map(({ title, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/50 transition hover:bg-white/[0.045] hover:text-white"
                >
                  <Icon size={15} />
                  {title}
                </Link>
              ))}
            </nav>
          </aside>

          <div className="min-w-0">
            <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30">{label}</span>
                    <Icon size={14} className="text-white/25" />
                  </div>
                  <p className="mt-4 text-2xl font-semibold tabular-nums">{value.toLocaleString("fa-IR")}</p>
                </div>
              ))}
            </section>

            <section className="mt-5 grid gap-5 md:grid-cols-[1.35fr_.65fr]">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-medium">آمار سایت</h2>
                    <p className="mt-1 text-[10px] text-white/25">Traffic analytics</p>
                  </div>
                  <BarChart3 size={17} className="text-white/25" />
                </div>

                <div className="mt-8 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-black/10 text-center">
                  <BarChart3 size={22} className="text-white/15" />
                  <p className="mt-3 text-xs text-white/45">Analytics هنوز متصل نشده</p>
                  <p className="mt-1 max-w-xs text-[10px] leading-5 text-white/20">
                    بازدید، کاربران، صفحات پربازدید و نمودار ۳۰ روزه در این بخش نمایش داده می‌شود.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5">
                <h2 className="text-sm font-medium">Quick actions</h2>
                <div className="mt-4 space-y-2">
                  <Link href="/admin/posts" className="flex items-center justify-between rounded-xl border border-white/[0.06] px-3 py-3 text-xs text-white/55 transition hover:bg-white/[0.04] hover:text-white">
                    مطلب جدید
                    <Plus size={14} />
                  </Link>
                  <Link href="/admin/shots" className="flex items-center justify-between rounded-xl border border-white/[0.06] px-3 py-3 text-xs text-white/55 transition hover:bg-white/[0.04] hover:text-white">
                    Shot جدید
                    <Plus size={14} />
                  </Link>
                  <Link href="/admin/workshops" className="flex items-center justify-between rounded-xl border border-white/[0.06] px-3 py-3 text-xs text-white/55 transition hover:bg-white/[0.04] hover:text-white">
                    کارگاه جدید
                    <Plus size={14} />
                  </Link>
                </div>
              </div>
            </section>

            <section className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium">وضعیت CMS</h2>
                  <p className="mt-1 text-[10px] text-white/25">داده‌های واقعی دیتابیس</p>
                </div>
                <span className="flex items-center gap-2 text-[10px] text-[#50c993]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#32c889]" />
                  Connected
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                <div className="rounded-xl bg-white/[0.025] p-3">
                  <p className="text-white/25">کارگاه‌ها</p>
                  <p className="mt-2 font-medium">{counts.workshops.toLocaleString("fa-IR")}</p>
                </div>
                <div className="rounded-xl bg-white/[0.025] p-3">
                  <p className="text-white/25">Draft مطالب</p>
                  <p className="mt-2 font-medium">{Math.max(counts.posts - counts.published, 0).toLocaleString("fa-IR")}</p>
                </div>
                <div className="rounded-xl bg-white/[0.025] p-3">
                  <p className="text-white/25">رسانه</p>
                  <p className="mt-2 font-medium text-white/35">Storage ready</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
