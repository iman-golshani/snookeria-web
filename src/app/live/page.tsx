"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock3,
  Radio,
  Trophy,
  UserRound,
  CirclePlay,
  Flag,
} from "lucide-react";

import { shootoutSupabase } from "@/lib/supabase/shootout";

type MatchStatus = "waiting" | "live" | "finished";

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
  status: MatchStatus;
  started_at: string | null;
  updated_at: string | null;
  created_at: string | null;
};

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

function getBaseSeconds(match: LiveMatch) {
  if (match.status === "waiting") return 600;
  if (match.status === "finished") return 0;
  return Math.max(0, match.remaining_seconds ?? 600);
}

function calculateLiveSeconds(match: LiveMatch) {
  if (match.status === "waiting") return 600;
  if (match.status === "finished") return 0;

  const baseSeconds = getBaseSeconds(match);

  if (!match.updated_at) return baseSeconds;

  const updatedAt = Date.parse(match.updated_at);
  if (Number.isNaN(updatedAt)) return baseSeconds;

  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - updatedAt) / 1000)
  );

  return Math.max(0, baseSeconds - elapsedSeconds);
}

function sortMatches(matches: LiveMatch[]) {
  return [...matches].sort((a, b) => {
    const priority: Record<MatchStatus, number> = {
      live: 0,
      waiting: 1,
      finished: 2,
    };

    const statusDifference = priority[a.status] - priority[b.status];
    if (statusDifference !== 0) return statusDifference;

    const aTime = Date.parse(a.updated_at ?? a.created_at ?? "");
    const bTime = Date.parse(b.updated_at ?? b.created_at ?? "");

    return (
      (Number.isNaN(bTime) ? 0 : bTime) -
      (Number.isNaN(aTime) ? 0 : aTime)
    );
  });
}

export default function LivePage() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const mountedRef = useRef(true);

  const loadMatches = async () => {
    const { data, error } = await shootoutSupabase
      .from("live_matches")
      .select(`
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
      `)
      .in("status", ["waiting", "live", "finished"])
      .order("updated_at", {
        ascending: false,
        nullsFirst: false,
      });

    if (error) {
      console.error("Failed to load Shootout matches:", error);
      if (mountedRef.current) setLoading(false);
      return;
    }

    if (!mountedRef.current) return;

    setMatches(sortMatches((data ?? []) as LiveMatch[]));
    setLoading(false);
  };

  useEffect(() => {
    mountedRef.current = true;
    void loadMatches();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const channel = shootoutSupabase
      .channel("snookeria-live-match-list")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_matches",
        },
        () => {
          void loadMatches();
        }
      )
      .subscribe();

    const refreshTimer = window.setInterval(() => {
      void loadMatches();
    }, 10000);

    return () => {
      window.clearInterval(refreshTimer);
      void shootoutSupabase.removeChannel(channel);
    };
  }, []);

  const displayMatches = useMemo(() => {
    void currentTime;

    return matches.map((match) => ({
      ...match,
      displaySeconds: calculateLiveSeconds(match),
    }));
  }, [matches, currentTime]);

  return (
    <main className="min-h-screen bg-[#071426] px-4 pb-28 pt-6 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-5 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-500">
            <Radio size={19} />
          </div>

          <p className="mt-3 text-[10px] font-semibold tracking-[0.28em] text-red-500">
            LIVE MATCHES
          </p>

          <h1 className="mt-1.5 text-2xl font-bold">مسابقات زنده اسنوکریا</h1>

          <p className="mx-auto mt-2 max-w-lg text-xs leading-6 text-white/40">
            مسابقات Shoot Out آماده شروع و در حال برگزاری را به‌صورت زنده دنبال کنید.
          </p>
        </header>

        {loading ? (
          <section className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.025] px-6 text-center">
            <Radio size={28} className="animate-pulse text-red-500" />
            <h2 className="mt-4 text-sm font-semibold text-white/70">
              در حال دریافت مسابقات...
            </h2>
          </section>
        ) : displayMatches.length === 0 ? (
          <section className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.025] px-6 text-center">
            <Trophy size={28} className="text-white/20" />
            <h2 className="mt-4 text-base font-semibold">
              در حال حاضر مسابقه‌ای برای پخش زنده وجود ندارد.
            </h2>
            <p className="mt-2 text-xs leading-6 text-white/40">
              با آماده شدن مسابقه، اطلاعات آن در همین صفحه نمایش داده خواهد شد.
            </p>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            {displayMatches.map((match) => {
              const isWaiting = match.status === "waiting";
              const isLive = match.status === "live";
              const isFinished = match.status === "finished";

              let statusText = "";
              let statusClass = "";
              let statusIcon = null;

              if (isWaiting) {
                statusText = "آماده شروع";
                statusClass =
                  "border-amber-400/20 bg-amber-400/10 text-amber-300";
                statusIcon = <CirclePlay size={12} />;
              } else if (isFinished) {
                statusText = "پایان مسابقه";
                statusClass =
                  "border-emerald-400/20 bg-emerald-400/10 text-emerald-400";
                statusIcon = <Flag size={12} />;
              } else {
                statusText = "در حال انجام";
                statusClass =
                  "border-red-500/20 bg-red-500/10 text-red-400";
                statusIcon = <Radio size={12} />;
              }

              return (
                <article
                  key={match.id}
                  className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035]"
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      {isLive ? (
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                        </span>
                      ) : isWaiting ? (
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      )}

                      <span
                        className={`text-[10px] font-bold ${
                          isLive
                            ? "tracking-[0.15em] text-red-500"
                            : isWaiting
                              ? "text-amber-400"
                              : "text-emerald-400"
                        }`}
                      >
                        {isLive ? "LIVE" : isWaiting ? "READY" : "FINISHED"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-white/55">
                      <Clock3 size={13} />
                      <span
                        dir="ltr"
                        className={`font-bold tabular-nums ${
                          isWaiting
                            ? "text-amber-300"
                            : isFinished
                              ? "text-white/35"
                              : "text-white/70"
                        }`}
                      >
                        {formatTime(match.displaySeconds)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center pt-3">
                    <div
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold ${statusClass}`}
                    >
                      {statusIcon}
                      <span>{statusText}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 pb-4 pt-3">
                    <div className="min-w-0 text-center">
                      {match.player1_image ? (
                        <div className="mx-auto h-14 w-14 overflow-hidden rounded-full border border-white/10">
                          <img
                            src={match.player1_image}
                            alt={match.player1_name ?? "بازیکن اول"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/30">
                          <UserRound size={23} />
                        </div>
                      )}

                      <h2 className="mt-2 truncate text-xs font-semibold">
                        {match.player1_name || "بازیکن اول"}
                      </h2>

                      <div className="mt-1 text-3xl font-black tabular-nums">
                        {match.player1_score ?? 0}
                      </div>

                      <div className="mt-1 h-4">
                        {(match.player1_break ?? 0) > 0 && (
                          <p className="text-[10px] text-white/35">
                            Break {match.player1_break}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold tracking-wider text-white/25">
                        VS
                      </span>
                      <div className="mt-2 h-6 w-px bg-white/10" />
                    </div>

                    <div className="min-w-0 text-center">
                      {match.player2_image ? (
                        <div className="mx-auto h-14 w-14 overflow-hidden rounded-full border border-white/10">
                          <img
                            src={match.player2_image}
                            alt={match.player2_name ?? "بازیکن دوم"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/30">
                          <UserRound size={23} />
                        </div>
                      )}

                      <h2 className="mt-2 truncate text-xs font-semibold">
                        {match.player2_name || "بازیکن دوم"}
                      </h2>

                      <div className="mt-1 text-3xl font-black tabular-nums">
                        {match.player2_score ?? 0}
                      </div>

                      <div className="mt-1 h-4">
                        {(match.player2_break ?? 0) > 0 && (
                          <p className="text-[10px] text-white/35">
                            Break {match.player2_break}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 p-3">
                    <Link
                      href={`/live/${encodeURIComponent(match.room_code)}`}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-[0.98] ${
                        isWaiting
                          ? "border border-amber-400/20 bg-amber-400/10 text-amber-300 hover:bg-amber-400/15"
                          : isFinished
                            ? "border border-white/10 bg-white/[0.05] text-white/60 hover:bg-white/[0.08]"
                            : "bg-red-600 text-white hover:bg-red-500"
                      }`}
                    >
                      {isWaiting ? (
                        <>
                          <CirclePlay size={15} />
                          ورود به صفحه مسابقه
                        </>
                      ) : isFinished ? (
                        <>
                          <Flag size={15} />
                          مشاهده نتیجه مسابقه
                        </>
                      ) : (
                        <>
                          <Radio size={15} />
                          مشاهده زنده مسابقه
                        </>
                      )}
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
