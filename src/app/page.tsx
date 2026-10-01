import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  GraduationCap,
  Radio,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

function SnookeriaWordmark() {
  return (
    <div dir="ltr" className="flex items-center gap-2" aria-label="Snookeria">
      <span className="text-[15px] font-black tracking-[0.18em] text-white sm:text-base">
        SNOOKERIA
      </span>
      <span className="h-2.5 w-2.5 rounded-full bg-[#e3222b] shadow-[0_0_14px_rgba(227,34,43,0.55)]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#16a36a] shadow-[0_0_14px_rgba(22,163,106,0.45)]" />
    </div>
  );
}

function EmptyCard({
  icon,
  title,
  description,
  href,
  action,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  action?: string;
  tone?: "neutral" | "red" | "green";
}) {
  const toneClass =
    tone === "green"
      ? "border-[#16a36a]/20 bg-[#16a36a]/[0.045]"
      : tone === "red"
        ? "border-[#e3222b]/20 bg-[#e3222b]/[0.045]"
        : "border-white/[0.08] bg-white/[0.025]";

  const accentClass =
    tone === "green"
      ? "bg-[#16a36a]/10 text-[#32c889]"
      : tone === "red"
        ? "bg-[#e3222b]/10 text-[#ff4b53]"
        : "bg-white/[0.04] text-white/40";

  const content = (
    <div className={`group rounded-[26px] border ${toneClass} p-5 transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.04]`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accentClass}`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-white/85">{title}</h3>
          <p className="mt-1.5 text-xs leading-6 text-white/38">{description}</p>
          {action && (
            <div className={`mt-3 flex items-center gap-1.5 text-[11px] font-bold ${tone === "green" ? "text-[#32c889]" : "text-[#ff4b53]"}`}>
              {action}
              <ArrowLeft size={13} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function SectionTitle({
  eyebrow,
  title,
  href,
  linkLabel,
  tone = "red",
}: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
  tone?: "red" | "green";
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <p
          dir="ltr"
          className={`text-[9px] font-black tracking-[0.22em] ${tone === "green" ? "text-[#32c889]" : "text-[#ff4b53]"}`}
        >
          {eyebrow}
        </p>
        <h2 className="mt-1.5 text-lg font-black sm:text-xl">{title}</h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-1 text-[11px] text-white/35 transition hover:text-white"
        >
          {linkLabel}
          <ArrowLeft size={13} />
        </Link>
      )}
    </div>
  );
}

export const revalidate = 60;

export default async function Home() {
  const cms = createClient(process.env.NEXT_PUBLIC_CMS_SUPABASE_URL!, process.env.NEXT_PUBLIC_CMS_SUPABASE_ANON_KEY!, { auth:{persistSession:false} });
  const { data: latestPosts } = await cms.from("posts").select("id,title,slug,excerpt,cover_image_url,category").eq("status","published").order("published_at",{ascending:false}).limit(2);
  const homePosts = latestPosts ?? [];
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05090d] pb-28 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[540px] bg-[radial-gradient(circle_at_75%_0%,rgba(22,163,106,0.10),transparent_38%),radial-gradient(circle_at_25%_5%,rgba(227,34,43,0.13),transparent_42%)]" />

      <div className="relative mx-auto max-w-5xl px-4 pt-4 sm:px-6 sm:pt-6">
        <header className="flex h-14 items-center justify-between border-b border-white/[0.06]">
          <SnookeriaWordmark />
          <Link
            href="/live"
            aria-label="پخش زنده"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#e3222b]/20 bg-[#e3222b]/[0.07] text-[#ff4b53] transition hover:bg-[#e3222b]/15"
          >
            <Radio size={17} />
          </Link>
        </header>

        <section className="relative mx-auto flex min-h-[390px] max-w-4xl flex-col items-center justify-center pb-12 pt-8 text-center sm:min-h-[500px] sm:pb-16 sm:pt-12">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-[60%] rounded-full bg-[#16a36a]/[0.035] blur-[90px]" />

          <div dir="ltr" className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#e3222b]" />
            <p className="text-[9px] font-black tracking-[0.48em] text-white/55 sm:text-[10px]">
              SNOOKERIA
            </p>
            <span className="h-2 w-2 rounded-full bg-[#16a36a]" />
          </div>

          <h1 className="mt-6 text-[2.55rem] font-black leading-[1.3] tracking-[-0.05em] sm:text-6xl md:text-7xl">
            جایی برای
            <span className="block text-white">زندگی کردن اسنوکر.</span>
          </h1>

          <div className="mt-5 flex items-center gap-2">
            <span className="h-1 w-8 rounded-full bg-[#e3222b]" />
            <span className="h-1 w-8 rounded-full bg-[#16a36a]" />
          </div>

          <p className="mt-6 max-w-xl text-sm font-medium leading-8 text-white/45 sm:text-base">
            اسنوکر برای ما فقط یه بازی نیست؛{" "}
            <span className="font-bold text-white/85">یه سبک زندگیه.</span>
          </p>

          <div
            dir="ltr"
            className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[8px] font-black tracking-[0.2em] text-white/25 sm:text-[9px]"
          >
            <span className="text-[#ff4b53]">LIVE</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>PLAY</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="text-[#32c889]">LEARN</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>WATCH</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>BELONG</span>
          </div>
        </section>

        <div className="mx-auto max-w-3xl">
          <section className="mb-11">
            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0a1015] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
              <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-[#e3222b] to-[#16a36a]" />
              <div className="relative flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04] text-white/65">
                  <Sparkles size={19} />
                </div>
                <div>
                  <p dir="ltr" className="text-[9px] font-black tracking-[0.2em] text-[#32c889]">
                    SNOOKERIA SAYS
                  </p>
                  <h2 className="mt-2 text-base font-bold leading-7">
                    میز همیشه چیزی برای یاد دادن داره.
                  </h2>
                  <p className="mt-1.5 text-[11px] leading-6 text-white/30">
                    این بخش بعداً مستقیماً از پنل مدیریت منتشر می‌شود.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-11">
            <SectionTitle
              eyebrow="LIVE & MATCH CENTER"
              title="همین حالا روی میز"
              href="/live"
              linkLabel="مشاهده همه"
            />
            <EmptyCard
              icon={<Radio size={19} />}
              title="فعلاً مسابقه زنده‌ای وجود ندارد."
              description="مسابقات آماده شروع و در حال برگزاری، به‌صورت خودکار در این بخش نمایش داده می‌شوند."
              href="/live"
              action="Live Center"
              tone="red"
            />
          </section>

          <section className="mb-11">
            <SectionTitle
              eyebrow="SHOT OF THE DAY"
              title="تو چه ضربه‌ای می‌زدی؟"
              tone="green"
            />
            <div className="relative min-h-48 overflow-hidden rounded-[28px] border border-[#16a36a]/20 bg-[#07130f] p-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(22,163,106,0.12),transparent_45%)]" />
              <div className="relative flex min-h-36 flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16a36a]/10 text-[#32c889]">
                  <Target size={24} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-white/70">
                  شات امروز هنوز منتشر نشده.
                </h3>
                <p className="mt-2 max-w-sm text-[11px] leading-6 text-white/32">
                  موقعیت واقعی میز و انتخاب ضربه از پنل مدیریت در همین کارت منتشر می‌شود.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-11">
            <SectionTitle
              eyebrow="DISCOVER"
              title="داستان‌ها و دنیای اسنوکر"
              href="/discover"
              linkLabel="مشاهده همه"
            />
            {homePosts.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {homePosts.map((post) => (
                  <Link key={post.id} href={`/discover/${post.slug}`} className="group overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#0a1015] transition hover:-translate-y-0.5 hover:border-[#16a36a]/25">
                    {post.cover_image_url ? <img src={post.cover_image_url} alt={post.title} className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.02]" /> : <div className="flex aspect-video items-center justify-center bg-[#07130f]"><BookOpen size={22} className="text-[#32c889]/40"/></div>}
                    <div className="p-4">
                      <p className="text-[9px] font-black text-[#32c889]">DISCOVER</p>
                      <h3 className="mt-2 text-sm font-black leading-6">{post.title}</h3>
                      {post.excerpt && <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 text-white/35">{post.excerpt}</p>}
                      <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-[#32c889]">ادامه مطلب <ArrowLeft size={12}/></div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <EmptyCard icon={<BookOpen size={19} />} title="هنوز مقاله‌ای منتشر نشده." description="داستان بازیکنان، اسطوره‌ها، تاریخ اسنوکر و مقالات منتخب اینجا قرار می‌گیرند." />
                <EmptyCard icon={<Compass size={19} />} title="محتوای تازه در راه است." description="ویدئو، تحلیل، خبر و برنامه 147 از همین بخش قابل دنبال کردن خواهد بود." />
              </div>
            )}
          </section>

          <section className="mb-4">
            <SectionTitle eyebrow="SNOOKERIA" title="بخش‌های اصلی" />
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/tournaments"
                className="group relative overflow-hidden rounded-[26px] border border-[#e3222b]/15 bg-[#0c0d11] p-5 transition hover:-translate-y-0.5 hover:border-[#e3222b]/30"
              >
                <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[#e3222b]/[0.07] blur-3xl" />
                <div className="relative">
                  <Trophy size={22} className="text-[#ff4b53]" />
                  <h2 className="mt-4 text-base font-black">مسابقات</h2>
                  <p className="mt-1.5 text-[11px] leading-5 text-white/30">
                    تورنمنت، نتیجه و Match Center
                  </p>
                  <ArrowLeft
                    size={14}
                    className="mt-4 text-white/25 transition group-hover:-translate-x-1 group-hover:text-[#ff4b53]"
                  />
                </div>
              </Link>

              <Link
                href="/academy"
                className="group relative overflow-hidden rounded-[26px] border border-[#16a36a]/15 bg-[#08110e] p-5 transition hover:-translate-y-0.5 hover:border-[#16a36a]/30"
              >
                <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[#16a36a]/[0.07] blur-3xl" />
                <div className="relative">
                  <GraduationCap size={23} className="text-[#32c889]" />
                  <h2 className="mt-4 text-base font-black">آکادمی</h2>
                  <p className="mt-1.5 text-[11px] leading-5 text-white/30">
                    آموزش، تمرین و کارگاه‌ها
                  </p>
                  <ArrowLeft
                    size={14}
                    className="mt-4 text-white/25 transition group-hover:-translate-x-1 group-hover:text-[#32c889]"
                  />
                </div>
              </Link>
            </div>
          </section>
        </div>

        <footer className="mx-auto mt-14 max-w-3xl border-t border-white/[0.07] py-8 text-center">
          <div className="flex justify-center">
            <SnookeriaWordmark />
          </div>
          <p className="mt-2 text-[10px] text-white/18">جایی برای زندگی کردن اسنوکر.</p>
        </footer>
      </div>
    </main>
  );
}
