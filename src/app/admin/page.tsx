"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpLeft,
  BarChart3,
  BookOpen,
  Eye,
  FileText,
  LayoutDashboard,
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

const menu = [
  { title: "داشبورد", href: "/admin", icon: LayoutDashboard, active: true },
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
      const { data } = await cmsSupabase.auth.getSession();
      if (!data.session) {
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

  if (!ready) return <main className="min-h-screen bg-[#06111c]" />;

  const stats = [
    { label: "کل مطالب", value: counts.posts, icon: FileText, accent: "red" },
    { label: "منتشر شده", value: counts.published, icon: Eye, accent: "green" },
    { label: "Shotها", value: counts.shots, icon: Target, accent: "green" },
    { label: "ثبت‌نام‌ها", value: counts.registrations, icon: Users, accent: "red" },
  ];

  return (
    <main dir="rtl" className="relative min-h-screen overflow-hidden bg-[#06111c] text-white">
      <div className="pointer-events-none fixed -right-32 -top-40 h-[520px] w-[520px] rounded-full bg-[#08754f]/20 blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-48 -left-36 h-[520px] w-[520px] rounded-full bg-[#b81222]/15 blur-[130px]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-64 shrink-0 border-l border-white/[0.07] bg-[#071a22]/80 p-5 backdrop-blur-xl lg:flex lg:flex-col">
          <div className="px-2 py-3">
            <div dir="ltr" className="flex items-center gap-0.5 text-lg font-black tracking-[.13em]">
              SN
              <span className="mx-[1px] h-3.5 w-3.5 rounded-full bg-[#e3222b] shadow-[0_0_16px_rgba(227,34,43,.55)]" />
              <span className="mx-[1px] h-3.5 w-3.5 rounded-full bg-[#20a86b] shadow-[0_0_16px_rgba(32,168,107,.45)]" />
              KERIA
            </div>
            <p className="mt-2 text-[9px] font-medium tracking-[.2em] text-white/25">CONTENT STUDIO</p>
          </div>

          <nav className="mt-8 space-y-1.5">
            {menu.map(({ title, href, icon: Icon, active }) => (
              <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-xs transition ${active ? "bg-[#15905f]/15 text-[#56d99c] ring-1 ring-[#38b87e]/15" : "text-white/48 hover:bg-white/[0.04] hover:text-white"}`}>
                <Icon size={17} />
                <span className="font-medium">{title}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-[#15905f]/15 bg-[#0a2a27]/55 p-4">
            <div className="flex items-center gap-2 text-[10px] text-[#63dba3]">
              <span className="h-2 w-2 rounded-full bg-[#28c77e] shadow-[0_0_10px_rgba(40,199,126,.7)]" />
              CMS Connected
            </div>
            <p className="mt-2 text-[10px] leading-5 text-white/25">Snookeria Web CMS</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1 px-4 py-5 sm:px-7 lg:px-9 lg:py-7">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-[#55d49a]">مدیریت اسنوکریا</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">داشبورد</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="flex h-10 items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#0b202a]/70 px-3.5 text-[11px] text-white/55 backdrop-blur transition hover:border-[#1aa26a]/30 hover:text-white">
                سایت
                <ArrowUpLeft size={14} />
              </Link>
              <button onClick={logout} aria-label="خروج" className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0b202a]/70 text-white/40 transition hover:border-[#e3222b]/30 hover:text-[#ff5360]">
                <LogOut size={16} />
              </button>
            </div>
          </header>

          <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {menu.slice(1).map(({ title, href, icon: Icon }) => (
              <Link key={href} href={href} className="flex shrink-0 items-center gap-2 rounded-xl border border-white/[0.07] bg-[#0b202a]/75 px-3 py-2.5 text-[10px] text-white/55">
                <Icon size={14} /> {title}
              </Link>
            ))}
          </nav>

          <section className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, accent }) => (
              <div key={label} className="group relative overflow-hidden rounded-[22px] border border-white/[0.075] bg-[#0a1b25]/80 p-4 shadow-[0_18px_45px_rgba(0,0,0,.14)] backdrop-blur sm:p-5">
                <div className={`absolute inset-x-0 top-0 h-[2px] ${accent === "green" ? "bg-[#20a86b]" : "bg-[#e3222b]"}`} />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-white/38">{label}</span>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${accent === "green" ? "bg-[#15905f]/12 text-[#55d49a]" : "bg-[#e3222b]/10 text-[#ff5360]"}`}>
                    <Icon size={15} />
                  </div>
                </div>
                <p className="mt-5 text-3xl font-black tabular-nums">{value.toLocaleString("fa-IR")}</p>
              </div>
            ))}
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_.75fr]">
            <div className="relative overflow-hidden rounded-[26px] border border-[#1b9b68]/15 bg-gradient-to-br from-[#0b292b]/90 via-[#091c27]/95 to-[#081723]/95 p-5 sm:p-6">
              <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#1aa26a]/12 blur-[70px]" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-[#5cd99f]">ANALYTICS</p>
                  <h2 className="mt-1.5 text-base font-bold">آمار سایت</h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#169260]/12 text-[#55d49a]">
                  <BarChart3 size={19} />
                </div>
              </div>

              <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/[0.055] bg-[#07151e]/55 p-4">
                  <p className="text-[9px] text-white/30">بازدید ۳۰ روز</p>
                  <p className="mt-2 text-lg font-bold text-white/40">—</p>
                </div>
                <div className="rounded-2xl border border-white/[0.055] bg-[#07151e]/55 p-4">
                  <p className="text-[9px] text-white/30">کاربران</p>
                  <p className="mt-2 text-lg font-bold text-white/40">—</p>
                </div>
                <div className="col-span-2 rounded-2xl border border-white/[0.055] bg-[#07151e]/55 p-4 sm:col-span-1">
                  <p className="text-[9px] text-white/30">Top Page</p>
                  <p className="mt-2 text-[11px] font-medium text-white/35">در انتظار اتصال</p>
                </div>
              </div>

              <div className="relative mt-4 flex h-32 items-end gap-1.5 overflow-hidden rounded-2xl border border-white/[0.045] bg-[#06141c]/50 px-4 pb-4 pt-7">
                {[28, 42, 34, 58, 47, 69, 52, 76, 62, 84, 68, 91, 73, 88].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t-sm bg-gradient-to-t from-[#117b54]/30 to-[#31bc7e]/45" style={{ height: `${height}%` }} />
                ))}
                <p className="absolute inset-x-0 top-3 text-center text-[9px] text-white/18">نمایش نمونه تا اتصال Analytics واقعی</p>
              </div>
            </div>

            <div className="rounded-[26px] border border-[#e3222b]/14 bg-gradient-to-b from-[#18131c]/95 to-[#0b1822]/95 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-[#ff5964]">CREATE</p>
                  <h2 className="mt-1.5 text-base font-bold">انتشار سریع</h2>
                </div>
                <Plus size={18} className="text-[#ff5360]" />
              </div>
              <div className="mt-5 space-y-2">
                {[
                  ["مطلب جدید", "/admin/posts", BookOpen],
                  ["Shot جدید", "/admin/shots", Target],
                  ["کارگاه جدید", "/admin/workshops", Wrench],
                ].map(([title, href, Icon]) => {
                  const ItemIcon = Icon as typeof BookOpen;
                  return (
                    <Link key={href as string} href={href as string} className="group flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3.5 text-xs font-medium text-white/65 transition hover:border-[#e3222b]/20 hover:bg-[#e3222b]/[0.05] hover:text-white">
                      <span className="flex items-center gap-3"><ItemIcon size={15} className="text-[#ff5360]" />{title as string}</span>
                      <ArrowLeft size={14} className="text-white/20 transition group-hover:-translate-x-1 group-hover:text-[#ff5360]" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-white/[0.07] bg-[#0a1b25]/75 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold">محتوا</h2>
                <Link href="/admin/posts" className="text-[10px] text-[#55d49a]">مدیریت</Link>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-[#07151e]/75 p-3"><p className="text-[9px] text-white/28">Draft</p><p className="mt-2 font-bold">{Math.max(counts.posts - counts.published, 0).toLocaleString("fa-IR")}</p></div>
                <div className="rounded-2xl bg-[#07151e]/75 p-3"><p className="text-[9px] text-white/28">Published</p><p className="mt-2 font-bold text-[#55d49a]">{counts.published.toLocaleString("fa-IR")}</p></div>
                <div className="rounded-2xl bg-[#07151e]/75 p-3"><p className="text-[9px] text-white/28">Total</p><p className="mt-2 font-bold">{counts.posts.toLocaleString("fa-IR")}</p></div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/[0.07] bg-[#0a1b25]/75 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold">آکادمی و رویداد</h2>
                <span className="text-[9px] text-white/22">LIVE DATA</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-[#0a2927]/65 p-3"><p className="text-[9px] text-white/28">کارگاه‌ها</p><p className="mt-2 font-bold text-[#55d49a]">{counts.workshops.toLocaleString("fa-IR")}</p></div>
                <div className="rounded-2xl bg-[#17131b]/70 p-3"><p className="text-[9px] text-white/28">ثبت‌نام‌ها</p><p className="mt-2 font-bold text-[#ff5964]">{counts.registrations.toLocaleString("fa-IR")}</p></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
