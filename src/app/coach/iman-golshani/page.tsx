import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  Target,
  Trophy,
  GraduationCap,
  CircleDot,
} from "lucide-react";

export const metadata: Metadata = {
  title: {absolute:"ایمان گلشنی | Iman Golshani – مربی و داور اسنوکر"},
  description:
    "ایمان گلشنی (Iman Golshani)، مربی و داور اسنوکر و مؤسس آکادمی اسنوکریا؛ آشنایی با سوابق، روش آموزش و کوچینگ تخصصی اسنوکر.",

  alternates: {
    canonical: "/coach/iman-golshani",
  },

  openGraph: {
    title: "ایمان گلشنی | مربی و داور اسنوکر",
    description:
      "مربی و داور رسمی فدراسیون و مؤسس آکادمی اسنوکریا؛ آموزش و کوچینگ تخصصی اسنوکر.",
    url: "/coach/iman-golshani",
    type: "profile",
  },
};

export default function ImanGolshaniPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",

    mainEntity: {
      "@type": "Person",
      "@id": "https://snookeria.ir/coach/iman-golshani#person",

      name: "ایمان گلشنی",
      alternateName: "Iman Golshani",

      url: "https://snookeria.ir/coach/iman-golshani",
      sameAs: ["https://www.instagram.com/snookeria/", "https://www.youtube.com/@snookeria"],
      worksFor: {"@id":"https://snookeria.ir/#organization"},

      jobTitle: "مربی و داور رسمی فدراسیون",

      description:
        "ایمان گلشنی، مربی و داور رسمی فدراسیون و مؤسس آکادمی اسنوکریا است که فعالیت خود در حوزه اسنوکر را از سال ۱۳۹۶ آغاز کرده است.",

      founder: {
        "@type": "Organization",
        name: "آکادمی اسنوکریا",
        url: "https://snookeria.ir",
        "@id": "https://snookeria.ir/#organization",
      },

      knowsAbout: [
        "Snooker",
        "آموزش اسنوکر",
        "مربیگری اسنوکر",
        "کوچینگ اسنوکر",
        "داوری اسنوکر",
      ],
    },
  };

  return (
    <main className="min-h-screen bg-[#071426] pb-32 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Hero */}
      <section className="border-b border-white/10 px-5 pb-12 pt-14">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-red-600/30 bg-red-600/10 text-red-500">
            <CircleDot size={34} />
          </div>

          <p className="text-xs font-semibold tracking-[0.3em] text-red-500">
            SNOOKER COACH & REFEREE
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            ایمان گلشنی
          </h1>

          <p className="mt-4 text-base font-medium text-white/70 sm:text-lg">
            مربی و داور رسمی فدراسیون
          </p>

          <p className="mt-2 text-sm text-white/40">
            مؤسس آکادمی اسنوکریا
          </p>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-white/60">
            <Clock3 size={16} className="text-red-500" />
            شروع فعالیت از سال ۱۳۹۶
          </div>

          <nav aria-label="شبکه‌های اجتماعی اسنوکریا" className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
            <a href="https://www.instagram.com/snookeria/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-white/75 hover:border-red-500/50 hover:text-white">اینستاگرام @snookeria</a>
            <a href="https://www.youtube.com/@snookeria" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-white/75 hover:border-red-500/50 hover:text-white">یوتیوب @snookeria</a>
          </nav>

          <div className="mx-auto mt-8 max-w-2xl">
            <figure className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
              <img src="/images/coach/iman-golshani-portrait.webp" alt="ایمان گلشنی در کنار میز اسنوکر" width={1400} height={1034} draggable={false} onContextMenu={undefined} className="aspect-[4/3] w-full select-none object-cover" />
              <figcaption className="px-5 py-4 text-sm text-white/60">ایمان گلشنی؛ مربی و داور اسنوکر</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.25em] text-red-500">
            ABOUT
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            آموزش اسنوکر با تمرکز بر رشد بازیکن
          </h2>

          <p className="mt-6 text-sm leading-8 text-white/60 sm:text-base sm:leading-9">
            ایمان گلشنی فعالیت حرفه ای خود در حوزه اسنوکر را از سال ۱۳۹۶ آغاز کرده
            و به عنوان مربی و داور رسمی فدراسیون فعالیت می‌کند.
          </p>

          <p className="mt-4 text-sm leading-8 text-white/60 sm:text-base sm:leading-9">
            رویکرد آموزشی او بر رشد هدفمند بازیکن و استفاده مؤثر از زمان
            تمرکز دارد. هدف این است که بازیکن مسیر پیشرفت خود را با تمرین
            هدفمند، شناخت نقاط ضعف و برنامه‌ریزی مناسب طی کند و از
            تمرین‌های بدون هدف و اتلاف وقت فاصله بگیرد.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-5 pb-14">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-600/20 bg-red-600/[0.06] p-7 sm:p-10">
          <Clock3 size={28} className="text-red-500" />

          <h2 className="mt-5 text-2xl font-bold">
            زمان، مهم‌ترین دارایی هر انسان است
          </h2>

          <p className="mt-5 text-sm leading-8 text-white/60 sm:text-base sm:leading-9">
            یکی از اصول اصلی این مسیر، ارزش زمان است. در آموزش و تمرین
            اسنوکر، صرف ساعت‌های زیاد به تنهایی تضمین‌کننده پیشرفت نیست؛
            کیفیت تمرین، هدف مشخص و شناخت مسیر اهمیت بیشتری دارد.
          </p>

          <p className="mt-5 text-lg font-semibold leading-9 text-white">
            هدف، رشد سریع‌تر بازیکن بدون اتلاف وقت است.
          </p>
        </div>
      </section>

      <section className="px-5 pb-14">
        <div className="mx-auto max-w-3xl"><figure className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
              <img src="/images/coach/snooker-training-room.webp" alt="فضای تمرین اسنوکر و میز استاندارد مسابقه" width={788} height={1400} draggable={false} className="aspect-[4/3] w-full select-none object-cover" />
            </figure></div>
      </section>

      {/* Coaching principles */}
      <section className="px-5 pb-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.25em] text-red-500">
              COACHING
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              مسیر آموزش و کوچینگ
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <Target size={25} className="text-red-500" />

              <h3 className="mt-5 font-bold">
                تمرین هدفمند
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/45">
                تمرین بر اساس سطح، نیاز و نقاط قابل بهبود هر بازیکن.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <GraduationCap size={25} className="text-red-500" />

              <h3 className="mt-5 font-bold">
                رشد فنی
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/45">
                توسعه اصول و تکنیک‌های اسنوکر با مسیر آموزشی مشخص.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <Trophy size={25} className="text-red-500" />

              <h3 className="mt-5 font-bold">
                آمادگی مسابقه
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/45">
                انتقال مهارت‌های تمرین‌شده به شرایط واقعی بازی و رقابت.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Life philosophy */}
      <section className="px-5 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto h-px w-16 bg-red-600" />

          <h2 className="mt-8 text-2xl font-bold leading-10 sm:text-3xl">
            اسنوکر فقط یک بازی نیست
          </h2>

          <p className="mt-2 text-2xl font-bold text-red-500 sm:text-3xl">
            یک سبک زندگی است
          </p>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-white/50 sm:text-base sm:leading-9">
            اسنوکر درس‌های زیادی برای زندگی دارد؛ تمرکز، صبر، تصمیم‌گیری،
            مدیریت شرایط و پذیرفتن نتیجه انتخاب‌ها. با اسنوکر یاد می‌گیریم
            چگونه در بازی و در زندگی رشد کنیم.
          </p>
        </div>
      </section>

      {/* Snookeria */}
      <section className="px-5">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.035] p-7 text-center sm:p-10">
          <p className="text-xs font-semibold tracking-[0.3em] text-red-500">
            SNOOKERIA ACADEMY
          </p>

          <h2 className="mt-4 text-2xl font-bold">
            آکادمی اسنوکریا
          </h2>

          <p className="mt-5 text-sm leading-8 text-white/50">
            آموزش، تمرین، رقابت و رشد؛ مسیری برای توسعه بازیکنان اسنوکر
            از یادگیری اصولی تا آماده‌سازی برای مسابقه.
          </p>

          <Link
            href="/academy"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold transition hover:bg-red-500"
          >
            مشاهده آکادمی
            <ArrowLeft size={17} />
          </Link>
        </div>
      </section>

      <section className="px-5 pt-10 text-center" aria-label="تماس با مربی">
        <a href="tel:09196353060" className="mx-auto inline-flex min-h-12 items-center justify-center rounded-full bg-red-600 px-8 py-3 text-base font-bold text-white transition hover:bg-red-500">تماس با مربی</a>
      </section>
    </main>
  );
}