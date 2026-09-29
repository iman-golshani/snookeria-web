import { BookOpen, Compass, Play, Sparkles } from "lucide-react";

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-[#071426] px-4 pb-28 pt-8 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500"><Compass size={22} /></div>
          <p className="mt-4 text-[10px] font-bold tracking-[0.28em] text-red-500">DISCOVER SNOOKER</p>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">دنیای اسنوکر را کشف کن</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/40">داستان‌ها، اسطوره‌ها، خبرها، تحلیل‌ها، ویدئوها و برنامه 147 اینجا کنار هم قرار می‌گیرند.</p>
        </header>

        <section className="mt-10 grid gap-3 sm:grid-cols-3">
          {[{icon:<BookOpen size={20}/>,title:"داستان و مقاله"},{icon:<Play size={20}/>,title:"ویدئو و 147"},{icon:<Sparkles size={20}/>,title:"لحظه‌های خاص"}].map((item)=>(
            <div key={item.title} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-white/40">{item.icon}</div>
              <h2 className="mt-3 text-sm font-bold text-white/70">{item.title}</h2>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.025] px-6 py-12 text-center">
          <Compass size={28} className="mx-auto text-white/20" />
          <h2 className="mt-4 font-bold">هنوز محتوایی منتشر نشده.</h2>
          <p className="mt-2 text-xs leading-6 text-white/35">بعد از راه‌اندازی پنل مدیریت، محتوای واقعی Snookeria در این صفحه نمایش داده می‌شود.</p>
        </section>
      </div>
    </main>
  );
}
