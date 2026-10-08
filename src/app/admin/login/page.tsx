"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { cmsSupabase } from "@/lib/supabase/cms";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cmsSupabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin");
    });
  }, [router]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await cmsSupabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("ایمیل یا رمز عبور صحیح نیست.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[var(--page)] px-4 text-white">
      <div className="w-full max-w-sm rounded-[30px] border border-white/[0.08] bg-[#0a1015] p-6 shadow-2xl">
        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16a36a]/10 text-[#32c889]">
          <LockKeyhole size={22} />
        </div>
        <p dir="ltr" className="text-[10px] font-black tracking-[.25em] text-[#ff4b53]">SNOOKERIA CMS</p>
        <h1 className="mt-2 text-2xl font-black">ورود به پنل مدیریت</h1>
        <p className="mt-2 text-xs leading-6 text-white/35">مدیریت محتوای سایت اسنوکریا</p>

        <form onSubmit={login} className="mt-7 space-y-4">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل" dir="ltr"
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm outline-none transition focus:border-[#16a36a]/60" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور" dir="ltr"
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm outline-none transition focus:border-[#16a36a]/60" />
          {error && <p className="text-xs text-[#ff4b53]">{error}</p>}
          <button disabled={loading}
            className="h-12 w-full rounded-2xl bg-[#e3222b] text-sm font-black transition hover:bg-[#f02b34] disabled:opacity-50">
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    </main>
  );
}
