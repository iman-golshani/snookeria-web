"use client";

import {
  Phone,
  CircleDot,
  CheckCircle2,
} from "lucide-react";

const courses = [
  {
    title: "دوره مبتدی",
    subtitle: "شروع اصولی مسیر اسنوکر",
    description:
      "دوره آموزش اسنوکر برای بازیکنانی که می‌خواهند این ورزش را از پایه و به شکل اصولی یاد بگیرند.",
    features: [
      "ماهیانه ۶ جلسه آموزشی",
      "هر جلسه ۲ ساعت",
      "آموزش اصول و تکنیک‌های پایه اسنوکر",
    ],
  },
  {
    title: "دوره پیشرفته",
    subtitle: "توسعه مهارت و عملکرد",
    description:
      "برای بازیکنانی که اصول اولیه را پشت سر گذاشته‌اند و به دنبال پیشرفت فنی و عملکرد بهتر در بازی هستند.",
    features: [
      "ماهیانه ۸ جلسه آموزشی",
      "هر جلسه ۲ ساعت",
      "برنامه‌ریزی تمرین",
      "آنالیز تخصصی متناسب با سطح بازیکن",
    ],
  },
  {
    title: "دوره حرفه‌ای",
    subtitle: "کوچینگ ویژه بازیکنان سطح بالا",
    description:
      "دوره کوچینگ تخصصی برای بازیکنان سطح بالا با تمرکز بر عملکرد، مسابقات و آماده‌سازی حرفه‌ای.",
    features: [
      "برنامه‌ریزی تمرینی اختصاصی",
      "آنالیز کامل بازی‌ها",
      "آمادگی ذهنی پیشرفته",
      "آماده‌سازی برای مسابقات پیش رو",
    ],
  },
];

export default function Home() {
  const phoneNumber = "09196353060";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://snookeria.ir/#organization",
        name: "آکادمی اسنوکریا",
        alternateName: "Snookeria Academy",
        url: "https://snookeria.ir",
        logo: "https://snookeria.ir/snookeria-logo.png",
        sameAs: ["https://www.instagram.com/snookeria"],
        founder: {
          "@id": "https://snookeria.ir/#iman-golshani",
        },
        description:
          "آکادمی اسنوکریا، مدرسه تخصصی اسنوکر برای آموزش، تمرین، رقابت و رشد بازیکنان اسنوکر.",
      },
      {
        "@type": "Person",
        "@id": "https://snookeria.ir/#iman-golshani",
        name: "ایمان گلشنی",
        url: "https://snookeria.ir",
        jobTitle: "مربی و داور رسمی فدراسیون",
        description:
          "ایمان گلشنی، مربی و داور رسمی فدراسیون و موسس آکادمی اسنوکریا.",
        worksFor: {
          "@id": "https://snookeria.ir/#organization",
        },
        sameAs: ["https://www.instagram.com/snookeria"],
      },
      {
        "@type": "WebSite",
        "@id": "https://snookeria.ir/#website",
        url: "https://snookeria.ir",
        name: "Snookeria Academy",
        alternateName: "آکادمی اسنوکریا",
        publisher: {
          "@id": "https://snookeria.ir/#organization",
        },
        inLanguage: "fa-IR",
      },
    ],
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071426] text-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />

        <div className="absolute bottom-[-200px] left-[-120px] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[130px]" />

        <div className="absolute right-[-150px] top-1/3 h-[350px] w-[350px] rounded-full bg-red-600/5 blur-[120px]" />
      </div>

      {/* Subtle background lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
        <div className="absolute left-1/2 top-0 h-full w-px bg-white" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-white" />
      </div>

      {/* Main content */}
      <section className="relative mx-auto max-w-5xl px-5 pb-32 pt-12 sm:px-8">
        {/* Hero */}
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full shadow-[0_0_60px_rgba(220,20,60,0.18)] sm:h-40 sm:w-40">
              <img
                src="/snookeria-logo.png"
                alt="لوگوی آکادمی اسنوکریا"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {/* Brand */}
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.45em] text-red-500">
              SNOOKERIA ACADEMY
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              آکادمی اسنوکریا
            </h1>

            <p className="mt-4 text-lg font-medium text-white/75 sm:text-xl">
              مدرسه تخصصی اسنوکر
            </p>
          </div>

          {/* Coach */}
          <div className="mt-7">
            <p className="text-sm leading-8 text-white/70 sm:text-base">
              زیر نظر{" "}
              <strong className="font-semibold text-white">
                ایمان گلشنی
              </strong>
              ، مربی و داور رسمی فدراسیون
            </p>

            <p className="mt-1 text-xs text-white/40">
              موسس آکادمی اسنوکریا
            </p>
          </div>

          {/* Description */}
          <div className="mt-5 max-w-2xl">
            <p className="text-sm leading-8 text-white/55 sm:text-base sm:leading-9">
              آکادمی اسنوکریا جایی برای آموزش اسنوکر، تمرین، رقابت و رشد
              بازیکنان اسنوکر است. اسنوکریا مسیر بازیکن را از یادگیری اصولی
              تا حضور در مسابقات حرفه‌ای همراهی می‌کند.
            </p>
          </div>

          {/* SEO Context */}
          <div className="mt-5 max-w-2xl">
            <p className="text-xs leading-7 text-white/35 sm:text-sm">
              آموزش تخصصی اسنوکر با تمرکز بر تکنیک، تمرین، آنالیز بازی و
              آماده‌سازی بازیکن برای رقابت.
            </p>
          </div>

          {/* Philosophy */}
          <div className="relative mt-12 max-w-xl">
            <div className="absolute left-1/2 top-1/2 h-24 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-3xl" />

            <p className="relative text-xl font-semibold leading-9 sm:text-2xl">
              اسنوکر برای ما فقط یه بازی نیست
            </p>

            <p className="relative mt-1 text-xl font-semibold leading-9 text-red-500 sm:text-2xl">
              یه سبک زندگیه
            </p>

            <p className="relative mt-5 text-sm leading-8 text-white/45 sm:text-base">
              ما با اسنوکر تو زندگی رشد میکنیم
            </p>
          </div>

          {/* Contact */}
          <a
            href={`tel:${phoneNumber}`}
            className="group mt-10 flex items-center gap-3 rounded-full bg-red-600 px-8 py-4 text-sm font-bold text-white shadow-[0_10px_40px_rgba(220,20,60,0.22)] transition-all duration-300 hover:bg-red-500 hover:shadow-[0_10px_50px_rgba(220,20,60,0.35)] active:scale-95"
          >
            <Phone
              size={18}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:scale-110"
            />

            ارتباط مستقیم با مربی

            
          </a>

          {/* Instagram */}
          <a
  href="https://www.instagram.com/snookeria"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-5 flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
>
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="5"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle
      cx="12"
      cy="12"
      r="4"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>

  اینستاگرام اسنوکریا
</a>
        </div>

        {/* Academy Courses */}
        <section
          aria-labelledby="academy-courses"
          className="mt-20"
        >
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold tracking-[0.3em] text-red-500">
              ACADEMY PROGRAMS
            </p>

            <h2
              id="academy-courses"
              className="mt-2 text-2xl font-bold sm:text-3xl"
            >
              دوره‌های آموزش اسنوکر
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/45">
              دوره‌های آموزشی آکادمی اسنوکریا برای سطوح مختلف بازیکنان، از
              شروع یادگیری تا کوچینگ حرفه‌ای.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {courses.map((course, index) => (
              <article
                key={course.title}
                className={`group relative overflow-hidden rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 ${
                  index === 2
                    ? "border-red-600/40 bg-red-600/[0.07]"
                    : "border-white/10 bg-white/[0.035]"
                }`}
              >
                {/* Accent */}
                <div
                  className={`absolute right-0 top-0 h-1 w-full ${
                    index === 2 ? "bg-red-600" : "bg-white/15"
                  }`}
                />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {course.title}
                    </h3>

                    <p className="mt-2 text-sm text-red-500">
                      {course.subtitle}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-red-500">
                    <CircleDot size={21} />
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-white/50">
                  {course.description}
                </p>

                <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
                  {course.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-2 text-sm text-white/70"
                    >
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-red-500"
                      />

                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Snooker education section */}
        <section className="mx-auto mt-20 max-w-3xl text-center">
          <h2 className="text-xl font-bold sm:text-2xl">
            آموزش اسنوکر و توسعه بازیکن
          </h2>

          <p className="mt-5 text-sm leading-8 text-white/45 sm:text-base sm:leading-9">
            در آکادمی اسنوکریا، آموزش اسنوکر فقط به یادگیری ضربه‌ها محدود
            نمی‌شود. تکنیک، کنترل کیوبال، تاکتیک، تمرین هدفمند، آنالیز بازی
            و آمادگی برای مسابقه بخشی از مسیر رشد بازیکن هستند.
          </p>

          <p className="mt-4 text-xs leading-7 text-white/30">
            هدف اسنوکریا ساختن بازیکنی است که بتواند آموخته‌های خود را در
            شرایط واقعی مسابقه به کار بگیرد.
          </p>
        </section>
      </section>
    </main>
  );
}