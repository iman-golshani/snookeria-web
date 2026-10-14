import type {Metadata} from "next";
export const metadata:Metadata={
 title:{absolute:"آموزش خصوصی و تخصصی اسنوکر | آکادمی اسنوکریا"},
 description:"آموزش اسنوکر از مبتدی تا حرفه‌ای در آکادمی اسنوکریا زیر نظر ایمان گلشنی؛ ارزیابی تکنیک، اصلاح کیو اکشن، برنامه تمرینی اختصاصی و آمادگی مسابقات.",
 keywords:["آموزش اسنوکر","کلاس آموزش اسنوکر","دوره آموزش اسنوکر","آموزش اسنوکر مبتدی","آموزش اسنوکر حرفه‌ای","آکادمی اسنوکریا"],
 alternates:{canonical:"/academy"},
 openGraph:{title:"آموزش اسنوکر از مبتدی تا حرفه‌ای | آکادمی اسنوکریا",description:"آموزش خصوصی اسنوکر، تحلیل تخصصی تکنیک و برنامه تمرینی شخصی زیر نظر ایمان گلشنی.",url:"/academy",type:"website"}
};
const academySchema={"@context":"https://schema.org","@type":"EducationalOrganization",name:"آکادمی اسنوکریا",alternateName:"Snookeria Academy",description:"آموزش خصوصی و تخصصی اسنوکر با ارزیابی تکنیک و برنامه تمرینی اختصاصی زیر نظر ایمان گلشنی.",url:"https://snookeria.ir/academy",parentOrganization:{name:"اسنوکریا",url:"https://snookeria.ir"}};
import Link from "next/link";
import ConsultationForm from "@/components/academy/ConsultationForm";
import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";
import { CheckCircle2, GraduationCap, Target, Activity, ClipboardCheck, ArrowLeft } from "lucide-react";

const skills = [
 {title:"تکنیک و اجرای ضربه",items:["تحلیل و اصلاح تخصصی کیو اکشن (Cue Action)","بررسی ایستادن، نشانه‌گیری و پل‌گذاری","شناسایی عادت‌های تکنیکی و اصلاح آن‌ها"]},
 {title:"دقت و کنترل بازی",items:["کنترل توپ سفید و موقعیت‌گیری","تقویت دقت در ضربات بلند (Long Pot)","توسعه مهارت بریک‌سازی (Break Building)"]},
 {title:"تاکتیک و پیشرفت مسابقاتی",items:["تکنیک‌های دفاعی و تصمیم‌گیری تاکتیکی","تحلیل نقاط قوت و ضعف بازیکن","طراحی تمرین‌های اختصاصی متناسب با اهداف فردی"]},
];
const approach=[
 {number:"۰۱",title:"ارزیابی اولیه",detail:"بررسی سطح فعلی بازی، تکنیک و الگوهای عملکرد برای شناخت دقیق نیازهای آموزشی."},
 {number:"۰۲",title:"طراحی مسیر اختصاصی",detail:"تعیین اولویت‌های آموزشی و برنامه تمرینی متناسب با توانایی‌ها و هدف هر بازیکن."},
 {number:"۰۳",title:"آموزش و اصلاح",detail:"تمرین هدفمند، بازخورد تخصصی و اصلاح تدریجی ایرادهای مؤثر بر کیفیت بازی."},
];
export default async function AcademyPage() {
  const cms = createClient(process.env.NEXT_PUBLIC_CMS_SUPABASE_URL!, process.env.NEXT_PUBLIC_CMS_SUPABASE_ANON_KEY!, {auth:{persistSession:false}});
  const {data:dailyQuote} = await cms.from("academy_daily_quote").select("quote,author").eq("id",1).eq("is_active",true).maybeSingle();
  return (
    <main className="min-h-screen bg-[var(--page)] px-4 pb-28 pt-8 text-[var(--ink)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(academySchema)}}/><div className="mx-auto max-w-5xl">
        <header className="text-center">
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full shadow-[0_0_45px_rgba(220,20,60,0.18)]"><img src="/snookeria-circle-transparent.png" alt="آکادمی اسنوکریا" className="h-full w-full object-cover" /></div>
          <p className="mt-5 text-[10px] font-bold tracking-[0.3em] text-red-500">SNOOKERIA ACADEMY</p>
          <h1 className="mt-2 text-3xl font-black">آموزش اسنوکر در آکادمی اسنوکریا</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">آموزش خصوصی، تحلیل تکنیک و تمرین هدفمند</p>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[var(--muted)]">چه در آغاز مسیر یادگیری باشید و چه تجربه بازی در سطح باشگاهی یا مسابقاتی داشته باشید، آموزش در اسنوکریا بر شناخت دقیق توانایی‌ها، اصلاح ایرادها و ساختن مسیر پیشرفت متناسب با شما متمرکز است.</p>
          <p className="mt-5 text-sm text-[var(--muted)]">زیر نظر <Link href="/coach/iman-golshani" className="font-bold text-[var(--ink)] underline decoration-red-500/50 underline-offset-4">ایمان گلشنی</Link>، مربی و داور رسمی فدراسیون</p>
        </header>

        {dailyQuote?.quote && <section aria-label="جمله روز اسنوکریا" className="mx-auto mt-12 max-w-2xl rounded-[24px] border border-red-500/20 bg-red-500/[0.04] px-6 py-7 text-center"><p className="text-xs font-bold text-red-400">جمله روز</p><blockquote className="mt-3 whitespace-pre-line text-base font-bold leading-9 text-[var(--ink)]">«{dailyQuote.quote}»</blockquote>{dailyQuote.author && <p className="mt-3 text-xs text-[var(--muted)]">— {dailyQuote.author}</p>}</section>}
        <section className="mt-14" aria-labelledby="approach-title">
          <div className="text-center"><Activity size={24} className="mx-auto text-red-500"/><p className="mt-3 text-[11px] font-bold tracking-widest text-red-400">OUR APPROACH</p><h2 id="approach-title" className="mt-2 text-2xl font-black">آموزشی متناسب با بازی شما</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-[var(--muted)]">در اسنوکریا، آموزش صرفاً مجموعه‌ای از تمرین‌های تکراری نیست. ابتدا وضعیت فنی و سطح بازی شما بررسی می‌شود؛ سپس با توجه به نقاط قوت، چالش‌ها و اهداف شخصی‌تان، مسیر آموزشی مشخصی شکل می‌گیرد.</p></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">{approach.map(step=><article key={step.number} className="rounded-[24px] border border-[var(--edge)] bg-[var(--surface)] p-6"><span className="text-2xl font-black text-red-500">{step.number}</span><h3 className="mt-4 text-base font-bold">{step.title}</h3><p className="mt-3 text-sm leading-7 text-[var(--muted)]">{step.detail}</p></article>)}</div>
        </section>
        <section className="mt-16" aria-labelledby="skills-title">
          <div className="text-center"><Target size={24} className="mx-auto text-red-500"/><p className="mt-3 text-[11px] font-bold tracking-widest text-red-400">TRAINING FOCUS</p><h2 id="skills-title" className="mt-2 text-2xl font-black">حوزه‌های آموزش تخصصی اسنوکر</h2><p className="mt-3 text-sm leading-7 text-[var(--muted)]">از پایه‌های فنی تا مهارت‌های پیشرفته؛ متناسب با نیاز هر هنرجو.</p></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">{skills.map(group=><article key={group.title} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6"><h3 className="text-base font-black">{group.title}</h3><div className="mt-5 space-y-4">{group.items.map(item=><div key={item} className="flex items-start gap-3 text-sm leading-7 text-[var(--muted)]"><CheckCircle2 size={17} className="mt-1 shrink-0 text-red-500"/><span>{item}</span></div>)}</div></article>)}</div>
        </section>
        <section className="mt-14 grid gap-5 rounded-[28px] border border-red-500/20 bg-red-500/[0.045] p-6 md:grid-cols-[auto_1fr] md:items-start md:p-8"><ClipboardCheck size={29} className="text-red-500"/><div><h2 className="text-xl font-black">جلسه ارزیابی و آموزش خصوصی</h2><p className="mt-3 text-sm leading-8 text-[var(--muted)]">اگر می‌خواهید سطح بازی خود را ارتقا دهید، می‌توانید برای بررسی تکنیک، شناسایی اولویت‌های تمرینی و برنامه‌ریزی مسیر پیشرفت، جلسه خصوصی هماهنگ کنید. این آموزش برای علاقه‌مندان تازه‌کار، بازیکنان باشگاهی و بازیکنان مسابقاتی مناسب است.</p><p className="mt-3 text-xs leading-6 text-[var(--muted)]">محل برگزاری: باشگاه اسنوکر، با هماهنگی قبلی</p><Link href="/coach/iman-golshani" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-red-400">آشنایی با مربی <ArrowLeft size={16}/></Link></div></section>
        <ConsultationForm/>
        <section className="mx-auto mt-12 max-w-2xl rounded-[28px] border border-red-500/20 bg-red-500/[0.05] p-6 text-center"><h2 className="text-lg font-bold">اسنوکر برای ما فقط یه بازی نیست</h2><p className="mt-1 text-lg font-bold text-red-500">یه سبک زندگیه</p><p className="mt-3 text-xs leading-6 text-[var(--muted)]">ما با اسنوکر تو زندگی رشد می‌کنیم.</p></section>
      </div>
      <section className="px-5 pt-10 text-center" aria-label="تماس با مربی">
        <a href="tel:09196353060" className="mx-auto inline-flex min-h-12 items-center justify-center rounded-full bg-red-600 px-8 py-3 text-base font-bold text-white transition hover:bg-red-500">تماس مستقیم با مربی</a>
      </section>
    </main>
  );
}
