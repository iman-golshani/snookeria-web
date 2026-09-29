import Link from "next/link";
import { ArrowLeft, BookOpen, Compass, GraduationCap, Radio, Sparkles, Target, Trophy } from "lucide-react";

function EmptyCard({ icon, title, description, href, action }: { icon: React.ReactNode; title: string; description: string; href?: string; action?: string }) {
  const content = (
    <div className="group rounded-[26px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/15 hover:bg-white/[0.045]">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/45">{icon}</div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-white/85">{title}</h3>
          <p className="mt-1.5 text-xs leading-6 text-white/35">{description}</p>
          {action && <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-500">{action}<ArrowLeft size={14} /></div>}
        </div>
      </div>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071426] pb-28 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_50%_0%,rgba(220,20,60,0.14),transparent_58%)]" />
      <div className="relative mx-auto max-w-5xl px-4 pt-7 sm:px-6 sm:pt-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5"><div className="h-9 w-9 overflow-hidden rounded-full border border-white/10"><img src="/snookeria-logo.png" alt="لوگوی اسنوکریا" className="h-full w-full object-cover" /></div><span className="text-xs font-bold tracking-[0.22em] text-white/70">SNOOKERIA</span></div>
          <Link href="/live" aria-label="پخش زنده" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-white/55 transition hover:text-red-500"><Radio size={17} /></Link>
        </header>

        <section className="mx-auto flex min-h-[430px] max-w-3xl flex-col items-center justify-center py-14 text-center sm:min-h-[500px]">
          <div className="relative"><div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-3xl" /><img src="/snookeria-logo.png" alt="Snookeria" className="relative mx-auto h-24 w-24 rounded-full sm:h-28 sm:w-28" /></div>
          <p className="mt-7 text-[11px] font-bold tracking-[0.42em] text-red-500 sm:text-xs">SNOOKERIA</p>
          <h1 className="mt-4 text-4xl font-black leading-[1.35] tracking-tight sm:text-6xl">جایی برای<span className="block text-red-500">زندگی کردن اسنوکر.</span></h1>
          <p className="mt-6 max-w-xl text-sm leading-8 text-white/50 sm:text-base">اسنوکر برای ما فقط یه بازی نیست؛ یه سبک زندگیه.</p>
          <div dir="ltr" className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[10px] font-bold tracking-[0.18em] text-white/25 sm:text-xs"><span>LIVE</span><span className="text-red-500/50">•</span><span>PLAY</span><span className="text-red-500/50">•</span><span>LEARN</span><span className="text-red-500/50">•</span><span>WATCH</span><span className="text-red-500/50">•</span><span>BELONG</span></div>
        </section>

        <section className="mx-auto max-w-3xl"><div className="rounded-[28px] border border-red-500/15 bg-gradient-to-br from-red-500/[0.07] to-white/[0.025] p-5 sm:p-6"><div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500"><Sparkles size={20} /></div><div><p className="text-[10px] font-bold tracking-[0.2em] text-red-500">SNOOKERIA SAYS</p><h2 className="mt-2 text-lg font-bold">میز همیشه چیزی برای یاد دادن داره.</h2><p className="mt-2 text-xs leading-6 text-white/40">این بخش شخصیت روزانه اسنوکریاست و بعداً از پنل مدیریت به‌روزرسانی می‌شود.</p></div></div></div></section>

        <section className="mx-auto mt-10 max-w-3xl"><div className="mb-4 flex items-end justify-between"><div><p className="text-[10px] font-bold tracking-[0.22em] text-red-500">LIVE & MATCH CENTER</p><h2 className="mt-1.5 text-xl font-bold">همین حالا روی میز</h2></div><Link href="/live" className="flex items-center gap-1 text-xs text-white/40 hover:text-white">مشاهده لایو <ArrowLeft size={13} /></Link></div><EmptyCard icon={<Radio size={20} />} title="فعلاً میزها ساکتن." description="وقتی مسابقه زنده یا Match Center فعال باشد، از همین‌جا وارد جریان بازی می‌شوی." href="/live" action="رفتن به Live Center" /></section>

        <section className="mx-auto mt-10 max-w-3xl"><div className="mb-4"><p className="text-[10px] font-bold tracking-[0.22em] text-red-500">SHOT OF THE DAY</p><h2 className="mt-1.5 text-xl font-bold">تو چه ضربه‌ای می‌زدی؟</h2></div><EmptyCard icon={<Target size={20} />} title="شات امروز هنوز منتشر نشده." description="موقعیت‌های واقعی مسابقات و تمرین‌های منتخب اینجا به یک تجربه تعاملی تبدیل می‌شوند." href="/academy" action="ورود به آکادمی" /></section>

        <section className="mx-auto mt-10 max-w-3xl"><div className="mb-4 flex items-end justify-between"><div><p className="text-[10px] font-bold tracking-[0.22em] text-red-500">DISCOVER SNOOKER</p><h2 className="mt-1.5 text-xl font-bold">داستان‌ها، لحظه‌ها و دنیای اسنوکر</h2></div><Link href="/discover" className="flex items-center gap-1 text-xs text-white/40 hover:text-white">کشف <ArrowLeft size={13} /></Link></div><div className="grid gap-3 sm:grid-cols-2"><EmptyCard icon={<BookOpen size={20} />} title="هنوز داستانی منتشر نشده." description="داستان بازیکنان، اسطوره‌ها، مقالات و روایت‌های اسنوکر اینجا نمایش داده می‌شوند." /><EmptyCard icon={<Compass size={20} />} title="محتوای تازه در راه است." description="خبر، ویدئو، تحلیل، 147 و محتوای منتخب از پنل مدیریت وارد Discover می‌شوند." /></div></section>

        <section className="mx-auto mt-10 max-w-3xl"><div className="grid gap-3 sm:grid-cols-2"><Link href="/tournaments" className="group rounded-[26px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-red-500/20 hover:bg-red-500/[0.04]"><Trophy size={22} className="text-red-500" /><h2 className="mt-4 text-lg font-bold">مسابقات</h2><p className="mt-2 text-xs leading-6 text-white/35">تورنمنت‌ها، نتایج، Match Center و رقابت‌های اسنوکر.</p><ArrowLeft size={16} className="mt-4 text-white/30 transition group-hover:-translate-x-1 group-hover:text-red-500" /></Link><Link href="/academy" className="group rounded-[26px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-red-500/20 hover:bg-red-500/[0.04]"><GraduationCap size={23} className="text-red-500" /><h2 className="mt-4 text-lg font-bold">آکادمی اسنوکریا</h2><p className="mt-2 text-xs leading-6 text-white/35">آموزش، تمرین، کارگاه‌ها و مسیر رشد بازیکن.</p><ArrowLeft size={16} className="mt-4 text-white/30 transition group-hover:-translate-x-1 group-hover:text-red-500" /></Link></div></section>

        <footer className="mx-auto mt-16 max-w-3xl border-t border-white/10 py-8 text-center"><p className="text-xs font-bold tracking-[0.25em] text-white/35">SNOOKERIA</p><p className="mt-2 text-xs text-white/20">جایی برای زندگی کردن اسنوکر.</p></footer>
      </div>
    </main>
  );
}
