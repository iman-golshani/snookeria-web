import type {Metadata} from "next";
export const metadata:Metadata={
 title:{absolute:"آکادمی اسنوکریا | Snookeria Academy – آموزش تخصصی اسنوکر"},
 description:"آکادمی اسنوکریا (Snookeria Academy)، مدرسه تخصصی آموزش اسنوکر زیر نظر ایمان گلشنی؛ دوره‌های مبتدی، پیشرفته و حرفه‌ای با تمرین هدفمند و تحلیل بازی.",
 alternates:{canonical:"/academy"},
 openGraph:{title:"آکادمی اسنوکریا | Snookeria Academy",description:"آموزش تخصصی اسنوکر از مبتدی تا حرفه‌ای زیر نظر ایمان گلشنی.",url:"/academy",type:"website"}
};
const academySchema={"@context":"https://schema.org","@type":"EducationalOrganization",name:"آکادمی اسنوکریا",alternateName:"Snookeria Academy",url:"https://snookeria.ir/academy",parentOrganization:{name:"اسنوکریا",url:"https://snookeria.ir"}};
import Link from "next/link";
import { CheckCircle2, GraduationCap } from "lucide-react";

const courses = [
  { title: "دوره مبتدی", subtitle: "شروع اصولی مسیر اسنوکر", features: ["ماهیانه ۶ جلسه آموزشی", "هر جلسه ۲ ساعت", "آموزش اصول و تکنیک‌های پایه اسنوکر"] },
  { title: "دوره پیشرفته", subtitle: "توسعه مهارت و عملکرد", features: ["ماهیانه ۸ جلسه آموزشی", "هر جلسه ۲ ساعت", "برنامه‌ریزی تمرین", "آنالیز تخصصی متناسب با سطح بازیکن"] },
  { title: "دوره حرفه‌ای", subtitle: "کوچینگ ویژه بازیکنان سطح بالا", features: ["برنامه تمرینی اختصاصی", "آنالیز کامل بازی‌ها", "آمادگی ذهنی پیشرفته", "آماده‌سازی برای مسابقات"] },
];

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-[var(--page)] px-4 pb-28 pt-8 text-[var(--ink)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(academySchema)}}/><div className="mx-auto max-w-5xl">
        <header className="text-center">
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full shadow-[0_0_45px_rgba(220,20,60,0.18)]"><img src="/snookeria-circle-transparent.png" alt="آکادمی اسنوکریا" className="h-full w-full object-cover" /></div>
          <p className="mt-5 text-[10px] font-bold tracking-[0.3em] text-red-500">SNOOKERIA ACADEMY</p>
          <h1 className="mt-2 text-3xl font-black">آکادمی اسنوکریا</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">مدرسه تخصصی اسنوکر</p>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[var(--muted)]">جایی برای آموزش اصولی، تمرین هدفمند، تحلیل بازی و رشد بازیکن؛ از شروع مسیر تا آماده‌سازی برای رقابت.</p>
          <p className="mt-5 text-sm text-[var(--muted)]">زیر نظر <Link href="/coach/iman-golshani" className="font-bold text-[var(--ink)] underline decoration-red-500/50 underline-offset-4">ایمان گلشنی</Link>، مربی و داور رسمی فدراسیون</p>
        </header>

        <section className="mt-14">
          <div className="text-center"><GraduationCap size={24} className="mx-auto text-red-500"/><h2 className="mt-3 text-2xl font-bold">دوره‌های آموزش اسنوکر</h2></div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {courses.map((course, index)=>(
              <article key={course.title} className={`rounded-[26px] border p-5 ${index===2?"border-red-500/30 bg-red-500/[0.055]":"border-white/10 bg-white/[0.03]"}`}>
                <h3 className="text-lg font-bold">{course.title}</h3><p className="mt-1 text-xs text-red-400/80">{course.subtitle}</p>
                <div className="mt-5 space-y-3">{course.features.map((feature)=><div key={feature} className="flex items-start gap-2 text-xs leading-6 text-[var(--muted)]"><CheckCircle2 size={15} className="mt-1 shrink-0 text-red-500/70"/>{feature}</div>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-2xl rounded-[28px] border border-red-500/20 bg-red-500/[0.05] p-6 text-center"><h2 className="text-lg font-bold">اسنوکر برای ما فقط یه بازی نیست</h2><p className="mt-1 text-lg font-bold text-red-500">یه سبک زندگیه</p><p className="mt-3 text-xs leading-6 text-[var(--muted)]">ما با اسنوکر تو زندگی رشد می‌کنیم.</p></section>
      </div>
    </main>
  );
}
