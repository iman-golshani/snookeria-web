"use client";

import { Phone } from "lucide-react";

export default function Home() {
  const phoneNumber = "09196353060";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071426] text-white">
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
      <section className="relative flex min-h-[calc(100vh-90px)] flex-col items-center justify-center px-6 py-12 text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full shadow-[0_0_60px_rgba(220,20,60,0.18)] sm:h-40 sm:w-40">
            <img
              src="/snookeria-logo.jpg"
              alt="Snookeria"
              className="h-full w-full object-cover"
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
          <p className="text-sm leading-8 text-white/65 sm:text-base">
            زیر نظر ایمان گلشنی، مربی و داور رسمی فدراسیون
          </p>
        </div>

        {/* Description */}
        <div className="mt-5 max-w-2xl">
          <p className="text-sm leading-8 text-white/55 sm:text-base sm:leading-9">
            جایی برای یادگیری، تمرین، رقابت و رشد بازیکنان اسنوکر.
            اسنوکریا مسیر بازیکن را از آموزش تا مسابقات حرفه‌ای همراهی می‌کند.
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

          <span className="text-white/70">|</span>

          <span dir="ltr">{phoneNumber}</span>
        </a>
      </section>

      {/* Bottom accent */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
    </main>
  );
}