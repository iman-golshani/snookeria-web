import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import LiveMatchDisplay from "@/components/live/LiveMatchDisplay";

type LiveRoomPageProps = {
  params: Promise<{
    roomCode: string;
  }>;
};

export const metadata: Metadata = {
  title: "پخش زنده مسابقه اسنوکر | اسنوکریا",
  description:
    "نتیجه زنده مسابقات اسنوکر Shoot Out را در اسنوکریا دنبال کنید.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function LiveRoomPage({
  params,
}: LiveRoomPageProps) {
  const { roomCode } = await params;

  const normalizedRoomCode = decodeURIComponent(roomCode)
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();

  return (
    <main className="min-h-screen bg-[#071426] px-3 pb-20 pt-3 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-2 flex h-8 items-center justify-between">
          <Link
            href="/live"
            className="inline-flex items-center gap-1.5 text-xs text-white/45 transition hover:text-white"
          >
            <ArrowRight size={15} />
            مسابقات زنده
          </Link>

          <span className="text-[10px] font-semibold tracking-[0.22em] text-white/25">
            SNOOKERIA
          </span>
        </div>

        <LiveMatchDisplay roomCode={normalizedRoomCode} />
      </div>
    </main>
  );
}