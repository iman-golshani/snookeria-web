import type { Metadata } from "next";
import {
  CalendarDays,
  Presentation,
  UserRound,
} from "lucide-react";

export const metadata: Metadata = {
  title: "کارگاه‌های آموزشی اسنوکر | آکادمی اسنوکریا",
  description:
    "کارگاه‌های تخصصی آموزش اسنوکر آکادمی اسنوکریا زیر نظر ایمان گلشنی، مربی و داور رسمی فدراسیون.",
};

export default function WorkshopsPage() {
  return (
    <main className="min-h-screen bg-[#071426] px-5 pb-32 pt-10 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-500">
            <Presentation size={25} />
          </div>

          <p className="mt-5 text-xs font-semibold tracking-[0.3em] text-red-500">
            SNOOKERIA WORKSHOPS
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            کارگاه‌های آموزشی اسنوکر
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/45">
            کارگاه‌های تخصصی آکادمی اسنوکریا برای آموزش،
            تمرین و ارتقای سطح بازیکنان اسنوکر
          </p>
        </header>

        {/* Empty State */}
        <section className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/25">
              <CalendarDays size={28} />
            </div>

            <h2 className="mt-6 text-lg font-bold">
              در حال حاضر کارگاه آموزشی فعالی وجود ندارد.
            </h2>

            <p className="mt-3 max-w-md text-sm leading-7 text-white/40">
              اطلاعات کارگاه‌های جدید آکادمی اسنوکریا و
              امکان ثبت‌نام، از طریق همین صفحه اعلام خواهد شد.
            </p>

            <div className="mt-7 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/35">
              <UserRound size={14} />
              آکادمی اسنوکریا
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}