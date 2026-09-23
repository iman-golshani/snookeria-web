"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock3,
  Expand,
  Minimize2,
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

  const [isFullscreen, setIsFullscreen] = useState(false);

  const latestStateRef = useRef<LiveState>({});
  const fullscreenRef = useRef<HTMLDivElement>(null);

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

        const mergedState: LiveState = {
          ...latestStateRef.current,
          ...incoming,
        };

        latestStateRef.current = mergedState;

        setLiveState(mergedState);
        setHasReceivedState(true);

        /*
         * TIMER SYNCHRONIZATION
         */

        let elapsedSeconds = 0;

        if (incoming.sentAt) {
          const sentAt = Date.parse(incoming.sentAt);

          if (!Number.isNaN(sentAt)) {
            elapsedSeconds = Math.max(
              0,
              Math.floor((Date.now() - sentAt) / 1000)
            );
          }
        }

        /*
         * Match Timer
         */

        if (incoming.totalTimeSeconds !== undefined) {
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

        if (incoming.shotTimeSeconds !== undefined) {
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
   */

  useEffect(() => {
    const timer = window.setInterval(() => {
      const state = latestStateRef.current;

      if (!state.isGameRunning || state.isPaused) {
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
   * FULLSCREEN
   * =========================================================
   */

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement === fullscreenRef.current
      );
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  const enterFullscreen = async () => {
    const element = fullscreenRef.current;

    if (!element) {
      return;
    }

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
        return;
      }
    } catch (error) {
      console.warn(
        "Native fullscreen is not available:",
        error
      );
    }

    /*
     * Fallback for browsers without element fullscreen support.
     */

    setIsFullscreen(true);
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn(
        "Could not exit native fullscreen:",
        error
      );
    }

    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      void exitFullscreen();
    } else {
      void enterFullscreen();
    }
  };

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

  const isLive =
    liveState.isGameRunning === true;

  const isPaused =
    liveState.isPaused === true;

  const isShotRunning =
    liveState.isShotRunning === true;

  /*
   * Shoot Out:
   * First 5 minutes = 15 seconds
   * Last 5 minutes = 10 seconds
   */

  const shotClockLimit =
    displayTotalSeconds <= 300 ? 10 : 15;

  const shotProgress = Math.min(
    100,
    Math.max(
      0,
      (displayShotSeconds / shotClockLimit) * 100
    )
  );

  const shotProgressColor =
    shotProgress > 60
      ? "bg-emerald-500"
      : shotProgress > 35
        ? "bg-yellow-400"
        : shotProgress > 15
          ? "bg-orange-500"
          : "bg-red-500";

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <section>
      {/* Normal Page Status */}

      {!isFullscreen && (
        <div className="mb-2 flex h-9 items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3">
          <div className="flex items-center gap-2">
            {isLive ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>

                <span className="text-[10px] font-bold tracking-[0.16em] text-red-500">
                  LIVE
                </span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-white/25" />

                <span className="text-[10px] text-white/40">
                  در انتظار شروع
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 text-[10px] ${
                connectionState === "connected"
                  ? "text-emerald-400"
                  : "text-white/35"
              }`}
            >
              {connectionState === "connected" ? (
                <Wifi size={13} />
              ) : connectionState === "connecting" ? (
                <RefreshCw
                  size={12}
                  className="animate-spin"
                />
              ) : (
                <WifiOff size={13} />
              )}

              {connectionState === "connected"
                ? "اتصال زنده"
                : connectionState === "connecting"
                  ? "در حال اتصال..."
                  : "اتصال قطع است"}
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="نمایش تمام صفحه"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] text-white/60 transition hover:bg-white/10 hover:text-white active:scale-95"
            >
              <Expand size={14} />
            </button>
          </div>
        </div>
      )}

      {!hasReceivedState ? (
        /*
         * WAITING FOR STATE
         */

        <div className="flex min-h-[55vh] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.025] px-5 text-center">
          {connectionState === "error" ? (
            <>
              <WifiOff
                size={30}
                className="text-red-500"
              />

              <h1 className="mt-4 text-base font-bold">
                اتصال به مسابقه برقرار نشد
              </h1>

              <p className="mt-2 max-w-md text-xs leading-6 text-white/40">
                ممکن است مسابقه پایان یافته باشد یا
                Operator در دسترس نباشد.
              </p>
            </>
          ) : (
            <>
              <Radio
                size={30}
                className="animate-pulse text-red-500"
              />

              <h1 className="mt-4 text-base font-bold">
                در حال دریافت اطلاعات مسابقه
              </h1>

              <p className="mt-2 text-xs text-white/40">
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
         * FULLSCREEN TARGET
         * =====================================================
         */

        <div
          ref={fullscreenRef}
          className={
            isFullscreen
              ? "fixed inset-0 z-[9999] flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-[#071426] p-3 text-white md:p-4"
              : ""
          }
        >
          <div
            className={`relative w-full overflow-hidden border border-white/10 bg-[#0a192c] ${
              isFullscreen
                ? "mx-auto rounded-[24px] md:flex md:h-full md:max-w-none md:flex-col md:rounded-[28px]"
                : "rounded-[22px]"
            }`}
          >
            {/* Fullscreen Top Controls */}

            {isFullscreen && (
              <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/10 px-3 md:h-12 md:px-5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>

                  <span className="text-[10px] font-bold tracking-[0.16em] text-red-500 md:text-xs">
                    LIVE
                  </span>

                  {connectionState === "connected" && (
                    <span className="flex items-center gap-1 text-[9px] text-emerald-400 md:text-xs">
                      <Wifi size={11} />
                      متصل
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label="خروج از تمام صفحه"
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] text-white/60 transition hover:bg-white/10 hover:text-white active:scale-95 md:h-9 md:w-9"
                >
                  <Minimize2
                    size={14}
                    className="md:h-[18px] md:w-[18px]"
                  />
                </button>
              </div>
            )}

            {/* Match Timer */}

            <div
              className={`shrink-0 border-b border-white/10 text-center ${
                isFullscreen
                  ? "px-4 py-4 md:py-5"
                  : "px-4 py-3"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/35 md:text-xs">
                <Clock3 size={12} />
                زمان باقی‌مانده مسابقه
              </div>

              <div
                dir="ltr"
                className={`mt-1 font-black leading-none tracking-tight tabular-nums ${
                  isFullscreen
                    ? "text-5xl sm:text-6xl md:text-7xl"
                    : "text-4xl sm:text-5xl"
                }`}
              >
                {formatTime(displayTotalSeconds)}
              </div>

              {isPaused && (
                <div className="mt-1.5 inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-[9px] font-semibold text-amber-400 md:text-xs">
                  مسابقه متوقف شده است
                </div>
              )}
            </div>

            {/* Players */}

            <div
              className={`grid grid-cols-[1fr_auto_1fr] items-center ${
                isFullscreen
                  ? "gap-3 px-4 py-5 sm:gap-10 sm:px-10 md:min-h-0 md:flex-1 md:gap-16 md:px-16 md:py-4 lg:px-24"
                  : "gap-2 px-3 py-3 sm:gap-8 sm:px-8 sm:py-5"
              }`}
            >
              {/* Player 1 */}

              <div className="min-w-0 text-center">
                <div
                  className={`mx-auto overflow-hidden rounded-full border-2 ${
                    isFullscreen
                      ? "h-24 w-24 sm:h-32 sm:w-32 md:h-44 md:w-44 lg:h-52 lg:w-52"
                      : "h-20 w-20 sm:h-28 sm:w-28"
                  } ${
                    currentPlayer === 1
                      ? "border-red-500"
                      : "border-white/10"
                  }`}
                >
                  {liveState.player1Image ? (
                    <img
                      src={liveState.player1Image}
                      alt={player1Name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#0b1b30] text-white/25">
                      <UserRound
                        size={isFullscreen ? 34 : 30}
                        className={
                          isFullscreen
                            ? "md:h-14 md:w-14"
                            : ""
                        }
                      />
                    </div>
                  )}
                </div>

                <h2
                  className={`mt-2 truncate font-bold ${
                    isFullscreen
                      ? "text-base sm:text-xl md:mt-4 md:text-2xl lg:text-3xl"
                      : "text-sm sm:text-lg"
                  }`}
                >
                  {player1Name}
                </h2>

                <div
                  className={`mt-1 font-black leading-none tabular-nums ${
                    isFullscreen
                      ? "text-6xl sm:text-7xl md:mt-3 md:text-8xl lg:text-9xl"
                      : "text-5xl sm:text-6xl"
                  }`}
                >
                  {player1Score}
                </div>

                <div
                  className={`flex items-center justify-center gap-2 ${
                    isFullscreen
                      ? "mt-2 md:mt-4"
                      : "mt-2"
                  }`}
                >
                  <span className="text-[10px] font-semibold tracking-[0.1em] text-white/30 md:text-sm">
                    BREAK
                  </span>

                  <span
                    className={`font-black leading-none tabular-nums ${
                      isFullscreen
                        ? "text-xl sm:text-2xl md:text-3xl"
                        : "text-lg sm:text-xl"
                    } ${
                      currentPlayer === 1 &&
                      player1Break > 0
                        ? "text-red-400"
                        : "text-white/60"
                    }`}
                  >
                    {player1Break}
                  </span>
                </div>
              </div>

              {/* VS */}

              <div className="flex flex-col items-center justify-center">
                <span
                  className={`font-black tracking-[0.18em] text-white/20 ${
                    isFullscreen
                      ? "text-xs md:text-2xl"
                      : "text-xs"
                  }`}
                >
                  VS
                </span>

                <div
                  className={`w-px bg-white/10 ${
                    isFullscreen
                      ? "my-2 h-6 md:my-4 md:h-12"
                      : "my-2 h-6"
                  }`}
                />

                {(currentPlayer === 1 ||
                  currentPlayer === 2) && (
                  <span
                    className={`whitespace-nowrap rounded-full border border-red-500/20 bg-red-500/10 font-semibold text-red-400 ${
                      isFullscreen
                        ? "px-2 py-1 text-[9px] md:px-4 md:py-2 md:text-sm"
                        : "px-2 py-1 text-[9px]"
                    }`}
                  >
                    نوبت بازیکن {currentPlayer}
                  </span>
                )}
              </div>

              {/* Player 2 */}

              <div className="min-w-0 text-center">
                <div
                  className={`mx-auto overflow-hidden rounded-full border-2 ${
                    isFullscreen
                      ? "h-24 w-24 sm:h-32 sm:w-32 md:h-44 md:w-44 lg:h-52 lg:w-52"
                      : "h-20 w-20 sm:h-28 sm:w-28"
                  } ${
                    currentPlayer === 2
                      ? "border-red-500"
                      : "border-white/10"
                  }`}
                >
                  {liveState.player2Image ? (
                    <img
                      src={liveState.player2Image}
                      alt={player2Name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#0b1b30] text-white/25">
                      <UserRound
                        size={isFullscreen ? 34 : 30}
                        className={
                          isFullscreen
                            ? "md:h-14 md:w-14"
                            : ""
                        }
                      />
                    </div>
                  )}
                </div>

                <h2
                  className={`mt-2 truncate font-bold ${
                    isFullscreen
                      ? "text-base sm:text-xl md:mt-4 md:text-2xl lg:text-3xl"
                      : "text-sm sm:text-lg"
                  }`}
                >
                  {player2Name}
                </h2>

                <div
                  className={`mt-1 font-black leading-none tabular-nums ${
                    isFullscreen
                      ? "text-6xl sm:text-7xl md:mt-3 md:text-8xl lg:text-9xl"
                      : "text-5xl sm:text-6xl"
                  }`}
                >
                  {player2Score}
                </div>

                <div
                  className={`flex items-center justify-center gap-2 ${
                    isFullscreen
                      ? "mt-2 md:mt-4"
                      : "mt-2"
                  }`}
                >
                  <span className="text-[10px] font-semibold tracking-[0.1em] text-white/30 md:text-sm">
                    BREAK
                  </span>

                  <span
                    className={`font-black leading-none tabular-nums ${
                      isFullscreen
                        ? "text-xl sm:text-2xl md:text-3xl"
                        : "text-lg sm:text-xl"
                    } ${
                      currentPlayer === 2 &&
                      player2Break > 0
                        ? "text-red-400"
                        : "text-white/60"
                    }`}
                  >
                    {player2Break}
                  </span>
                </div>
              </div>
            </div>

            {/* Shot Clock */}

            <div
              className={`shrink-0 border-t border-white/10 ${
                isFullscreen
                  ? "px-5 py-4 md:px-8 md:py-5"
                  : "px-4 py-3"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.14em] text-white/30 md:text-sm">
                    SHOT CLOCK
                  </p>

                  <p className="mt-0.5 text-[9px] text-white/25 md:text-xs">
                    {isShotRunning
                      ? "در حال شمارش"
                      : "آماده"}
                  </p>
                </div>

                <p
                  dir="ltr"
                  className={`font-black leading-none tabular-nums ${
                    isFullscreen
                      ? "text-5xl md:text-7xl"
                      : "text-4xl"
                  } ${
                    isShotRunning &&
                    displayShotSeconds <= 5
                      ? "text-red-500"
                      : "text-white"
                  }`}
                >
                  {displayShotSeconds}
                </p>
              </div>

              {/* Progress */}

              <div
                className={`overflow-hidden rounded-full bg-white/10 ${
                  isFullscreen
                    ? "mt-4 h-2 md:mt-5 md:h-3"
                    : "mt-3 h-1.5"
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${shotProgressColor}`}
                  style={{
                    width: `${shotProgress}%`,
                  }}
                />
              </div>
            </div>

            {/* Footer */}

            <div
              className={`flex shrink-0 items-center justify-between border-t border-white/10 px-4 text-white/20 ${
                isFullscreen
                  ? "h-8 text-[9px] md:h-10 md:px-6 md:text-xs"
                  : "h-8 text-[9px]"
              }`}
            >
              <span>SNOOKERIA LIVE</span>

              <span dir="ltr">
                ROOM {normalizedRoomCode}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}