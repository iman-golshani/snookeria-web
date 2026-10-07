import { Trophy } from "lucide-react";

export default function TournamentsPage() {
  return (
    <main className="min-h-screen bg-[var(--page)] px-6 pb-32 pt-16 text-[var(--ink)]">
      <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-red-500">
          <Trophy size={28} />
        </div>

        <h1 className="text-3xl font-bold">مسابقات</h1>

        <p className="mt-4 text-sm text-[var(--muted)]">
          فعلاً مسابقه‌ای وجود ندارد.
        </p>

        <p className="mt-2 text-xs text-[var(--muted)]">
          به‌زودی مسابقات اسنوکریا در این بخش نمایش داده می‌شوند.
        </p>
      </section>
    </main>
  );
}