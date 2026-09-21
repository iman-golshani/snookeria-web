import { Newspaper } from "lucide-react";

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[#071426] px-6 pb-32 pt-16 text-white">
      <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-red-500">
          <Newspaper size={28} />
        </div>

        <h1 className="text-3xl font-bold">اخبار</h1>

        <p className="mt-4 text-sm text-white/50">
          فعلاً خبری موجود نیست.
        </p>

        <p className="mt-2 text-xs text-white/30">
          به‌زودی اخبار و مطالب دنیای اسنوکر در این بخش منتشر می‌شوند.
        </p>
      </section>
    </main>
  );
}