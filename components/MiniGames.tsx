"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export type MiniGamesContent = { title: string; body: string };

const EASE = [0.22, 1, 0.36, 1] as const;

/* ============ Snake ============ */

const GRID = 16;
const CELL = 20;
const SIZE = GRID * CELL;

type Point = { x: number; y: number };

function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const snake = useRef<Point[]>([]);
  const dir = useRef<Point>({ x: 1, y: 0 });
  const nextDir = useRef<Point>({ x: 1, y: 0 });
  const food = useRef<Point>({ x: 10, y: 8 });

  const placeFood = useCallback(() => {
    do {
      food.current = {
        x: Math.floor(Math.random() * GRID),
        y: Math.floor(Math.random() * GRID),
      };
    } while (snake.current.some((s) => s.x === food.current.x && s.y === food.current.y));
  }, []);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, SIZE, SIZE);
    // food
    ctx.fillStyle = "#ffb020";
    ctx.beginPath();
    ctx.arc(food.current.x * CELL + CELL / 2, food.current.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
    // snake
    snake.current.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? "#ffffff" : "var(--fallback)";
      ctx.fillStyle = i === 0 ? "#ffffff" : "#d9822b";
      const pad = i === 0 ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(s.x * CELL + pad, s.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, 5);
      ctx.fill();
    });
  }, []);

  const start = useCallback(() => {
    snake.current = [{ x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 }];
    dir.current = { x: 1, y: 0 };
    nextDir.current = { x: 1, y: 0 };
    setScore(0);
    placeFood();
    setState("playing");
  }, [placeFood]);

  const turn = useCallback((d: Point) => {
    // no reversing into yourself
    if (d.x === -dir.current.x && d.y === -dir.current.y) return;
    nextDir.current = d;
  }, []);

  useEffect(() => {
    if (state !== "playing") return;
    const tick = setInterval(() => {
      dir.current = nextDir.current;
      const head = snake.current[0];
      const nh = { x: head.x + dir.current.x, y: head.y + dir.current.y };
      const hitWall = nh.x < 0 || nh.y < 0 || nh.x >= GRID || nh.y >= GRID;
      const hitSelf = snake.current.some((s) => s.x === nh.x && s.y === nh.y);
      if (hitWall || hitSelf) {
        setState("over");
        setBest((b) => Math.max(b, snake.current.length - 3));
        return;
      }
      snake.current = [nh, ...snake.current];
      if (nh.x === food.current.x && nh.y === food.current.y) {
        setScore((s) => s + 1);
        placeFood();
      } else {
        snake.current.pop();
      }
      draw();
    }, 130);
    return () => clearInterval(tick);
  }, [state, draw, placeFood]);

  useEffect(() => {
    draw();
  }, [draw, state]);

  useEffect(() => {
    const keys: Record<string, Point> = {
      ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
    };
    const onKey = (e: KeyboardEvent) => {
      const d = keys[e.key];
      if (!d) return;
      if (e.key.startsWith("Arrow")) e.preventDefault();
      turn(d);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turn]);

  const Btn = ({ d, label }: { d: Point; label: string }) => (
    <button
      aria-label={label}
      onPointerDown={(e) => {
        e.preventDefault();
        turn(d);
      }}
      className="w-11 h-11 rounded-xl bg-ink/5 hover:bg-accent hover:text-white font-bold transition-colors select-none touch-none"
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-[320px] flex flex-col items-center">
      <div className="flex items-center justify-between w-full max-w-[320px] mb-3">
        <p className="text-sm font-bold">🐍 Snake</p>
        <p className="text-xs text-ink/50 tabular-nums">Score {score} · Best {best}</p>
      </div>
      <div className="relative rounded-2xl overflow-hidden">
        <canvas ref={canvasRef} width={SIZE} height={SIZE} className="block max-w-full" />
        {state !== "playing" && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
            {state === "over" && <p className="text-white font-extrabold text-xl display">Game over!</p>}
            <button
              onClick={start}
              className="bg-accent text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              {state === "over" ? "Play again" : "Start"}
            </button>
            <p className="text-white/60 text-xs">Arrow keys / WASD or buttons</p>
          </div>
        )}
      </div>
      {/* touch controls */}
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <div />
        <Btn d={{ x: 0, y: -1 }} label="↑" />
        <div />
        <Btn d={{ x: -1, y: 0 }} label="←" />
        <Btn d={{ x: 0, y: 1 }} label="↓" />
        <Btn d={{ x: 1, y: 0 }} label="→" />
      </div>
    </div>
  );
}

/* ============ Memory Match ============ */

const EMOJIS = ["🐙", "🐠", "🦀", "🐬", "🐢", "🦑"];

function MemoryGame() {
  const [deck, setDeck] = useState<string[] | null>(null);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const lock = useRef(false);

  const shuffle = useCallback(() => {
    const cards = [...EMOJIS, ...EMOJIS]
      .map((e) => ({ e, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map((c) => c.e);
    setDeck(cards);
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
  }, []);

  useEffect(() => {
    shuffle(); // client-only so SSR markup stays deterministic
  }, [shuffle]);

  function flip(i: number) {
    if (!deck || lock.current || matched.has(i) || flipped.includes(i)) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      lock.current = true;
      const [a, b] = next;
      if (deck[a] === deck[b]) {
        setTimeout(() => {
          setMatched((prev) => new Set([...prev, a, b]));
          setFlipped([]);
          lock.current = false;
        }, 350);
      } else {
        setTimeout(() => {
          setFlipped([]);
          lock.current = false;
        }, 750);
      }
    }
  }

  const won = deck !== null && matched.size === deck.length;

  return (
    <div className="w-full max-w-[320px] flex flex-col items-center">
      <div className="flex items-center justify-between w-full max-w-[320px] mb-3">
        <p className="text-sm font-bold">🃏 Memory Match</p>
        <p className="text-xs text-ink/50 tabular-nums">Moves {moves}</p>
      </div>
      <div className="relative grid grid-cols-4 gap-2 w-full max-w-[320px]">
        {(deck ?? Array(12).fill("")).map((e, i) => {
          const up = flipped.includes(i) || matched.has(i);
          return (
            <button
              key={i}
              onClick={() => flip(i)}
              aria-label={up ? e : "Hidden card"}
              className="aspect-square [perspective:400px]"
            >
              <div
                className="relative w-full h-full transition-transform duration-300 [transform-style:preserve-3d]"
                style={{ transform: up ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                <div className="absolute inset-0 on-dark rounded-xl bg-inverse flex items-center justify-center text-accent-ink font-extrabold [backface-visibility:hidden]">
                  ?
                </div>
                <div
                  className={`absolute inset-0 rounded-xl flex items-center justify-center text-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    matched.has(i) ? "bg-accent/15" : "bg-ink/5"
                  }`}
                >
                  {e}
                </div>
              </div>
            </button>
          );
        })}
        {won && (
          <div className="absolute inset-0 rounded-xl bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
            <p className="text-white font-extrabold text-xl display">You won in {moves} moves!</p>
            <button
              onClick={shuffle}
              className="bg-accent text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              Play again
            </button>
          </div>
        )}
      </div>
      <button onClick={shuffle} className="mt-3 text-xs font-semibold text-ink/40 hover:text-accent-ink transition-colors">
        Shuffle & restart
      </button>
    </div>
  );
}


/* ============ Bubble Pop (whack-a-mole) ============ */

const POP_TIME = 30;

function BubblePop() {
  const [state, setState] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(POP_TIME);
  const [active, setActive] = useState(-1);
  const hopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const hop = useCallback(() => {
    setActive((prev) => {
      let next = Math.floor(Math.random() * 9);
      while (next === prev) next = Math.floor(Math.random() * 9);
      return next;
    });
    // bubbles hop faster as your score grows
    const delay = Math.max(420, 850 - scoreRef.current * 18);
    hopTimer.current = setTimeout(hop, delay);
  }, []);

  const start = useCallback(() => {
    setScore(0);
    setTimeLeft(POP_TIME);
    setState("playing");
    hop();
  }, [hop]);

  useEffect(() => {
    if (state !== "playing") return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          setState("over");
          setBest((b) => Math.max(b, scoreRef.current));
          setActive(-1);
          if (hopTimer.current) clearTimeout(hopTimer.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [state]);

  useEffect(() => () => {
    if (hopTimer.current) clearTimeout(hopTimer.current);
  }, []);

  function popCell(i: number) {
    if (state !== "playing" || i !== active) return;
    setScore((s) => s + 1);
    setActive(-1);
  }

  return (
    <div className="w-full max-w-[320px] flex flex-col items-center">
      <div className="flex items-center justify-between w-full max-w-[320px] mb-3">
        <p className="text-sm font-bold">🫧 Bubble Pop</p>
        <p className="text-xs text-ink/50 tabular-nums">
          {state === "playing" ? `${timeLeft}s · ` : ""}Score {score} · Best {best}
        </p>
      </div>
      <div className="relative grid grid-cols-3 gap-2 w-full max-w-[320px]">
        {Array.from({ length: 9 }, (_, i) => (
          <button
            key={i}
            aria-label={i === active ? "Pop the bubble" : "Empty"}
            onPointerDown={(e) => {
              e.preventDefault();
              popCell(i);
            }}
            className="aspect-square rounded-2xl bg-ink/5 flex items-center justify-center select-none touch-none overflow-hidden"
          >
            <span
              className={`text-4xl transition-transform duration-150 ${
                i === active ? "scale-100" : "scale-0"
              }`}
            >
              🫧
            </span>
          </button>
        ))}
        {state !== "playing" && (
          <div className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
            {state === "over" && (
              <p className="text-white font-extrabold text-xl display">{score} bubbles popped!</p>
            )}
            <button
              onClick={start}
              className="bg-accent text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              {state === "over" ? "Play again" : "Start"}
            </button>
            <p className="text-white/60 text-xs">Tap bubbles before they hop · {POP_TIME}s</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ Breakout ============ */

const BW = 320;
const BH = 320;
const COLS = 6;
const ROWS = 4;
const BRICK_H = 16;
const PADDLE_W = 64;

function Breakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"idle" | "playing" | "over" | "won">("idle");
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const paddleX = useRef(BW / 2);
  const ball = useRef({ x: BW / 2, y: BH - 60, vx: 2.6, vy: -2.6 });
  const bricks = useRef<boolean[]>([]);
  const raf = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, BW, BH);
    const bw = BW / COLS;
    const hues = ["#b8541a", "#d9822b", "#e8a85c", "#f3c98b"];
    bricks.current.forEach((alive, i) => {
      if (!alive) return;
      const r = Math.floor(i / COLS);
      const c = i % COLS;
      ctx.fillStyle = hues[r % hues.length];
      ctx.beginPath();
      ctx.roundRect(c * bw + 3, r * (BRICK_H + 6) + 28, bw - 6, BRICK_H, 4);
      ctx.fill();
    });
    // paddle
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(paddleX.current - PADDLE_W / 2, BH - 18, PADDLE_W, 8, 4);
    ctx.fill();
    // ball
    ctx.fillStyle = "#ffb020";
    ctx.beginPath();
    ctx.arc(ball.current.x, ball.current.y, 6, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const resetBall = useCallback(() => {
    ball.current = { x: BW / 2, y: BH - 60, vx: Math.random() > 0.5 ? 2.6 : -2.6, vy: -2.6 };
  }, []);

  const start = useCallback(() => {
    bricks.current = Array(COLS * ROWS).fill(true);
    setLives(3);
    setScore(0);
    resetBall();
    setState("playing");
  }, [resetBall]);

  useEffect(() => {
    if (state !== "playing") return;
    const step = () => {
      if (stateRef.current !== "playing") return;
      const b = ball.current;
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < 6 || b.x > BW - 6) b.vx *= -1;
      if (b.y < 6) b.vy *= -1;
      // paddle bounce with angle based on hit position
      if (b.y > BH - 26 && b.y < BH - 12 && Math.abs(b.x - paddleX.current) < PADDLE_W / 2 + 6 && b.vy > 0) {
        b.vy = -Math.abs(b.vy);
        b.vx = ((b.x - paddleX.current) / (PADDLE_W / 2)) * 3.2;
      }
      // brick collisions
      const bw = BW / COLS;
      const row = Math.floor((b.y - 28) / (BRICK_H + 6));
      const col = Math.floor(b.x / bw);
      if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        const idx = row * COLS + col;
        if (bricks.current[idx]) {
          bricks.current[idx] = false;
          b.vy *= -1;
          setScore((s) => s + 10);
          if (bricks.current.every((v) => !v)) {
            setState("won");
            return;
          }
        }
      }
      // dropped
      if (b.y > BH + 10) {
        setLives((l) => {
          if (l <= 1) {
            setState("over");
            return 0;
          }
          resetBall();
          return l - 1;
        });
      }
      draw();
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [state, draw, resetBall]);

  useEffect(() => {
    draw();
  }, [draw, state]);

  function movePaddle(clientX: number) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((clientX - rect.left) / rect.width) * BW;
    paddleX.current = Math.max(PADDLE_W / 2, Math.min(BW - PADDLE_W / 2, x));
  }

  return (
    <div className="w-full max-w-[320px] flex flex-col items-center">
      <div className="flex items-center justify-between w-full max-w-[320px] mb-3">
        <p className="text-sm font-bold">🧱 Breakout</p>
        <p className="text-xs text-ink/50 tabular-nums">Score {score} · Lives {"❤️".repeat(Math.max(0, lives)) || "0"}</p>
      </div>
      <div
        className="relative rounded-2xl overflow-hidden touch-none"
        onPointerMove={(e) => movePaddle(e.clientX)}
        onPointerDown={(e) => movePaddle(e.clientX)}
      >
        <canvas ref={canvasRef} width={BW} height={BH} className="block max-w-full" />
        {state !== "playing" && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
            {state === "over" && <p className="text-white font-extrabold text-xl display">Game over!</p>}
            {state === "won" && <p className="text-white font-extrabold text-xl display">Cleared! 🎉</p>}
            <button
              onClick={start}
              className="bg-accent text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              {state === "idle" ? "Start" : "Play again"}
            </button>
            <p className="text-white/60 text-xs">Move mouse or finger to steer the paddle</p>
          </div>
        )}
      </div>
    </div>
  );
}


/* ============ Reaction Time ============ */

function ReactionGame() {
  const [phase, setPhase] = useState<"idle" | "waiting" | "go" | "early" | "result">("idle");
  const [ms, setMs] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const goAt = useRef(0);

  const arm = useCallback(() => {
    setPhase("waiting");
    timer.current = setTimeout(() => {
      goAt.current = performance.now();
      setPhase("go");
    }, 1000 + Math.random() * 2500);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function tap() {
    if (phase === "idle" || phase === "early" || phase === "result") {
      arm();
    } else if (phase === "waiting") {
      if (timer.current) clearTimeout(timer.current);
      setPhase("early");
    } else if (phase === "go") {
      const t = Math.round(performance.now() - goAt.current);
      setMs(t);
      setBest((b) => (b === null ? t : Math.min(b, t)));
      setPhase("result");
    }
  }

  const bg =
    phase === "go" ? "bg-emerald-500" : phase === "waiting" ? "bg-rose-500" : "bg-inverse";

  return (
    <div className="w-full max-w-[320px] flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-3">
        <p className="text-sm font-bold">⚡ Reaction Time</p>
        <p className="text-xs text-ink/50 tabular-nums">Best {best === null ? "not set" : `${best}ms`}</p>
      </div>
      <button
        onPointerDown={(e) => {
          e.preventDefault();
          tap();
        }}
        className={`w-full aspect-square rounded-2xl ${bg} text-white flex flex-col items-center justify-center gap-2 select-none touch-none transition-colors`}
      >
        {phase === "idle" && <span className="font-bold">Tap to start</span>}
        {phase === "waiting" && <span className="font-bold">Wait for green…</span>}
        {phase === "go" && <span className="font-extrabold text-2xl display">TAP!</span>}
        {phase === "early" && (
          <>
            <span className="font-extrabold text-xl display">Too soon!</span>
            <span className="text-white/60 text-xs">Tap to retry</span>
          </>
        )}
        {phase === "result" && (
          <>
            <span className="font-extrabold text-4xl display">{ms}ms</span>
            <span className="text-white/60 text-xs">Tap to go again</span>
          </>
        )}
      </button>
    </div>
  );
}

/* ============ Simon Says ============ */

const PADS = [
  { on: "bg-sky-400", off: "bg-sky-600/40" },
  { on: "bg-emerald-400", off: "bg-emerald-600/40" },
  { on: "bg-amber-400", off: "bg-amber-600/40" },
  { on: "bg-rose-400", off: "bg-rose-600/40" },
];

function SimonGame() {
  const [state, setState] = useState<"idle" | "showing" | "input" | "over">("idle");
  const [seq, setSeq] = useState<number[]>([]);
  const [lit, setLit] = useState(-1);
  const [best, setBest] = useState(0);
  const inputPos = useRef(0);

  const playback = useCallback((s: number[]) => {
    setState("showing");
    s.forEach((pad, i) => {
      setTimeout(() => setLit(pad), 500 + i * 550);
      setTimeout(() => setLit(-1), 500 + i * 550 + 330);
    });
    setTimeout(() => {
      inputPos.current = 0;
      setState("input");
    }, 500 + s.length * 550);
  }, []);

  const extend = useCallback((s: number[]) => {
    const next = [...s, Math.floor(Math.random() * 4)];
    setSeq(next);
    playback(next);
  }, [playback]);

  function press(i: number) {
    if (state !== "input") return;
    setLit(i);
    setTimeout(() => setLit(-1), 180);
    if (i !== seq[inputPos.current]) {
      setState("over");
      setBest((b) => Math.max(b, seq.length - 1));
      return;
    }
    inputPos.current += 1;
    if (inputPos.current === seq.length) {
      setTimeout(() => extend(seq), 600);
    }
  }

  return (
    <div className="w-full max-w-[320px] flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-3">
        <p className="text-sm font-bold">🔁 Simon Says</p>
        <p className="text-xs text-ink/50 tabular-nums">Round {Math.max(0, seq.length - (state === "over" ? 1 : 0))} · Best {best}</p>
      </div>
      <div className="relative grid grid-cols-2 gap-2 w-full">
        {PADS.map((p, i) => (
          <button
            key={i}
            aria-label={`Pad ${i + 1}`}
            onPointerDown={(e) => {
              e.preventDefault();
              press(i);
            }}
            className={`aspect-square rounded-2xl transition-colors duration-150 select-none touch-none ${
              lit === i ? p.on : p.off
            } ${state === "input" ? "cursor-pointer" : "cursor-default"}`}
          />
        ))}
        {(state === "idle" || state === "over") && (
          <div className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
            {state === "over" && (
              <p className="text-white font-extrabold text-xl display">Round {seq.length - 1} reached!</p>
            )}
            <button
              onClick={() => {
                setSeq([]);
                extend([]);
              }}
              className="bg-accent text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              {state === "over" ? "Play again" : "Start"}
            </button>
            <p className="text-white/60 text-xs">Watch the pattern, then repeat it</p>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-ink/40 h-4">
        {state === "showing" ? "Watch…" : state === "input" ? "Your turn!" : ""}
      </p>
    </div>
  );
}

/* ============ Flappy Bubble ============ */

const FW = 320;
const FH = 320;

function FlappyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const bird = useRef({ y: FH / 2, vy: 0 });
  const pipes = useRef<{ x: number; gapY: number; passed: boolean }[]>([]);
  const raf = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, FW, FH);
    ctx.fillStyle = "#c8661f";
    pipes.current.forEach((p) => {
      ctx.beginPath();
      ctx.roundRect(p.x, 0, 40, p.gapY - 55, 6);
      ctx.roundRect(p.x, p.gapY + 55, 40, FH - p.gapY - 55, 6);
      ctx.fill();
    });
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(70, bird.current.y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c8661f";
    ctx.beginPath();
    ctx.arc(74, bird.current.y - 3, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const start = useCallback(() => {
    bird.current = { y: FH / 2, vy: -4 };
    pipes.current = [{ x: FW + 40, gapY: 100 + Math.random() * 120, passed: false }];
    setScore(0);
    setState("playing");
  }, []);

  const flap = useCallback(() => {
    if (stateRef.current === "playing") bird.current.vy = -4.4;
  }, []);

  useEffect(() => {
    if (state !== "playing") return;
    const step = () => {
      if (stateRef.current !== "playing") return;
      const b = bird.current;
      b.vy += 0.22;
      b.y += b.vy;
      pipes.current.forEach((p) => (p.x -= 1.8));
      if (pipes.current[pipes.current.length - 1].x < FW - 170) {
        pipes.current.push({ x: FW + 40, gapY: 90 + Math.random() * 140, passed: false });
      }
      pipes.current = pipes.current.filter((p) => p.x > -50);
      let dead = b.y < 8 || b.y > FH - 8;
      pipes.current.forEach((p) => {
        if (!p.passed && p.x + 40 < 70 - 11) {
          p.passed = true;
          setScore((s) => s + 1);
        }
        const inX = 70 + 11 > p.x && 70 - 11 < p.x + 40;
        const inGap = b.y - 11 > p.gapY - 55 && b.y + 11 < p.gapY + 55;
        if (inX && !inGap) dead = true;
      });
      if (dead) {
        setState("over");
        setBest((prev) => Math.max(prev, scoreRefF.current));
        return;
      }
      draw();
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [state, draw]);

  const scoreRefF = useRef(0);
  scoreRefF.current = score;

  useEffect(() => {
    draw();
  }, [draw, state]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " && stateRef.current === "playing") {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap]);

  return (
    <div className="w-full max-w-[320px] flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-3">
        <p className="text-sm font-bold">🐡 Flappy Bubble</p>
        <p className="text-xs text-ink/50 tabular-nums">Score {score} · Best {best}</p>
      </div>
      <div
        className="relative rounded-2xl overflow-hidden touch-none"
        onPointerDown={(e) => {
          e.preventDefault();
          flap();
        }}
      >
        <canvas ref={canvasRef} width={FW} height={FH} className="block max-w-full" />
        {state !== "playing" && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
            {state === "over" && <p className="text-white font-extrabold text-xl display">Popped!</p>}
            <button
              onClick={start}
              className="bg-accent text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              {state === "over" ? "Play again" : "Start"}
            </button>
            <p className="text-white/60 text-xs">Tap or Space to swim up</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ Stack Tower ============ */

const SW = 320;
const SH = 320;
const LAYER_H = 22;

function StackGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const layers = useRef<{ x: number; w: number }[]>([]);
  const moving = useRef({ x: 0, w: 120, dir: 1 });
  const raf = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, SW, SH);
    const count = layers.current.length;
    const offset = Math.max(0, (count + 1) * LAYER_H - (SH - 60));
    const hues = ["#b8541a", "#e8a85c", "#d9822b", "#f3c98b"];
    layers.current.forEach((l, i) => {
      const y = SH - 20 - (i + 1) * LAYER_H + offset;
      if (y > SH) return;
      ctx.fillStyle = hues[i % hues.length];
      ctx.beginPath();
      ctx.roundRect(l.x, y, l.w, LAYER_H - 3, 4);
      ctx.fill();
    });
    if (stateRef.current === "playing") {
      const y = SH - 20 - (count + 1) * LAYER_H + offset;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(moving.current.x, y, moving.current.w, LAYER_H - 3, 4);
      ctx.fill();
    }
  }, []);

  const start = useCallback(() => {
    layers.current = [{ x: SW / 2 - 60, w: 120 }];
    moving.current = { x: 0, w: 120, dir: 1 };
    setScore(0);
    setState("playing");
  }, []);

  useEffect(() => {
    if (state !== "playing") return;
    const step = () => {
      if (stateRef.current !== "playing") return;
      const m = moving.current;
      m.x += m.dir * 2.6;
      if (m.x < 0 || m.x + m.w > SW) m.dir *= -1;
      draw();
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [state, draw]);

  useEffect(() => {
    draw();
  }, [draw, state]);

  function drop() {
    if (stateRef.current !== "playing") return;
    const top = layers.current[layers.current.length - 1];
    const m = moving.current;
    const left = Math.max(m.x, top.x);
    const right = Math.min(m.x + m.w, top.x + top.w);
    const overlap = right - left;
    if (overlap <= 6) {
      setState("over");
      setBest((b) => Math.max(b, layers.current.length - 1));
      return;
    }
    layers.current.push({ x: left, w: overlap });
    moving.current = { x: 0, w: overlap, dir: 1 };
    setScore(layers.current.length - 1);
  }

  return (
    <div className="w-full max-w-[320px] flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-3">
        <p className="text-sm font-bold">🗼 Stack Tower</p>
        <p className="text-xs text-ink/50 tabular-nums">Height {score} · Best {best}</p>
      </div>
      <div
        className="relative rounded-2xl overflow-hidden touch-none"
        onPointerDown={(e) => {
          e.preventDefault();
          drop();
        }}
      >
        <canvas ref={canvasRef} width={SW} height={SH} className="block max-w-full" />
        {state !== "playing" && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
            {state === "over" && (
              <p className="text-white font-extrabold text-xl display">{score} layers high!</p>
            )}
            <button
              onClick={start}
              className="bg-accent text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              {state === "over" ? "Play again" : "Start"}
            </button>
            <p className="text-white/60 text-xs">Tap to drop the block, line it up!</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ Tic-Tac-Toe ============ */

function winnerOf(b: (null | "X" | "O")[]): "X" | "O" | "draw" | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b2, c] of lines) {
    if (b[a] && b[a] === b[b2] && b[a] === b[c]) return b[a];
  }
  return b.every(Boolean) ? "draw" : null;
}

function TicTacToe() {
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null));
  const [tally, setTally] = useState({ you: 0, cpu: 0, draw: 0 });
  const [thinking, setThinking] = useState(false);
  const result = winnerOf(board);

  function cpuMove(b: (null | "X" | "O")[]): number {
    const empty = b.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
    // win, then block
    for (const mark of ["O", "X"] as const) {
      for (const i of empty) {
        const copy = [...b];
        copy[i] = mark;
        if (winnerOf(copy) === mark) return i;
      }
    }
    if (b[4] === null) return 4;
    const corners = [0, 2, 6, 8].filter((i) => b[i] === null);
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
    return empty[Math.floor(Math.random() * empty.length)];
  }

  function play(i: number) {
    if (board[i] || result || thinking) return;
    const next = [...board];
    next[i] = "X";
    setBoard(next);
    const afterYou = winnerOf(next);
    if (afterYou) {
      settle(afterYou);
      return;
    }
    setThinking(true);
    setTimeout(() => {
      const withCpu = [...next];
      withCpu[cpuMove(withCpu)] = "O";
      setBoard(withCpu);
      setThinking(false);
      const afterCpu = winnerOf(withCpu);
      if (afterCpu) settle(afterCpu);
    }, 350);
  }

  function settle(r: "X" | "O" | "draw") {
    setTally((t) => ({
      you: t.you + (r === "X" ? 1 : 0),
      cpu: t.cpu + (r === "O" ? 1 : 0),
      draw: t.draw + (r === "draw" ? 1 : 0),
    }));
  }

  function reset() {
    setBoard(Array(9).fill(null));
  }

  return (
    <div className="w-full max-w-[320px] flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-3">
        <p className="text-sm font-bold">⭕ Tic Tac Toe</p>
        <p className="text-xs text-ink/50 tabular-nums">You {tally.you} · CPU {tally.cpu} · Draw {tally.draw}</p>
      </div>
      <div className="relative grid grid-cols-3 gap-2 w-full">
        {board.map((v, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            aria-label={v ?? "Empty cell"}
            className={`aspect-square rounded-2xl text-3xl font-extrabold display flex items-center justify-center transition-colors ${
              v ? "bg-ink/5" : "bg-ink/5 hover:bg-accent/15"
            } ${v === "X" ? "text-accent-ink" : "text-ink/70"}`}
          >
            {v}
          </button>
        ))}
        {result && (
          <div className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
            <p className="text-white font-extrabold text-xl display">
              {result === "X" ? "You win! 🎉" : result === "O" ? "CPU wins!" : "Draw!"}
            </p>
            <button
              onClick={reset}
              className="bg-accent text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              Play again
            </button>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-ink/40 h-4">{thinking ? "CPU thinking…" : "You are X"}</p>
    </div>
  );
}

/* ============ Color Match (Stroop) ============ */

const COLOR_WORDS = [
  { name: "BLUE", cls: "text-sky-500", key: "blue" },
  { name: "GREEN", cls: "text-emerald-500", key: "green" },
  { name: "ORANGE", cls: "text-amber-500", key: "orange" },
  { name: "PINK", cls: "text-rose-500", key: "pink" },
];

const MATCH_TIME = 30;

function ColorMatch() {
  const [state, setState] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MATCH_TIME);
  const [word, setWord] = useState(0);
  const [ink, setInk] = useState(0);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const roll = useCallback(() => {
    const w = Math.floor(Math.random() * COLOR_WORDS.length);
    // 50/50 match vs mismatch
    const i =
      Math.random() < 0.5 ? w : (w + 1 + Math.floor(Math.random() * 3)) % COLOR_WORDS.length;
    setWord(w);
    setInk(i);
  }, []);

  const start = useCallback(() => {
    setScore(0);
    setTimeLeft(MATCH_TIME);
    roll();
    setState("playing");
  }, [roll]);

  useEffect(() => {
    if (state !== "playing") return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          setState("over");
          setBest((b) => Math.max(b, scoreRef.current));
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [state]);

  function answer(saysMatch: boolean) {
    if (state !== "playing") return;
    const isMatch = word === ink;
    setScore((s) => Math.max(0, s + (saysMatch === isMatch ? 1 : -1)));
    roll();
  }

  return (
    <div className="w-full max-w-[320px] flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-3">
        <p className="text-sm font-bold">🎨 Color Match</p>
        <p className="text-xs text-ink/50 tabular-nums">
          {state === "playing" ? `${timeLeft}s · ` : ""}Score {score} · Best {best}
        </p>
      </div>
      <div className="relative w-full rounded-2xl bg-inverse p-6 flex flex-col items-center gap-6">
        <p className="text-white/50 text-xs">Does the word match its color?</p>
        <p className={`text-5xl font-extrabold display ${COLOR_WORDS[ink].cls}`}>
          {COLOR_WORDS[word].name}
        </p>
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={() => answer(true)}
            className="rounded-xl bg-emerald-500 text-white font-bold py-3 hover:brightness-110 transition select-none"
          >
            Match
          </button>
          <button
            onClick={() => answer(false)}
            className="rounded-xl bg-rose-500 text-white font-bold py-3 hover:brightness-110 transition select-none"
          >
            No match
          </button>
        </div>
        {state !== "playing" && (
          <div className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
            {state === "over" && (
              <p className="text-white font-extrabold text-xl display">{score} correct!</p>
            )}
            <button
              onClick={start}
              className="bg-accent text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              {state === "over" ? "Play again" : "Start"}
            </button>
            <p className="text-white/60 text-xs">Word vs color · wrong answers cost a point · {MATCH_TIME}s</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ Section ============ */

export const GAME_IDS = [
  "snake", "memory", "bubble", "breakout", "flappy",
  "stack", "reaction", "simon", "ttt", "stroop",
] as const;

const GAME_REGISTRY: Record<string, React.ReactNode> = {
  snake: <SnakeGame />,
  memory: <MemoryGame />,
  bubble: <BubblePop />,
  breakout: <Breakout />,
  flappy: <FlappyGame />,
  stack: <StackGame />,
  reaction: <ReactionGame />,
  simon: <SimonGame />,
  ttt: <TicTacToe />,
  stroop: <ColorMatch />,
};

export function MiniGamesGrid({ games }: { games?: string[] }) {
  const order = (games && games.length ? games : [...GAME_IDS]).filter((id) => GAME_REGISTRY[id]);
  return (
    <div className="mt-12 grid md:grid-cols-2 auto-rows-fr gap-6 max-w-4xl mx-auto">
      {order.map((id, i) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: (i % 2) * 0.12, type: "spring", stiffness: 90, damping: 17 }}
          className="h-full rounded-3xl bg-surface border border-ink/[0.06] shadow-[0_2px_20px_rgba(0,0,0,0.05)] p-6 md:p-8 flex items-center justify-center"
        >
          {GAME_REGISTRY[id]}
        </motion.div>
      ))}
    </div>
  );
}

export default function MiniGames({ content }: { content: MiniGamesContent }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 text-center">
        <h2 className="display font-extrabold text-[clamp(2rem,4.5vw,3.4rem)]">
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "115%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, ease: EASE }}
            >
              {content.title}
            </motion.span>
          </span>
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
          className="mt-4 mx-auto max-w-xl text-sm text-ink/50"
        >
          {content.body}
        </motion.p>

        <div className="mt-12 grid md:grid-cols-2 auto-rows-fr gap-6 max-w-4xl mx-auto">
          {[
        <SnakeGame key="snake" />,
        <MemoryGame key="memory" />,
        <BubblePop key="bubble" />,
        <Breakout key="breakout" />,
        <FlappyGame key="flappy" />,
        <StackGame key="stack" />,
        <ReactionGame key="reaction" />,
        <SimonGame key="simon" />,
        <TicTacToe key="ttt" />,
        <ColorMatch key="stroop" />,
      ].map((game, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, type: "spring", stiffness: 90, damping: 17 }}
              className="h-full rounded-3xl bg-surface border border-ink/[0.06] shadow-[0_2px_20px_rgba(0,0,0,0.05)] p-6 md:p-8 flex items-center justify-center"
            >
              {game}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
