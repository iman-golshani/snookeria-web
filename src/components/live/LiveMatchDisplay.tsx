"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock3,
  Expand,
  Minimize2,
  Radio,
  RefreshCw,
  UserRound,
  Volume2,
  VolumeX,
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

  isMatchFinished?: boolean;
  isTie?: boolean;
  isPenaltyMode?: boolean;

  winnerPlayer?: number | null;

  penaltyRound?: number;

  player1PenaltyResult?: boolean | null;
  player2PenaltyResult?: boolean | null;

  player1PenaltyHistory?: boolean[];
  player2PenaltyHistory?: boolean[];

  hasPlayerMedia?: boolean;
  mediaPlayer?: number;

  serverStateCreatedAt?: string;
  sentAt?: string;

  event?: string;
};

type AudioEvent = {
  sound?: string;
  roomCode?: string;
  eventId?: string;
  sentAt?: string;
};

type ConnectionState =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

type AudioPlayers = {
  matchStart: HTMLAudioElement;
  halftime: HTMLAudioElement;
  matchWarning: HTMLAudioElement;
  matchEnd: HTMLAudioElement;
  shotWarning: HTMLAudioElement;
  shotTimeout: HTMLAudioElement;
  shotPlayed: HTMLAudioElement;
  penaltyPot: HTMLAudioElement;
  penaltyMiss: HTMLAudioElement;
};

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

function extractBroadcastPayload<T>(message: unknown): T {
  if (
    message &&
    typeof message === "object" &&
    "payload" in message
  ) {
    const wrapped = message as {
      payload?: unknown;
    };

    if (
      wrapped.payload &&
      typeof wrapped.payload === "object"
    ) {
      return wrapped.payload as T;
    }
  }

  return message as T;
}

function createAudioPlayers(): AudioPlayers {
  const create = (src: string) => {
    const audio = new Audio(src);
    audio.preload = "auto";
    return audio;
  };

  return {
    matchStart: create("/sounds/start.mp3"),
    halftime: create("/sounds/halftime.mp3"),
    matchWarning: create("/sounds/beep.mp3"),
    matchEnd: create("/sounds/long_beep1.mp3"),
    shotWarning: create("/sounds/beep.mp3"),
    shotTimeout: create("/sounds/long_beep.mp3"),
    shotPlayed: create("/sounds/shot.mp3"),
    penaltyPot: create("/sounds/pot.mp3"),
    penaltyMiss: create("/sounds/miss.mp3"),
  };
}

function stopAudio(audio?: HTMLAudioElement) {
  if (!audio) {
    return;
  }

  try {
    audio.pause();
    audio.currentTime = 0;
  } catch {
    // Ignore browser media reset errors.
  }
}

function stopAllAudio(players: AudioPlayers | null) {
  if (!players) {
    return;
  }

  Object.values(players).forEach((audio) => {
    stopAudio(audio);
  });
}

async function playAudio(audio?: HTMLAudioElement) {
  if (!audio) {
    return;
  }

  try {
    audio.pause();
    audio.currentTime = 0;

    await audio.play();
  } catch (error) {
    console.warn("Live audio playback blocked:", error);
  }
}

function PenaltyHistory({
  history,
}: {
  history: boolean[];
}) {
  const visibleHistory = history.slice(-6);
  const hasOlderResults = history.length > 6;

  if (history.length === 0) {
    return (
      <span className="text-[10px] font-semibold text-white/25 md:text-xs">
        در انتظار ضربه
      </span>
    );
  }

  return (
    <div
      dir="ltr"
      className="flex h-6 items-center justify-center gap-1"
    >
      {hasOlderResults && (
        <span className="mr-0.5 text-[10px] text-white/25">
          …
        </span>
      )}

      {visibleHistory.map((result, index) => (
        <span
          key={`${index}-${result}`}
          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black ${
            result
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-red-500/15 text-red-400"
          }`}
        >
          {result ? "✓" : "×"}
        </span>
      ))}
    </div>
  );
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

  const [audioEnabled, setAudioEnabled] = useState(false);

  const latestStateRef = useRef<LiveState>({});
  const fullscreenRef = useRef<HTMLDivElement>(null);

  const audioPlayersRef = useRef<AudioPlayers | null>(null);
  const audioEnabledRef = useRef(false);

  const lastAudioEventIdRef = useRef<string | null>(null);

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
   * AUDIO SETUP
   * =========================================================
   */

  useEffect(() => {
    audioPlayersRef.current = createAudioPlayers();

    return () => {
      stopAllAudio(audioPlayersRef.current);
      audioPlayersRef.current = null;
    };
  }, []);

  const enableAudio = async () => {
    const players = audioPlayersRef.current;

    if (!players) {
      return;
    }

    audioEnabledRef.current = true;
    setAudioEnabled(true);

    const allPlayers = Object.values(players);

    for (const audio of allPlayers) {
      try {
        audio.muted = true;
        audio.currentTime = 0;

        const playPromise = audio.play();

        if (playPromise) {
          await playPromise;
        }

        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
      } catch {
        audio.muted = false;
      }
    }
  };

  const disableAudio = () => {
    audioEnabledRef.current = false;
    setAudioEnabled(false);

    stopAllAudio(audioPlayersRef.current);
  };

  const toggleAudio = () => {
    if (audioEnabledRef.current) {
      disableAudio();
    } else {
      void enableAudio();
    }
  };

  /*
   * =========================================================
   * AUDIO EVENT HANDLER
   * =========================================================
   */

  const handleAudioEvent = (incoming: AudioEvent) => {
    if (!audioEnabledRef.current) {
      return;
    }

    const eventId = incoming.eventId?.toString();

    if (
      eventId &&
      lastAudioEventIdRef.current === eventId
    ) {
      return;
    }

    if (eventId) {
      lastAudioEventIdRef.current = eventId;
    }

    const sound = incoming.sound ?? "";
    const players = audioPlayersRef.current;

    if (!players) {
      return;
    }

    switch (sound) {
      case "match_start":
        void playAudio(players.matchStart);
        break;

      case "halftime":
        void playAudio(players.halftime);
        break;

      case "match_warning":
        void playAudio(players.matchWarning);
        break;

      case "match_end":
        void playAudio(players.matchEnd);
        break;

      case "shot_warning":
        void playAudio(players.shotWarning);
        break;

      case "shot_timeout":
        stopAudio(players.shotWarning);
        void playAudio(players.shotTimeout);
        break;

      case "shot_played":
        stopAudio(players.shotWarning);
        stopAudio(players.shotTimeout);

        void playAudio(players.shotPlayed);
        break;

      case "penalty_pot":
        void playAudio(players.penaltyPot);
        break;

      case "penalty_miss":
        void playAudio(players.penaltyMiss);
        break;

      default:
        break;
    }
  };

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

    channel.on(
      "broadcast",
      {
        event: "state_snapshot",
      },
      (message) => {
        if (disposed || !message) {
          return;
        }

        const incoming =
          extractBroadcastPayload<LiveState>(message);

        const mergedState: LiveState = {
          ...latestStateRef.current,
          ...incoming,
        };

        latestStateRef.current = mergedState;

        setLiveState(mergedState);
        setHasReceivedState(true);

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

    channel.on(
      "broadcast",
      {
        event: "audio_event",
      },
      (message) => {
        if (disposed || !message) {
          return;
        }

        const incoming =
          extractBroadcastPayload<AudioEvent>(message);

        handleAudioEvent(incoming);
      }
    );

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

      if (
        !state.isGameRunning ||
        state.isPaused ||
        state.isMatchFinished ||
        state.isPenaltyMode
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

  const penaltyRound = readNumber(
    liveState.penaltyRound,
    1
  );

  const player1PenaltyHistory =
    liveState.player1PenaltyHistory ?? [];

  const player2PenaltyHistory =
    liveState.player2PenaltyHistory ?? [];

  const isGameRunning =
    liveState.isGameRunning === true;

  const isPaused =
    liveState.isPaused === true;

  const isShotRunning =
    liveState.isShotRunning === true;

  const isMatchFinished =
    liveState.isMatchFinished === true;

  const isTie =
    liveState.isTie === true;

  const isPenaltyMode =
    liveState.isPenaltyMode === true;

  const winnerPlayer =
    liveState.winnerPlayer ?? null;

  const winnerName =
    winnerPlayer === 1
      ? player1Name
      : winnerPlayer === 2
        ? player2Name
        : "";

  const activePlayerName =
    currentPlayer === 1
      ? player1Name
      : player2Name;

  const isLive =
    !isMatchFinished &&
    (isGameRunning || isPenaltyMode);

  /*
   * =========================================================
   * STATUS
   * =========================================================
   */

  let statusText = "";
  let statusClass =
    "bg-transparent text-transparent opacity-0";

  if (isMatchFinished && winnerPlayer) {
    statusText = `پایان مسابقه • برنده: ${winnerName}`;

    statusClass =
      "bg-emerald-500/10 text-emerald-400 opacity-100";
  } else if (isPenaltyMode) {
    statusText = `پنالتی • راند ${penaltyRound}`;

    statusClass =
      "bg-red-500/10 text-red-400 opacity-100";
  } else if (
    isMatchFinished &&
    isTie &&
    !isPenaltyMode
  ) {
    statusText =
      "مسابقه مساوی شد • در انتظار شروع پنالتی";

    statusClass =
      "bg-amber-500/10 text-amber-400 opacity-100";
  } else if (isPaused) {
    statusText = "مسابقه متوقف شده است";

    statusClass =
      "bg-amber-500/10 text-amber-400 opacity-100";
  } else if (!isGameRunning) {
    statusText = "آماده شروع مسابقه";

    statusClass =
      "bg-white/[0.05] text-white/45 opacity-100";
  }

  /*
   * =========================================================
   * SHOT CLOCK
   * =========================================================
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
      {/* NORMAL PAGE STATUS */}

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
            ) : isMatchFinished ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-[10px] font-semibold text-emerald-400">
                  پایان مسابقه
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleAudio}
              aria-label={
                audioEnabled
                  ? "قطع صدای پخش زنده"
                  : "فعال‌سازی صدای پخش زنده"
              }
              title={
                audioEnabled
                  ? "صدای پخش زنده فعال است"
                  : "فعال‌سازی صدای پخش زنده"
              }
              className={`flex h-7 w-7 items-center justify-center rounded-lg transition active:scale-95 ${
                audioEnabled
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-white/[0.06] text-white/45 hover:bg-white/10 hover:text-white"
              }`}
            >
              {audioEnabled ? (
                <Volume2 size={14} />
              ) : (
                <VolumeX size={14} />
              )}
            </button>

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
                ? "mx-auto rounded-[24px] md:grid md:h-full md:max-w-none md:grid-rows-[44px_135px_minmax(0,1fr)_115px_32px] md:rounded-[28px]"
                : "rounded-[22px]"
            }`}
          >
            {/* FULLSCREEN TOP BAR */}

            {isFullscreen && (
              <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/10 px-3 md:h-11 md:px-5">
                <div className="flex items-center gap-2">
                  {isLive ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                      </span>

                      <span className="text-[10px] font-bold tracking-[0.16em] text-red-500 md:text-xs">
                        LIVE
                      </span>
                    </>
                  ) : isMatchFinished ? (
                    <span className="text-[10px] font-semibold text-emerald-400 md:text-xs">
                      پایان مسابقه
                    </span>
                  ) : (
                    <span className="text-[10px] text-white/40 md:text-xs">
                      آماده شروع
                    </span>
                  )}

                  {connectionState === "connected" && (
                    <span className="flex items-center gap-1 text-[9px] text-emerald-400 md:text-xs">
                      <Wifi size={11} />
                      متصل
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleAudio}
                    aria-label={
                      audioEnabled
                        ? "قطع صدای پخش زنده"
                        : "فعال‌سازی صدای پخش زنده"
                    }
                    className={`flex h-7 w-7 items-center justify-center rounded-lg transition active:scale-95 md:h-8 md:w-8 ${
                      audioEnabled
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-white/[0.06] text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {audioEnabled ? (
                      <Volume2
                        size={14}
                        className="md:h-4 md:w-4"
                      />
                    ) : (
                      <VolumeX
                        size={14}
                        className="md:h-4 md:w-4"
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label="خروج از تمام صفحه"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] text-white/60 transition hover:bg-white/10 hover:text-white active:scale-95 md:h-8 md:w-8"
                  >
                    <Minimize2
                      size={14}
                      className="md:h-4 md:w-4"
                    />
                  </button>
                </div>
              </div>
            )}

            {/* MATCH TIMER */}

            <div
              className={`shrink-0 border-b border-white/10 text-center ${
                isFullscreen
                  ? "px-4 py-4 md:flex md:h-full md:flex-col md:items-center md:justify-center md:py-0"
                  : "px-4 py-3"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/35 md:text-xs">
                <Clock3 size={12} />

                {isPenaltyMode
                  ? "مرحله پنالتی"
                  : isMatchFinished
                    ? "زمان نهایی مسابقه"
                    : "زمان باقی‌مانده مسابقه"}
              </div>

              <div
                dir="ltr"
                className={`mt-1 font-black leading-none tracking-tight tabular-nums ${
                  isFullscreen
                    ? "text-5xl sm:text-6xl md:text-6xl"
                    : "text-4xl sm:text-5xl"
                }`}
              >
                {formatTime(displayTotalSeconds)}
              </div>

              {/* FIXED STATUS SLOT */}

              <div className="mt-1.5 flex h-[22px] shrink-0 items-center justify-center md:h-[22px]">
                <div
                  className={`max-w-full truncate rounded-full px-4 py-1 text-[11px] font-bold transition-opacity duration-200 md:text-xs ${statusClass}`}
                >
                  {statusText || "placeholder"}
                </div>
              </div>
            </div>

            {/* PLAYERS */}

            <div
              className={`grid grid-cols-[1fr_auto_1fr] items-center ${
                isFullscreen
                  ? "gap-3 px-4 py-5 sm:gap-10 sm:px-10 md:h-full md:min-h-0 md:gap-14 md:px-16 md:py-1 lg:px-24"
                  : "gap-2 px-3 py-3 sm:gap-8 sm:px-8 sm:py-5"
              }`}
            >
              {/* PLAYER 1 */}

              <div className="min-w-0 text-center">
                <div
                  className={`mx-auto overflow-hidden rounded-full border-2 transition-all duration-300 ${
                    isFullscreen
                      ? "h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40"
                      : "h-20 w-20 sm:h-28 sm:w-28"
                  } ${
                    currentPlayer === 1 &&
                    !isMatchFinished
                      ? "border-red-500 shadow-[0_0_28px_rgba(239,68,68,0.65)] ring-2 ring-red-500/35"
                      : winnerPlayer === 1
                        ? "border-emerald-400 shadow-[0_0_28px_rgba(52,211,153,0.45)] ring-2 ring-emerald-400/30"
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
                            ? "md:h-12 md:w-12"
                            : ""
                        }
                      />
                    </div>
                  )}
                </div>

                <h2
                  className={`mt-2 truncate font-bold ${
                    currentPlayer === 1 &&
                    !isMatchFinished
                      ? "text-white"
                      : winnerPlayer === 1
                        ? "text-emerald-400"
                        : "text-white"
                  } ${
                    isFullscreen
                      ? "text-base sm:text-xl md:mt-3 md:text-xl lg:text-2xl"
                      : "text-sm sm:text-lg"
                  }`}
                >
                  {player1Name}
                </h2>

                <div
                  className={`mt-1 font-black leading-none tabular-nums ${
                    isFullscreen
                      ? "text-6xl sm:text-7xl md:mt-2 md:text-6xl lg:text-7xl"
                      : "text-5xl sm:text-6xl"
                  }`}
                >
                  {player1Score}
                </div>

                <div
                  className={`flex h-6 items-center justify-center gap-2 ${
                    isFullscreen
                      ? "mt-2 md:mt-2"
                      : "mt-2"
                  }`}
                >
                  {isPenaltyMode ||
                  player1PenaltyHistory.length > 0 ? (
                    <PenaltyHistory
                      history={player1PenaltyHistory}
                    />
                  ) : (
                    <>
                      <span className="text-[10px] font-semibold tracking-[0.1em] text-white/30 md:text-xs">
                        BREAK
                      </span>

                      <span
                        className={`font-black leading-none tabular-nums ${
                          isFullscreen
                            ? "text-xl sm:text-2xl md:text-2xl"
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
                    </>
                  )}
                </div>
              </div>

              {/* CENTER */}

              <div className="flex h-full min-h-0 flex-col items-center justify-center">
                <span
                  className={`font-black tracking-[0.18em] text-white/20 ${
                    isFullscreen
                      ? "text-xs md:text-xl"
                      : "text-xs"
                  }`}
                >
                  {isPenaltyMode ? "PEN" : "VS"}
                </span>

                <div
                  className={`w-px bg-white/10 ${
                    isFullscreen
                      ? "my-2 h-6 md:my-3 md:h-9"
                      : "my-2 h-6"
                  }`}
                />

                {/* ACTIVE PLAYER / WINNER SLOT */}

                <div className="flex h-[38px] min-w-[86px] items-center justify-center md:h-[38px] md:min-w-[120px]">
                  {winnerPlayer ? (
                    <div className="text-center">
                      <p className="text-[8px] font-semibold text-emerald-400/60 md:text-[9px]">
                        برنده
                      </p>

                      <p className="mt-0.5 max-w-[110px] truncate text-[10px] font-black text-emerald-400 md:max-w-[150px] md:text-sm">
                        {winnerName}
                      </p>
                    </div>
                  ) : isPenaltyMode ? (
                    <div className="text-center">
                      <p className="text-[8px] font-semibold text-red-400/60 md:text-[9px]">
                        پنالتی
                      </p>

                      <p className="mt-0.5 text-[10px] font-black text-red-400 md:text-sm">
                        راند {penaltyRound}
                      </p>
                    </div>
                  ) : isGameRunning ? (
                    <div className="text-center">
                      <p className="text-[8px] font-semibold text-white/30 md:text-[9px]">
                        نوبت ضربه
                      </p>

                      <p className="mt-0.5 max-w-[110px] truncate text-[10px] font-black text-red-400 md:max-w-[150px] md:text-sm">
                        {activePlayerName}
                      </p>
                    </div>
                  ) : (
                    <div
                      aria-hidden="true"
                      className="h-[38px]"
                    />
                  )}
                </div>
              </div>

              {/* PLAYER 2 */}

              <div className="min-w-0 text-center">
                <div
                  className={`mx-auto overflow-hidden rounded-full border-2 transition-all duration-300 ${
                    isFullscreen
                      ? "h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40"
                      : "h-20 w-20 sm:h-28 sm:w-28"
                  } ${
                    currentPlayer === 2 &&
                    !isMatchFinished
                      ? "border-red-500 shadow-[0_0_28px_rgba(239,68,68,0.65)] ring-2 ring-red-500/35"
                      : winnerPlayer === 2
                        ? "border-emerald-400 shadow-[0_0_28px_rgba(52,211,153,0.45)] ring-2 ring-emerald-400/30"
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
                            ? "md:h-12 md:w-12"
                            : ""
                        }
                      />
                    </div>
                  )}
                </div>

                <h2
                  className={`mt-2 truncate font-bold ${
                    currentPlayer === 2 &&
                    !isMatchFinished
                      ? "text-white"
                      : winnerPlayer === 2
                        ? "text-emerald-400"
                        : "text-white"
                  } ${
                    isFullscreen
                      ? "text-base sm:text-xl md:mt-3 md:text-xl lg:text-2xl"
                      : "text-sm sm:text-lg"
                  }`}
                >
                  {player2Name}
                </h2>

                <div
                  className={`mt-1 font-black leading-none tabular-nums ${
                    isFullscreen
                      ? "text-6xl sm:text-7xl md:mt-2 md:text-6xl lg:text-7xl"
                      : "text-5xl sm:text-6xl"
                  }`}
                >
                  {player2Score}
                </div>

                <div
                  className={`flex h-6 items-center justify-center gap-2 ${
                    isFullscreen
                      ? "mt-2 md:mt-2"
                      : "mt-2"
                  }`}
                >
                  {isPenaltyMode ||
                  player2PenaltyHistory.length > 0 ? (
                    <PenaltyHistory
                      history={player2PenaltyHistory}
                    />
                  ) : (
                    <>
                      <span className="text-[10px] font-semibold tracking-[0.1em] text-white/30 md:text-xs">
                        BREAK
                      </span>

                      <span
                        className={`font-black leading-none tabular-nums ${
                          isFullscreen
                            ? "text-xl sm:text-2xl md:text-2xl"
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
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* SHOT CLOCK */}

            <div
              className={`shrink-0 border-t border-white/10 ${
                isFullscreen
                  ? "px-5 py-4 md:flex md:h-full md:flex-col md:justify-center md:px-8 md:py-0"
                  : "px-4 py-3"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.14em] text-white/30 md:text-xs">
                    {isPenaltyMode
                      ? "PENALTY SHOOTOUT"
                      : "SHOT CLOCK"}
                  </p>

                  <p className="mt-0.5 text-[9px] text-white/25 md:text-[10px]">
                    {isPenaltyMode
                      ? `راند ${penaltyRound}`
                      : isMatchFinished
                        ? "پایان مسابقه"
                        : isShotRunning
                          ? "در حال شمارش"
                          : "آماده"}
                  </p>
                </div>

                <p
                  dir="ltr"
                  className={`font-black leading-none tabular-nums ${
                    isFullscreen
                      ? "text-5xl md:text-5xl"
                      : "text-4xl"
                  } ${
                    isShotRunning &&
                    displayShotSeconds <= 5
                      ? "text-red-500"
                      : isPenaltyMode
                        ? "text-red-400"
                        : "text-white"
                  }`}
                >
                  {isPenaltyMode
                    ? penaltyRound
                    : displayShotSeconds}
                </p>
              </div>

              {/* PROGRESS */}

              <div
                className={`overflow-hidden rounded-full bg-white/10 ${
                  isFullscreen
                    ? "mt-4 h-2 md:mt-3 md:h-2"
                    : "mt-3 h-1.5"
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPenaltyMode
                      ? "bg-red-500"
                      : shotProgressColor
                  }`}
                  style={{
                    width: isPenaltyMode
                      ? "100%"
                      : `${shotProgress}%`,
                  }}
                />
              </div>
            </div>

            {/* FOOTER */}

            <div
              className={`flex shrink-0 items-center justify-between border-t border-white/10 px-4 text-white/20 ${
                isFullscreen
                  ? "h-8 text-[9px] md:h-8 md:px-6 md:text-[10px]"
                  : "h-8 text-[9px]"
              }`}
            >
              <span>
                {audioEnabled
                  ? "SNOOKERIA LIVE • AUDIO ON"
                  : "SNOOKERIA LIVE"}
              </span>

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