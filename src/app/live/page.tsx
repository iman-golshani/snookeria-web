import Link from "next/link";
import { Clock3, Radio, Trophy, UserRound } from "lucide-react";

import { shootoutSupabase } from "@/lib/supabase/shootout";

type LiveMatch = {
  id: string;
  room_code: string;

  player1_name: string | null;
  player2_name: string | null;

  player1_image: string | null;
  player2_image: string | null;

  player1_score: number | null;
  player2_score: number | null;

  player1_break: number | null;
  player2_break: number | null;

  current_player: number | null;

  remaining_seconds: number | null;
  shot_seconds: number | null;

  status: "waiting" | "live" | "finished";

  started_at: string | null;
  updated_at: string | null;
  created_at: string | null;
};

export const dynamic = "force-dynamic";

function formatTime(seconds: number | null) {
  if (seconds === null || seconds === undefined) {
    return "--:--";
  }

  const safeSeconds = Math.max(0, seconds);

  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

async function getLiveMatches(): Promise<LiveMatch[]> {
  const { data, error } = await shootoutSupabase
    .from("live_matches")
    .select(
      `
        id,
        room_code,
        player1_name,
        player2_name,
        player1_image,
        player2_image,
        player1_score,
        player2_score,
        player1_break,
        player2_break,
        current_player,
        remaining_seconds,
        shot_seconds,
        status,
        started_at,
        updated_at,
        created_at
      `
    )
    .eq("status", "live")
    .order("started_at", {
      ascending: false,
      nullsFirst: false,
    });

  if (error) {
    console.error("Failed to load live matches:", error);
    throw new Error("Failed to load live matches");
  }

  return (data ?? []) as LiveMatch[];
}

export default async function LivePage() {
  const liveMatches = await getLiveMatches();

  return (
    <main className="min-h-screen bg-[#071426] px-5 pb-32 pt-10 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-9 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-500">
            <Radio size={25} />
          </div>

          <p className="mt-5 text-xs font-semibold tracking-[0.3em] text-red-500">
            LIVE MATCHES
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            مسابقات زنده اسنوکریا
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/45">
            مسابقات Shoot Out در حال برگزاری را به‌صورت زنده دنبال کنید.
          </p>
        </header>

        {liveMatches.length === 0 ? (
          /* Empty State */
          <section className="flex min-h-[45vh] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.025] px-6 text-center">
            <Trophy size={32} className="text-white/20" />

            <h2 className="mt-5 text-lg font-semibold">
              در حال حاضر مسابقه زنده‌ای در حال برگزاری نیست.
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/40">
              با شروع مسابقه، اطلاعات آن در همین صفحه نمایش داده خواهد شد.
            </p>
          </section>
        ) : (
          /* Live Matches */
          <section className="grid gap-5 md:grid-cols-2">
            {liveMatches.map((match) => (
              <article
                key={match.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]"
              >
                {/* LIVE header */}
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                    </span>

                    <span className="text-xs font-bold tracking-[0.15em] text-red-500">
                      LIVE
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Clock3 size={14} />
                    <span dir="ltr">
                      {formatTime(match.remaining_seconds)}
                    </span>
                  </div>
                </div>

                {/* Players */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-7">
                  {/* Player 1 */}
                  <div className="min-w-0 text-center">
                    {match.player1_image ? (
                      <img
                        src={match.player1_image}
                        alt={match.player1_name ?? "بازیکن اول"}
                        className="mx-auto h-16 w-16 rounded-full border border-white/10 object-cover"
                      />
                    ) : (
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/30">
                        <UserRound size={26} />
                      </div>
                    )}

                    <h2 className="mt-3 truncate text-sm font-semibold">
                      {match.player1_name || "بازیکن اول"}
                    </h2>

                    <div className="mt-3 text-4xl font-bold tabular-nums">
                      {match.player1_score ?? 0}
                    </div>

                    {(match.player1_break ?? 0) > 0 && (
                      <p className="mt-2 text-xs text-white/35">
                        Break: {match.player1_break}
                      </p>
                    )}
                  </div>

                  {/* VS */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold tracking-wider text-white/25">
                      VS
                    </span>

                    <div className="mt-3 h-8 w-px bg-white/10" />
                  </div>

                  {/* Player 2 */}
                  <div className="min-w-0 text-center">
                    {match.player2_image ? (
                      <img
                        src={match.player2_image}
                        alt={match.player2_name ?? "بازیکن دوم"}
                        className="mx-auto h-16 w-16 rounded-full border border-white/10 object-cover"
                      />
                    ) : (
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/30">
                        <UserRound size={26} />
                      </div>
                    )}

                    <h2 className="mt-3 truncate text-sm font-semibold">
                      {match.player2_name || "بازیکن دوم"}
                    </h2>

                    <div className="mt-3 text-4xl font-bold tabular-nums">
                      {match.player2_score ?? 0}
                    </div>

                    {(match.player2_break ?? 0) > 0 && (
                      <p className="mt-2 text-xs text-white/35">
                        Break: {match.player2_break}
                      </p>
                    )}
                  </div>
                </div>

                {/* Watch */}
                <div className="border-t border-white/10 p-4">
                  <Link
                    href={`/live/${encodeURIComponent(match.room_code)}`}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3.5 text-sm font-bold transition hover:bg-red-500 active:scale-[0.98]"
                  >
                    <Radio size={17} />
                    مشاهده زنده مسابقه
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}