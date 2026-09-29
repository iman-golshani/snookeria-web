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
          <p className="mt-1.5 text-xs leading-6 text-white/35">{description}</p>
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
        <h2 className="mt-1.5 text-xl font-black">{title}</h2>
      </div>
      {href && linkLabel && (
        <Link href={href} className="flex shrink-0 items-center gap-1 text-xs text-white/35 transition hover:text-white">
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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[650px] bg-[radial-gradient(circle_at_50%_-5%,rgba(220,20,60,0.18),transparent_52%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[135px] h-[300px] w-[700px] max-w-[110vw] -translate-x-1/2 rounded-[50%] border border-white/[0.025]" />

      <div className="relative mx-auto max-w-5xl px-4 pt-5 sm:px-6 sm:pt-7">
        <header className="flex h-12 items-center justify-between border-b border-white/[0.06]">
          <span dir="ltr" className="text-[12px] font-black tracking-[0.28em] text-white/75">
            SNOOKERIA
          </span>
          <Link
            href="/live"
            aria-label="پخش زنده"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/50 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
          >
            <Radio size={17} />
          </Link>
        </header>

        <section className="relative mx-auto flex min-h-[455px] max-w-4xl flex-col items-center justify-center pb-14 pt-10 text-center sm:min-h-[560px] sm:pb-20 sm:pt-14">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-[58%] rounded-full bg-red-600/[0.065] blur-[90px]" />

          <p dir="ltr" className="text-[10px] font-black tracking-[0.5em] text-red-500 sm:text-xs">
            SNOOKERIA
          </p>

          <h1 className="mt-6 text-[2.65rem] font-black leading-[1.28] tracking-[-0.05em] sm:text-6xl md:text-7xl">
            جایی برای
            <span className="block bg-gradient-to-l from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              زندگی کردن اسنوکر.
            </span>
          </h1>

          <div className="mt-7 h-px w-12 bg-red-500/70" />

          <p className="mt-6 max-w-xl text-sm font-medium leading-8 text-white/50 sm:text-base">
            اسنوکر برای ما فقط یه بازی نیست؛
            <span className="mr-1 font-bold text-white/85">یه سبک زندگیه.</span>
          </p>

          <div dir="ltr" className="mt-9 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[9px] font-black tracking-[0.2em] text-white/25 sm:gap-x-4 sm:text-[10px]">
            <span>LIVE</span><span className="h-1 w-1 rounded-full bg-red-500/60" />
            <span>PLAY</span><span className="h-1 w-1 rounded-full bg-red-500/60" />
            <span>LEARN</span><span className="h-1 w-1 rounded-full bg-red-500/60" />
            <span>WATCH</span><span className="h-1 w-1 rounded-full bg-red-500/60" />
            <span>BELONG</span>
          </div>

          <p className="mt-11 text-[10px] text-white/20">دنیای اسنوکر از اینجا شروع میشه</p>
        </section>

        <div className="mx-auto max-w-3xl space-y-12">
          <section>
            <div className="relative overflow-hidden rounded-[28px] border border-red-500/15 bg-gradient-to-br from-red-500/[0.075] via-white/[0.025] to-transparent p-5 sm:p-6">
              <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-red-500/[0.06] blur-3xl" />
              <div className="relative flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-500/10 bg-red-500/10 text-red-500">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p dir="ltr" className="text-[9px] font-black tracking-[0.2em] text-red-500">SNOOKERIA SAYS</p>
                  <h2 className="mt-2 text-lg font-bold leading-8">میز همیشه چیزی برای یاد دادن داره.</h2>
                  <p className="mt-2 text-xs leading-6 text-white/35">صدای اسنوکریا؛ بعداً محتوای این کارت مستقیماً از پنل مدیریت منتشر می‌شود.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <SectionTitle eyebrow="LIVE & MATCH CENTER" title="همین حالا روی میز" href="/live" linkLabel="مشاهده لایو" />
            <EmptyCard
              icon={<Radio size={20} />}
              title="فعلاً میزها ساکتن."
              description="وقتی مسابقه‌ای آماده شروع یا در حال برگزاری باشد، از همین بخش وارد Live و Match Center می‌شوی."
              href="/live"
              action="رفتن به Live Center"
            />
          </section>

          <section>
            <SectionTitle eyebrow="SHOT OF THE DAY" title="تو چه ضربه‌ای می‌زدی؟" />
            <EmptyCard
              icon={<Target size={20} />}
              title="شات امروز هنوز منتشر نشده."
              description="موقعیت‌های واقعی مسابقات و تمرین‌های منتخب در این بخش به تجربه تعاملی تبدیل می‌شوند."
              href="/academy"
              action="ورود به آکادمی"
            />
          </section>

          <section>
            <SectionTitle eyebrow="DISCOVER" title="بیشتر از نتیجه یک مسابقه" href="/discover" linkLabel="کشف" />
            <div className="grid gap-3 sm:grid-cols-2">
              <EmptyCard
                icon={<BookOpen size={20} />}
                title="داستان‌ها و مقاله‌ها"
                description="وقتی اولین محتوای واقعی منتشر شود، داستان بازیکنان، اسطوره‌ها و روایت‌های اسنوکر اینجا دیده می‌شوند."
              />
              <EmptyCard
                icon={<Compass size={20} />}
                title="ویدئو، تحلیل و 147"
                description="محتوای منتخب Snookeria از پنل مدیریت وارد این بخش می‌شود."
              />
            </div>
          </section>

          <section>
            <SectionTitle eyebrow="EXPLORE SNOOKERIA" title="مسیر خودت را انتخاب کن" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/tournaments" className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-6 transition hover:border-red-500/25 hover:bg-red-500/[0.04]">
                <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-red-500/[0.05] blur-3xl" />
                <div className="relative">
                  <Trophy size={23} className="text-red-500" />
                  <h2 className="mt-5 text-xl font-black">مسابقات</h2>
                  <p className="mt-2 text-xs leading-6 text-white/35">تورنمنت‌ها، نتایج، رقابت‌ها و Match Center.</p>
                  <ArrowLeft size={16} className="mt-5 text-white/30 transition group-hover:-translate-x-1 group-hover:text-red-500" />
                </div>
              </Link>

              <Link href="/academy" className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-6 transition hover:border-red-500/25 hover:bg-red-500/[0.04]">
                <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-red-500/[0.05] blur-3xl" />
                <div className="relative">
                  <GraduationCap size={24} className="text-red-500" />
                  <h2 className="mt-5 text-xl font-black">آکادمی</h2>
                  <p className="mt-2 text-xs leading-6 text-white/35">آموزش، تمرین، Shot of the Day و کارگاه‌ها.</p>
                  <ArrowLeft size={16} className="mt-5 text-white/30 transition group-hover:-translate-x-1 group-hover:text-red-500" />
                </div>
              </Link>
            </div>
          </section>
        </div>

        <footer className="mx-auto mt-16 max-w-3xl border-t border-white/10 py-8 text-center">
          <p dir="ltr" className="text-xs font-black tracking-[0.25em] text-white/30">SNOOKERIA</p>
          <p className="mt-2 text-xs text-white/20">جایی برای زندگی کردن اسنوکر.</p>
        </footer>
      </div>
    </main>
  );
}
