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
    <div className="group rounded-[26px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/15 hover:bg-white/[0.045]">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/45">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-white/85">{title}</h3>
          <p className="mt-1.5 text-xs leading-6 text-white/35">
            {description}
          </p>

          {action && (
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-500">
              {action}
              <ArrowLeft size={14} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071426] pb-28 text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(circle_at_50%_-10%,rgba(220,20,60,0.20),transparent_50%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[120px] h-[360px] w-[720px] max-w-[110vw] -translate-x-1/2 rounded-[50%] border border-white/[0.025]" />
      <div className="pointer-events-none absolute left-1/2 top-[170px] h-[260px] w-[560px] max-w-[90vw] -translate-x-1/2 rounded-[50%] border border-red-500/[0.035]" />

      <div className="relative mx-auto max-w-5xl px-4 pt-5 sm:px-6 sm:pt-7">
        {/* Header */}
        <header className="flex h-12 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 overflow-hidden rounded-full border border-white/10 bg-[#071426]">
              <img
                src="/snookeria-logo.png"
                alt="لوگوی اسنوکریا"
                className="h-full w-full object-cover"
              />
            </div>

            <span
              dir="ltr"
              className="text-[11px] font-black tracking-[0.24em] text-white/70"
            >
              SNOOKERIA
            </span>
          </div>

          <Link
            href="/live"
            aria-label="پخش زنده"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-white/55 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
          >
            <Radio size={17} />
          </Link>
        </header>

        {/* Hero */}
        <section className="relative mx-auto flex min-h-[520px] max-w-4xl flex-col items-center justify-center pb-16 pt-12 text-center sm:min-h-[620px] sm:pb-20 sm:pt-16">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-[62%] rounded-full bg-red-600/[0.08] blur-[80px] sm:h-80 sm:w-80" />

          <div className="relative">
            <div className="absolute -inset-5 rounded-full border border-red-500/[0.08]" />
            <div className="absolute -inset-10 rounded-full border border-white/[0.025]" />

            <img
              src="/snookeria-logo.png"
              alt="Snookeria"
              className="relative mx-auto h-20 w-20 rounded-full shadow-[0_0_55px_rgba(220,20,60,0.18)] sm:h-24 sm:w-24"
            />
          </div>

          <p
            dir="ltr"
            className="mt-9 text-[11px] font-black tracking-[0.48em] text-red-500 sm:text-xs"
          >
            SNOOKERIA
          </p>

          <h1 className="mt-5 text-[2.55rem] font-black leading-[1.3] tracking-[-0.045em] sm:text-6xl md:text-7xl">
            جایی برای
            <span className="block bg-gradient-to-l from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              زندگی کردن اسنوکر.
            </span>
          </h1>

          <div className="mt-6 h-px w-12 bg-red-500/70" />

          <p className="mt-6 max-w-xl text-sm font-medium leading-8 text-white/55 sm:text-base">
            اسنوکر برای ما فقط یه بازی نیست؛
            <span className="mr-1 font-bold text-white/85">یه سبک زندگیه.</span>
          </p>

          <div
            dir="ltr"
            className="mt-9 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[9px] font-black tracking-[0.2em] text-white/25 sm:gap-x-4 sm:text-[10px]"
          >
            <span className="transition hover:text-white/60">LIVE</span>
            <span className="h-1 w-1 rounded-full bg-red-500/60" />
            <span className="transition hover:text-white/60">PLAY</span>
            <span className="h-1 w-1 rounded-full bg-red-500/60" />
            <span className="transition hover:text-white/60">LEARN</span>
            <span className="h-1 w-1 rounded-full bg-red-500/60" />
            <span className="transition hover:text-white/60">WATCH</span>
            <span className="h-1 w-1 rounded-full bg-red-500/60" />
            <span className="transition hover:text-white/60">BELONG</span>
          </div>

          <div className="mt-12 flex items-center gap-2 text-[10px] text-white/20">
            <span className="h-5 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <span>دنیای اسنوکر از اینجا شروع میشه</span>
            <span className="h-5 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          </div>
        </section>

        {/* Snookeria personality */}
        <section className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-[28px] border border-red-500/15 bg-gradient-to-br from-red-500/[0.075] via-white/[0.025] to-transparent p-5 sm:p-6">
            <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-red-500/[0.06] blur-3xl" />

            <div className="relative flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-500/10 bg-red-500/10 text-red-500">
                <Sparkles size={20} />
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-red-500">
                  SNOOKERIA SAYS
                </p>
                <h2 className="mt-2 text-lg font-bold leading-8">
                  میز همیشه چیزی برای یاد دادن داره.
                </h2>
                <p className="mt-2 text-xs leading-6 text-white/35">
                  صدای روزانه اسنوکریا؛ این بخش بعداً از پنل مدیریت منتشر و به‌روزرسانی می‌شود.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Live */}
        <section className="mx-auto mt-10 max-w-3xl">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] text-red-500">
                LIVE & MATCH CENTER
              </p>
              <h2 className="mt-1.5 text-xl font-bold">همین حالا روی میز</h2>
            </div>

            <Link
              href="/live"
              className="flex items-center gap-1 text-xs text-white/40 hover:text-white"
            >
              مشاهده لایو
              <ArrowLeft size={13} />
            </Link>
          </div>

          <EmptyCard
            icon={<Radio size={20} />}
            title="فعلاً میزها ساکتن."
            description="وقتی مسابقه زنده یا Match Center فعال باشد، از همین‌جا وارد جریان بازی می‌شوی."
            href="/live"
            action="رفتن به Live Center"
          />
        </section>

        {/* Shot of the day */}
        <section className="mx-auto mt-10 max-w-3xl">
          <div className="mb-4">
            <p className="text-[10px] font-bold tracking-[0.22em] text-red-500">
              SHOT OF THE DAY
            </p>
            <h2 className="mt-1.5 text-xl font-bold">تو چه ضربه‌ای می‌زدی؟</h2>
          </div>

          <EmptyCard
            icon={<Target size={20} />}
            title="شات امروز هنوز منتشر نشده."
            description="موقعیت‌های واقعی مسابقات و تمرین‌های منتخب اینجا به یک تجربه تعاملی تبدیل می‌شوند."
            href="/academy"
            action="ورود به آکادمی"
          />
        </section>

        {/* Discover */}
        <section className="mx-auto mt-10 max-w-3xl">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] text-red-500">
                DISCOVER SNOOKER
              </p>
              <h2 className="mt-1.5 text-xl font-bold">
                داستان‌ها، لحظه‌ها و دنیای اسنوکر
              </h2>
            </div>

            <Link
              href="/discover"
              className="flex items-center gap-1 text-xs text-white/40 hover:text-white"
            >
              کشف
              <ArrowLeft size={13} />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <EmptyCard
              icon={<BookOpen size={20} />}
              title="هنوز داستانی منتشر نشده."
              description="داستان بازیکنان، اسطوره‌ها، مقالات و روایت‌های اسنوکر اینجا نمایش داده می‌شوند."
            />

            <EmptyCard
              icon={<Compass size={20} />}
              title="محتوای تازه در راه است."
              description="خبر، ویدئو، تحلیل، 147 و محتوای منتخب از پنل مدیریت وارد Discover می‌شوند."
            />
          </div>
        </section>

        {/* Main destinations */}
        <section className="mx-auto mt-10 max-w-3xl">
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/tournaments"
              className="group rounded-[26px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-red-500/20 hover:bg-red-500/[0.04]"
            >
              <Trophy size={22} className="text-red-500" />
              <h2 className="mt-4 text-lg font-bold">مسابقات</h2>
              <p className="mt-2 text-xs leading-6 text-white/35">
                تورنمنت‌ها، نتایج، Match Center و رقابت‌های اسنوکر.
              </p>
              <ArrowLeft
                size={16}
                className="mt-4 text-white/30 transition group-hover:-translate-x-1 group-hover:text-red-500"
              />
            </Link>

            <Link
              href="/academy"
              className="group rounded-[26px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-red-500/20 hover:bg-red-500/[0.04]"
            >
              <GraduationCap size={23} className="text-red-500" />
              <h2 className="mt-4 text-lg font-bold">آکادمی اسنوکریا</h2>
              <p className="mt-2 text-xs leading-6 text-white/35">
                آموزش، تمرین، کارگاه‌ها و مسیر رشد بازیکن.
              </p>
              <ArrowLeft
                size={16}
                className="mt-4 text-white/30 transition group-hover:-translate-x-1 group-hover:text-red-500"
              />
            </Link>
          </div>
        </section>

        <footer className="mx-auto mt-16 max-w-3xl border-t border-white/10 py-8 text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-white/35">
            SNOOKERIA
          </p>
          <p className="mt-2 text-xs text-white/20">
            جایی برای زندگی کردن اسنوکر.
          </p>
        </footer>
      </div>
    </main>
  );
}
