"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock3,
  Radio,
  RefreshCw,
  UserRound,
  Wifi,
  WifiOff,
} from "lucide-react";

import { shootoutSupabase } from "@/lib/supabase/shootout";

type LiveMatchDisplayProps = {
  roomCode: string;
};

type LiveState = {
  version?: number;

  roomCode?: string;

  player1Name?: string;
  player2Name?: string;

  player1Image?: string;
  player2Image?: string;

  player1Score?: number;
  player2Score?: number;

  player1Break?: number;
  player2Break?: number;

  currentPlayer?: number;

  totalTimeSeconds?: number;
  shotTimeSeconds?: number;

  isGameRunning?: boolean;
  isShotRunning?: boolean;
  isPaused?: boolean;

  hasPlayerMedia?: boolean;
  mediaPlayer?: number;

  serverStateCreatedAt?: string;
  sentAt?: string;

  event?: string;
};

type ConnectionState =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));

  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function readNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.floor(value);
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);

    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

export default function LiveMatchDisplay({
  roomCode,
}: LiveMatchDisplayProps) {
  const [liveState, setLiveState] = useState<LiveState>({});

  const [connectionState, setConnectionState] =
    useState<ConnectionState>("connecting");

  const [hasReceivedState, setHasReceivedState] =
    useState(false);

  const [displayTotalSeconds, setDisplayTotalSeconds] =
    useState(600);

  const [displayShotSeconds, setDisplayShotSeconds] =
    useState(15);

  const latestStateRef = useRef<LiveState>({});

  const normalizedRoomCode = useMemo(
    () =>
      roomCode
        .trim()
        .replace(/\s+/g, "")
        .toUpperCase(),
    [roomCode]
  );

  /*
   * =========================================================
   * REALTIME CONNECTION
   * =========================================================
   */

  useEffect(() => {
    if (!normalizedRoomCode) {
      setConnectionState("error");
      return;
    }

    let disposed = false;

    let requestTimer: ReturnType<typeof setTimeout> | null =
      null;

    setConnectionState("connecting");
    setHasReceivedState(false);

    const channelName = `shootout:${normalizedRoomCode}`;

    const channel = shootoutSupabase.channel(channelName);

    const requestCurrentState = async () => {
      try {
        await channel.send({
          type: "broadcast",
          event: "request_state",
          payload: {
            roomCode: normalizedRoomCode,
            requestedAt: new Date().toISOString(),
          },
        });
      } catch (error) {
        console.error(
          "Failed to request current Shootout state:",
          error
        );
      }
    };

    /*
     * =========================================================
     * STATE SNAPSHOT
     * =========================================================
     *
     * مهم:
     * Flutter/Supabase در این پروژه State را مستقیماً
     * در message تحویل می‌دهد، نه داخل message.payload.
     */

    channel.on(
      "broadcast",
      {
        event: "state_snapshot",
      },
      (message) => {
        if (disposed || !message) {
          return;
        }

        const incoming = message as LiveState;

        /*
         * Snapshot جدید را روی State قبلی Merge می‌کنیم.
         *
         * این موضوع برای Player Media مهم است چون ممکن است
         * بعضی اطلاعات در Broadcastهای جداگانه ارسال شوند.
         */

        const mergedState: LiveState = {
          ...latestStateRef.current,
          ...incoming,
        };

        latestStateRef.current = mergedState;

        setLiveState(mergedState);
        setHasReceivedState(true);

        /*
         * =====================================================
         * TIMER SYNCHRONIZATION
         * =====================================================
         */

        let elapsedSeconds = 0;

        if (incoming.sentAt) {
          const sentAt = Date.parse(incoming.sentAt);

          if (!Number.isNaN(sentAt)) {
            elapsedSeconds = Math.max(
              0,
              Math.floor(
                (Date.now() - sentAt) / 1000
              )
            );
          }
        }

        /*
         * Match Timer
         */

        if (
          incoming.totalTimeSeconds !== undefined
        ) {
          const receivedTotal = readNumber(
            incoming.totalTimeSeconds,
            600
          );

          const correctedTotal =
            incoming.isGameRunning &&
            !incoming.isPaused
              ? receivedTotal - elapsedSeconds
              : receivedTotal;

          setDisplayTotalSeconds(
            Math.max(0, correctedTotal)
          );
        }

        /*
         * Shot Clock
         */

        if (
          incoming.shotTimeSeconds !== undefined
        ) {
          const receivedShot = readNumber(
            incoming.shotTimeSeconds,
            15
          );

          const correctedShot =
            incoming.isGameRunning &&
            incoming.isShotRunning &&
            !incoming.isPaused
              ? receivedShot - elapsedSeconds
              : receivedShot;

          setDisplayShotSeconds(
            Math.max(0, correctedShot)
          );
        }
      }
    );

    /*
     * =========================================================
     * SUBSCRIBE
     * =========================================================
     */

    channel.subscribe((status, error) => {
      if (disposed) {
        return;
      }

      if (error) {
        console.error(
          "Shootout realtime error:",
          error
        );
      }

      if (status === "SUBSCRIBED") {
        setConnectionState("connected");

        /*
         * مشابه Flutter Public Display:
         * بعد از Subscribe کمی صبر می‌کنیم و State فعلی
         * Operator را درخواست می‌کنیم.
         */

        requestTimer = setTimeout(() => {
          void requestCurrentState();
        }, 250);

        return;
      }

      if (
        status === "CHANNEL_ERROR" ||
        status === "TIMED_OUT"
      ) {
        setConnectionState("error");
        return;
      }

      if (status === "CLOSED") {
        setConnectionState("disconnected");
      }
    });

    /*
     * =========================================================
     * CLEANUP
     * =========================================================
     */

    return () => {
      disposed = true;

      if (requestTimer) {
        clearTimeout(requestTimer);
      }

      void shootoutSupabase.removeChannel(channel);
    };
  }, [normalizedRoomCode]);

  /*
   * =========================================================
   * LOCAL TIMER
   * =========================================================
   *
   * بین Snapshotهای Flutter، Browser خودش Timer را
   * هر ثانیه جلو می‌برد.
   */

  useEffect(() => {
    const timer = window.setInterval(() => {
      const state = latestStateRef.current;

      if (
        !state.isGameRunning ||
        state.isPaused
      ) {
        return;
      }

      setDisplayTotalSeconds((current) =>
        Math.max(0, current - 1)
      );

      if (state.isShotRunning) {
        setDisplayShotSeconds((current) =>
          Math.max(0, current - 1)
        );
      }
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  /*
   * =========================================================
   * DISPLAY VALUES
   * =========================================================
   */

  const player1Name =
    liveState.player1Name || "بازیکن اول";

  const player2Name =
    liveState.player2Name || "بازیکن دوم";

  const player1Score = readNumber(
    liveState.player1Score,
    0
  );

  const player2Score = readNumber(
    liveState.player2Score,
    0
  );

  const player1Break = readNumber(
    liveState.player1Break,
    0
  );

  const player2Break = readNumber(
    liveState.player2Break,
    0
  );

  const currentPlayer = readNumber(
    liveState.currentPlayer,
    1
  );

  const activeBreak =
    currentPlayer === 1
      ? player1Break
      : player2Break;

  const isLive =
    liveState.isGameRunning === true;

  const isPaused =
    liveState.isPaused === true;

  const isShotRunning =
    liveState.isShotRunning === true;

  /*
   * Shoot Out:
   * بالای 5 دقیقه = Shot Clock 15s
   * 5 دقیقه آخر = Shot Clock 10s
   */

  const shotClockLimit =
    displayTotalSeconds <= 300
      ? 10
      : 15;

  const shotProgress = Math.min(
    100,
    Math.max(
      0,
      ((shotClockLimit - displayShotSeconds) /
        shotClockLimit) *
        100
    )
  );

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <section>
      {/* Connection / Live Status */}

      <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-2">
          {isLive ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>

              <span className="text-xs font-bold tracking-[0.18em] text-red-500">
                LIVE
              </span>
            </>
          ) : (
            <>
              <span className="h-2.5 w-2.5 rounded-full bg-white/25" />

              <span className="text-xs font-medium text-white/40">
                در انتظار شروع
              </span>
            </>
          )}
        </div>

        <div
          className={`flex items-center gap-2 text-xs ${
            connectionState === "connected"
              ? "text-emerald-400"
              : "text-white/35"
          }`}
        >
          {connectionState === "connected" ? (
            <Wifi size={15} />
          ) : connectionState === "connecting" ? (
            <RefreshCw
              size={14}
              className="animate-spin"
            />
          ) : (
            <WifiOff size={15} />
          )}

          {connectionState === "connected"
            ? "اتصال زنده برقرار است"
            : connectionState === "connecting"
              ? "در حال اتصال..."
              : "اتصال زنده قطع است"}
        </div>
      </div>

      {!hasReceivedState ? (
        /*
         * =====================================================
         * WAITING FOR STATE
         * =====================================================
         */

        <div className="flex min-h-[65vh] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.025] px-6 text-center">
          {connectionState === "error" ? (
            <>
              <WifiOff
                size={34}
                className="text-red-500"
              />

              <h1 className="mt-5 text-lg font-bold">
                اتصال به مسابقه برقرار نشد
              </h1>

              <p className="mt-3 max-w-md text-sm leading-7 text-white/40">
                اتصال زنده به Room مسابقه برقرار
                نشد. ممکن است مسابقه پایان یافته
                باشد یا Operator در دسترس نباشد.
              </p>
            </>
          ) : (
            <>
              <Radio
                size={34}
                className="animate-pulse text-red-500"
              />

              <h1 className="mt-5 text-lg font-bold">
                در حال دریافت اطلاعات مسابقه
              </h1>

              <p className="mt-3 text-sm text-white/40">
                Room:{" "}
                <span
                  dir="ltr"
                  className="font-mono text-white/60"
                >
                  {normalizedRoomCode}
                </span>
              </p>
            </>
          )}
        </div>
      ) : (
        /*
         * =====================================================
         * LIVE MATCH
         * =====================================================
         */

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035]">
          {/* Match Timer */}

          <div className="border-b border-white/10 px-5 py-7 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-white/35">
              <Clock3 size={14} />

              زمان باقی‌مانده مسابقه
            </div>

            <div
              dir="ltr"
              className="mt-2 text-5xl font-black tracking-tight tabular-nums sm:text-6xl"
            >
              {formatTime(displayTotalSeconds)}
            </div>

            {isPaused && (
              <div className="mt-3 inline-flex rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400">
                مسابقه متوقف شده است
              </div>
            )}
          </div>

          {/* Players */}

          <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 px-3 py-7 sm:gap-8 sm:px-8">
            {/* Player 1 */}

            <div className="min-w-0 text-center">
              <div
                className={`mx-auto rounded-full p-[2px] ${
                  currentPlayer === 1
                    ? "bg-red-500"
                    : "bg-white/10"
                }`}
              >
                {liveState.player1Image ? (
                  <img
                    src={liveState.player1Image}
                    alt={player1Name}
                    className="h-20 w-20 rounded-full bg-[#071426] object-cover sm:h-28 sm:w-28"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0b1b30] text-white/25 sm:h-28 sm:w-28">
                    <UserRound size={31} />
                  </div>
                )}
              </div>

              <h2 className="mt-4 truncate text-sm font-bold sm:text-lg">
                {player1Name}
              </h2>

              <div className="mt-3 text-5xl font-black tabular-nums sm:text-6xl">
                {player1Score}
              </div>

              {player1Break > 0 && (
                <div className="mt-3 text-xs text-white/40">
                  Break{" "}
                  <span className="font-bold text-white/70">
                    {player1Break}
                  </span>
                </div>
              )}
            </div>

            {/* Center */}

            <div className="flex min-h-44 flex-col items-center justify-center">
              <span className="text-xs font-black tracking-[0.2em] text-white/20">
                VS
              </span>

              <div className="my-4 h-12 w-px bg-white/10" />

              {(currentPlayer === 1 ||
                currentPlayer === 2) && (
                <span className="whitespace-nowrap rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold text-red-400">
                  نوبت بازیکن {currentPlayer}
                </span>
              )}
            </div>

            {/* Player 2 */}

            <div className="min-w-0 text-center">
              <div
                className={`mx-auto rounded-full p-[2px] ${
                  currentPlayer === 2
                    ? "bg-red-500"
                    : "bg-white/10"
                }`}
              >
                {liveState.player2Image ? (
                  <img
                    src={liveState.player2Image}
                    alt={player2Name}
                    className="h-20 w-20 rounded-full bg-[#071426] object-cover sm:h-28 sm:w-28"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0b1b30] text-white/25 sm:h-28 sm:w-28">
                    <UserRound size={31} />
                  </div>
                )}
              </div>

              <h2 className="mt-4 truncate text-sm font-bold sm:text-lg">
                {player2Name}
              </h2>

              <div className="mt-3 text-5xl font-black tabular-nums sm:text-6xl">
                {player2Score}
              </div>

              {player2Break > 0 && (
                <div className="mt-3 text-xs text-white/40">
                  Break{" "}
                  <span className="font-bold text-white/70">
                    {player2Break}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Current Break */}

          <div className="border-t border-white/10 px-5 py-5 text-center">
            <p className="text-xs text-white/35">
              CURRENT BREAK
            </p>

            <p className="mt-1 text-3xl font-black">
              {activeBreak}
            </p>
          </div>

          {/* Shot Clock */}

          <div className="border-t border-white/10 px-5 py-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.15em] text-white/35">
                  SHOT CLOCK
                </p>

                <p
                  dir="ltr"
                  className={`mt-1 text-4xl font-black tabular-nums ${
                    isShotRunning &&
                    displayShotSeconds <= 5
                      ? "text-red-500"
                      : "text-white"
                  }`}
                >
                  {displayShotSeconds}
                </p>
              </div>

              <div className="text-left text-xs text-white/30">
                {isShotRunning
                  ? "در حال شمارش"
                  : "آماده"}
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-red-500 transition-[width] duration-300"
                style={{
                  width: `${shotProgress}%`,
                }}
              />
            </div>
          </div>

          {/* Footer */}

          <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-[11px] text-white/25">
            <span>SNOOKERIA LIVE</span>

            <span dir="ltr">
              ROOM {normalizedRoomCode}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}