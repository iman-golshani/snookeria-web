import Link from "next/link";
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

function EmptyCard({
  icon,
  title,
  description,
  href,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  const content = (
    <div className="group rounded-[24px] border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/15 hover:bg-white/[0.04]">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/40">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-white/80">{title}</h3>
          <p className="mt-1.5 text-xs leading-6 text-white/35">{description}</p>
          {action && (
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-red-500">
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
}: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <p dir="ltr" className="text-[9px] font-black tracking-[0.22em] text-red-500">
          {eyebrow}
        </p>
        <h2 className="mt-1.5 text-lg font-black sm:text-xl">{title}</h2>
      </div>
      {href && linkLabel && (
        <Link href={href} className="flex shrink-0 items-center gap-1 text-[11px] text-white/35 transition hover:text-white">
          {linkLabel}
          <ArrowLeft size={13} />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071426] pb-28 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_50%_-10%,rgba(220,20,60,0.17),transparent_55%)]" />

      <div className="relative mx-auto max-w-5xl px-4 pt-4 sm:px-6 sm:pt-6">
        <header className="flex h-12 items-center justify-between border-b border-white/[0.06]">
          <span dir="ltr" className="text-[12px] font-black tracking-[0.28em] text-white/75">SNOOKERIA</span>
          <Link href="/live" aria-label="پخش زنده" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/45 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500">
            <Radio size={17} />
          </Link>
        </header>

        <section className="relative mx-auto flex min-h-[390px] max-w-4xl flex-col items-center justify-center pb-12 pt-8 text-center sm:min-h-[500px] sm:pb-16 sm:pt-12">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-[60%] rounded-full bg-red-600/[0.055] blur-[90px]" />
          <p dir="ltr" className="text-[9px] font-black tracking-[0.5em] text-red-500 sm:text-[11px]">SNOOKERIA</p>
          <h1 className="mt-5 text-[2.55rem] font-black leading-[1.3] tracking-[-0.05em] sm:text-6xl md:text-7xl">
            جایی برای
            <span className="block text-red-500">زندگی کردن اسنوکر.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm font-medium leading-8 text-white/45 sm:text-base">
            اسنوکر برای ما فقط یه بازی نیست؛ <span className="font-bold text-white/80">یه سبک زندگیه.</span>
          </p>
          <div dir="ltr" className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[8px] font-black tracking-[0.2em] text-white/22 sm:text-[9px]">
            <span>LIVE</span><span className="h-1 w-1 rounded-full bg-red-500/55" />
            <span>PLAY</span><span className="h-1 w-1 rounded-full bg-red-500/55" />
            <span>LEARN</span><span className="h-1 w-1 rounded-full bg-red-500/55" />
            <span>WATCH</span><span className="h-1 w-1 rounded-full bg-red-500/55" />
            <span>BELONG</span>
          </div>
        </section>

        <div className="mx-auto max-w-3xl">
          <section className="mb-11">
            <div className="relative overflow-hidden rounded-[26px] border border-red-500/15 bg-gradient-to-br from-red-500/[0.07] via-white/[0.02] to-transparent p-5">
              <div className="relative flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500"><Sparkles size={18} /></div>
                <div>
                  <p dir="ltr" className="text-[9px] font-black tracking-[0.2em] text-red-500">SNOOKERIA SAYS</p>
                  <h2 className="mt-2 text-base font-bold leading-7">میز همیشه چیزی برای یاد دادن داره.</h2>
                  <p className="mt-1.5 text-[11px] leading-6 text-white/30">این بخش بعداً مستقیماً از پنل مدیریت منتشر می‌شود.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-11">
            <SectionTitle eyebrow="LIVE & MATCH CENTER" title="همین حالا روی میز" href="/live" linkLabel="مشاهده همه" />
            <EmptyCard icon={<Radio size={19} />} title="فعلاً مسابقه زنده‌ای وجود ندارد." description="مسابقات آماده شروع و در حال برگزاری، به‌صورت خودکار در این بخش نمایش داده می‌شوند." href="/live" action="Live Center" />
          </section>

          <section className="mb-11">
            <SectionTitle eyebrow="SHOT OF THE DAY" title="تو چه ضربه‌ای می‌زدی؟" />
            <div className="relative min-h-44 overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.02] p-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,20,60,0.07),transparent_42%)]" />
              <div className="relative flex min-h-32 flex-col items-center justify-center text-center">
                <Target size={25} className="text-white/20" />
                <h3 className="mt-3 text-sm font-bold text-white/60">شات امروز هنوز منتشر نشده.</h3>
                <p className="mt-2 max-w-sm text-[11px] leading-6 text-white/30">بعداً تصویر میز و موقعیت واقعی شات در همین کارت قرار می‌گیرد و کاربر می‌تواند انتخاب خودش را ثبت کند.</p>
              </div>
            </div>
          </section>

          <section className="mb-11">
            <SectionTitle eyebrow="DISCOVER" title="داستان‌ها و دنیای اسنوکر" href="/discover" linkLabel="مشاهده همه" />
            <div className="grid gap-3 sm:grid-cols-2">
              <EmptyCard icon={<BookOpen size={19} />} title="هنوز مقاله‌ای منتشر نشده." description="داستان بازیکنان، اسطوره‌ها، تاریخ اسنوکر و مقالات منتخب اینجا قرار می‌گیرند." />
              <EmptyCard icon={<Compass size={19} />} title="محتوای تازه در راه است." description="ویدئو، تحلیل، خبر و برنامه 147 از همین بخش قابل دنبال کردن خواهد بود." />
            </div>
          </section>

          <section className="mb-4">
            <SectionTitle eyebrow="SNOOKERIA" title="بخش‌های اصلی" />
            <div className="grid grid-cols-2 gap-3">
              <Link href="/tournaments" className="group rounded-[24px] border border-white/10 bg-white/[0.025] p-5 transition hover:border-red-500/20 hover:bg-red-500/[0.04]">
                <Trophy size={21} className="text-red-500" />
                <h2 className="mt-4 text-base font-black">مسابقات</h2>
                <p className="mt-1.5 text-[11px] leading-5 text-white/30">تورنمنت، نتیجه و Match Center</p>
                <ArrowLeft size={14} className="mt-4 text-white/25 transition group-hover:-translate-x-1 group-hover:text-red-500" />
              </Link>
              <Link href="/academy" className="group rounded-[24px] border border-white/10 bg-white/[0.025] p-5 transition hover:border-red-500/20 hover:bg-red-500/[0.04]">
                <GraduationCap size={22} className="text-red-500" />
                <h2 className="mt-4 text-base font-black">آکادمی</h2>
                <p className="mt-1.5 text-[11px] leading-5 text-white/30">آموزش، تمرین و کارگاه‌ها</p>
                <ArrowLeft size={14} className="mt-4 text-white/25 transition group-hover:-translate-x-1 group-hover:text-red-500" />
              </Link>
            </div>
          </section>
        </div>

        <footer className="mx-auto mt-14 max-w-3xl border-t border-white/[0.07] py-8 text-center">
          <p dir="ltr" className="text-[10px] font-black tracking-[0.25em] text-white/25">SNOOKERIA</p>
          <p className="mt-2 text-[10px] text-white/15">جایی برای زندگی کردن اسنوکر.</p>
        </footer>
      </div>
    </main>
  );
}
