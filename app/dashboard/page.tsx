"use client";

/* Leorus admin dashboard, edits content/site.json via /api/admin/content */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Path = (string | number)[];

function setDeep(obj: unknown, path: Path, value: unknown): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const clone: Record<string | number, unknown> = Array.isArray(obj)
    ? ([...obj] as unknown as Record<string | number, unknown>)
    : { ...(obj as Record<string | number, unknown>) };
  clone[head] = setDeep(
    (obj as Record<string | number, unknown>)?.[head],
    rest,
    value
  );
  return clone;
}

function getDeep(obj: unknown, path: Path): unknown {
  return path.reduce<unknown>(
    (o, k) => (o as Record<string | number, unknown>)?.[k],
    obj
  );
}

const GRADIENTS = [
  "from-sky-400 to-blue-700",
  "from-teal-300 to-emerald-600",
  "from-indigo-400 to-violet-700",
  "from-rose-400 to-red-600",
  "from-fuchsia-400 to-purple-800",
  "from-amber-300 to-orange-500",
  "from-lime-300 to-green-600",
  "from-amber-400 to-orange-600",
  "from-slate-400 to-slate-800",
  "from-cyan-400 to-blue-600",
  "from-sky-400 to-blue-600",
  "from-violet-500 to-indigo-700",
  "from-emerald-400 to-teal-700",
];

const GAME_LABELS: Record<string, string> = {
  snake: "🐍 Snake",
  memory: "🃏 Memory Match",
  bubble: "🫧 Bubble Pop",
  breakout: "🧱 Breakout",
  flappy: "🐡 Flappy Bubble",
  stack: "🗼 Stack Tower",
  reaction: "⚡ Reaction Time",
  simon: "🔁 Simon Says",
  ttt: "⭕ Tic-Tac-Toe",
  stroop: "🎨 Color Match",
};

const TABS = [
  "Hero",
  "Games",
  "Web",
  "Services",
  "Partner",
  "Careers",
  "Studios",
  "Reviews",
  "Team",
  "Gallery",
  "Arcade",
  "Pages",
  "Site",
  "Media",
  "JSON",
] as const;

const TAB_INFO: Record<string, { blurb: string; link?: string }> = {
  Hero: { blurb: "The very top of the homepage, big headline, downloads circle, mascots and the four number cards.", link: "/" },
  Games: { blurb: "The dark box on the homepage and your full games list. Each game's picture, text and store links live here.", link: "/" },
  Partner: { blurb: "The \"Partner with…\" area on the homepage, heading card, bird picture and the three offer cards.", link: "/" },
  Careers: { blurb: "The blue careers banner near the bottom of the About page.", link: "/about" },
  Studios: { blurb: "Partner studios on the homepage. One studio = one big wide banner; several = a card grid.", link: "/" },
  Reviews: { blurb: "Client quotes shown with stars and arrows on the homepage. Add as many as you like, pages are created automatically.", link: "/" },
  Team: { blurb: "The people on the About page, name, role and photo for each person.", link: "/about" },
  Gallery: { blurb: "The photo slideshow on the About page. Photos change automatically every few seconds.", link: "/about" },
  Arcade: { blurb: "The playable mini games page, its title, intro, and which games appear in what order.", link: "/arcade" },
  Pages: { blurb: "Text for the About, Games and Contact pages, including the contact form.", link: "/about" },
  Site: { blurb: "Site-wide settings, brand name, menu names, main color, browser tab title and the footer.", link: "/" },
  Media: { blurb: "Every image on the site. Upload new ones, copy a path to use it anywhere, delete what's unused." },
  JSON: { blurb: "Advanced: the raw data behind the whole site. Only touch this if you know JSON." },
};

/* ---------- context so field components stay stable across renders ---------- */

type Ctx = {
  content: any;
  up: (path: Path, value: unknown) => void;
  upload: (file: File) => Promise<string | null>;
};

const DashCtx = createContext<Ctx>(null!);

/* ---------- field components (module scope: inputs keep focus) ---------- */

function Txt({ label, path, wide }: { label: string; path: Path; wide?: boolean }) {
  const { content, up } = useContext(DashCtx);
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-black/50">{label}</span>
      <input
        type="text"
        value={String(getDeep(content, path) ?? "")}
        onChange={(e) => up(path, e.target.value)}
        className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}

function Num({ label, path }: { label: string; path: Path }) {
  const { content, up } = useContext(DashCtx);
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-black/50">{label}</span>
      <input
        type="number"
        value={Number(getDeep(content, path) ?? 0)}
        onChange={(e) => up(path, Number(e.target.value))}
        className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}

function Area({ label, path, rows = 3 }: { label: string; path: Path; rows?: number }) {
  const { content, up } = useContext(DashCtx);
  return (
    <label className="block sm:col-span-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-black/50">{label}</span>
      <textarea
        rows={rows}
        value={String(getDeep(content, path) ?? "")}
        onChange={(e) => up(path, e.target.value)}
        className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-accent resize-y"
      />
    </label>
  );
}

/* Comma-separated list stored as a real array */
function ListField({ label, path, rows = 2 }: { label: string; path: Path; rows?: number }) {
  const { content, up } = useContext(DashCtx);
  const raw = getDeep(content, path);
  const [text, setText] = useState(
    Array.isArray(raw) ? raw.join(", ") : String(raw ?? "")
  );
  return (
    <label className="block sm:col-span-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-black/50">
        {label} <span className="normal-case text-black/35">(comma separated)</span>
      </span>
      <textarea
        rows={rows}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          up(
            path,
            e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
          );
        }}
        className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-accent resize-y"
      />
    </label>
  );
}

function Img({ label, path }: { label: string; path: Path }) {
  const { content, up, upload } = useContext(DashCtx);
  const val = String(getDeep(content, path) ?? "");
  const [busy, setBusy] = useState(false);
  return (
    <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
      <div className="w-14 h-14 rounded-lg border border-black/10 bg-white overflow-hidden shrink-0">
        {val && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={val} alt="" className="w-full h-full object-cover" />
        )}
      </div>
      <label className="block grow">
        <span className="text-xs font-semibold uppercase tracking-wide text-black/50">{label}</span>
        <input
          type="text"
          value={val}
          onChange={(e) => up(path, e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </label>
      <label className={`shrink-0 cursor-pointer rounded-lg text-white text-xs font-bold px-3 py-2 transition-colors ${busy ? "bg-black/40" : "bg-black hover:bg-accent"}`}>
        {busy ? "Uploading..." : "Upload"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={busy}
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setBusy(true);
            const p = await upload(f);
            setBusy(false);
            if (p) up(path, p);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}

function Gradient({ label, path }: { label: string; path: Path }) {
  const { content, up } = useContext(DashCtx);
  const val = String(getDeep(content, path) ?? "");
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-black/50">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <span className={`w-8 h-8 rounded-md bg-gradient-to-br ${val} border border-black/10 shrink-0`} />
        <select
          value={val}
          onChange={(e) => up(path, e.target.value)}
          className="w-full rounded-lg border border-black/15 bg-white px-2 py-2 text-sm outline-none focus:border-accent"
        >
          {!GRADIENTS.includes(val) && <option value={val}>{val}</option>}
          {GRADIENTS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
    </label>
  );
}

function Toggle({ label, path, hint }: { label: string; path: Path; hint?: string }) {
  const { content, up } = useContext(DashCtx);
  const val = Boolean(getDeep(content, path));
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-black/50">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={() => up(path, !val)}
          className={`w-11 h-6 rounded-full transition-colors relative ${val ? "bg-accent" : "bg-black/15"}`}
          aria-pressed={val}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${val ? "left-[22px]" : "left-0.5"}`} />
        </button>
        <span className="text-sm text-black/60">{val ? "Yes" : "No"}</span>
      </div>
      {hint && <span className="block mt-1 text-[11px] text-black/40">{hint}</span>}
    </label>
  );
}

function ColorField({ label, path }: { label: string; path: Path }) {
  const { content, up } = useContext(DashCtx);
  const val = String(getDeep(content, path) ?? "#0099ff");
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-black/50">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(val) ? val : "#0099ff"}
          onChange={(e) => up(path, e.target.value)}
          className="w-10 h-10 rounded-lg border border-black/15 bg-white cursor-pointer p-1"
        />
        <input
          type="text"
          value={val}
          onChange={(e) => up(path, e.target.value)}
          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-accent font-mono"
        />
      </div>
    </label>
  );
}

function ListControls({ path, index, length }: { path: Path; index: number; length: number }) {
  const { content, up } = useContext(DashCtx);
  const list = getDeep(content, path) as unknown[];
  return (
    <div className="flex gap-1">
      <button
        title="Move up"
        disabled={index === 0}
        onClick={() => {
          const next = [...list];
          [next[index - 1], next[index]] = [next[index], next[index - 1]];
          up(path, next);
        }}
        className="w-7 h-7 rounded-md border border-black/15 text-xs disabled:opacity-30 hover:bg-black/5"
      >↑</button>
      <button
        title="Move down"
        disabled={index === length - 1}
        onClick={() => {
          const next = [...list];
          [next[index + 1], next[index]] = [next[index], next[index + 1]];
          up(path, next);
        }}
        className="w-7 h-7 rounded-md border border-black/15 text-xs disabled:opacity-30 hover:bg-black/5"
      >↓</button>
      <button
        title="Delete"
        onClick={() => {
          if (window.confirm("Delete this item?")) {
            up(path, list.filter((_, i) => i !== index));
          }
        }}
        className="w-7 h-7 rounded-md border border-red-200 text-red-500 text-xs hover:bg-red-50"
      >✕</button>
    </div>
  );
}

function AddButton({ path, blank, label }: { path: Path; blank: unknown; label: string }) {
  const { content, up } = useContext(DashCtx);
  return (
    <button
      onClick={() => up(path, [...((getDeep(content, path) as unknown[]) ?? []), blank])}
      className="rounded-lg border-2 border-dashed border-black/20 px-4 py-2.5 text-sm font-semibold text-black/50 hover:border-accent hover:text-accent transition-colors"
    >
      + {label}
    </button>
  );
}

function EnableButton({ path, blank, label }: { path: Path; blank: unknown; label: string }) {
  const { up } = useContext(DashCtx);
  return (
    <button
      onClick={() => up(path, blank)}
      className="rounded-lg border-2 border-dashed border-black/20 px-4 py-2.5 text-sm font-semibold text-black/50 hover:border-accent hover:text-accent transition-colors"
    >
      + {label}
    </button>
  );
}

function Card({ children, title, controls }: { children: React.ReactNode; title?: string; controls?: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white border border-black/10 p-4">
      {(title || controls) && (
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold">{title}</p>
          {controls}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}


/* ---------- media library ---------- */

function MediaLibrary() {
  const { upload } = useContext(DashCtx);
  const [images, setImages] = useState<{ path: string; size: number; inUse: boolean }[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");

  const refresh = useCallback(() => {
    fetch("/api/admin/images")
      .then((r) => r.json())
      .then((d) => setImages(d.images ?? []));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function remove(p: string) {
    if (!window.confirm(`Delete ${p}? This cannot be undone.`)) return;
    const res = await fetch("/api/admin/images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: p }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      window.alert(d.error ?? "Delete failed");
    }
    refresh();
  }

  async function copyPath(p: string) {
    await navigator.clipboard.writeText(p).catch(() => null);
    setCopied(p);
    setTimeout(() => setCopied(""), 1500);
  }

  if (!images) return <p className="text-sm text-black/40">Loading images...</p>;

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-black/50">
          {images.length} images · click a path to copy it, then paste into any image field
        </p>
        <label className={`cursor-pointer rounded-lg text-white text-xs font-bold px-4 py-2.5 transition-colors ${busy ? "bg-black/40" : "bg-black hover:bg-accent"}`}>
          {busy ? "Uploading..." : "+ Upload image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              await upload(f);
              setBusy(false);
              e.target.value = "";
              refresh();
            }}
          />
        </label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img) => (
          <div key={img.path} className="rounded-xl bg-white border border-black/10 overflow-hidden">
            <div className="aspect-square bg-[#f0f0f0]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.path} alt="" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="p-2.5">
              <button
                onClick={() => copyPath(img.path)}
                title="Copy path"
                className="w-full text-left text-[11px] font-mono text-black/60 hover:text-accent truncate"
              >
                {copied === img.path ? "Copied ✓" : img.path}
              </button>
              <div className="mt-1.5 flex items-center justify-between">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${img.inUse ? "bg-emerald-50 text-emerald-600" : "bg-black/5 text-black/40"}`}>
                  {img.inUse ? "In use" : "Unused"}
                </span>
                <span className="text-[10px] text-black/35">{Math.round(img.size / 1024)}KB</span>
                {!img.inUse && (
                  <button
                    onClick={() => remove(img.path)}
                    className="text-[10px] font-semibold text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- page ---------- */


export default function DashboardPage() {
  const [content, setContent] = useState<any>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Hero");
  const [toast, setToast] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rawJson, setRawJson] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyRef = useRef(false);
  const contentRef = useRef<any>(null);
  dirtyRef.current = dirty;
  contentRef.current = content;

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((c) => {
        setContent(c);
        setRawJson(JSON.stringify(c, null, 2));
      });
  }, []);

  /* Warn before leaving with unsaved changes */
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2500);
  }, []);

  const up = useCallback((path: Path, value: unknown) => {
    setContent((c: unknown) => setDeep(c, path, value));
    setDirty(true);
  }, []);

  const save = useCallback(async (data?: unknown) => {
    setSaving(true);
    const body = data ?? contentRef.current;
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) {
      setDirty(false);
      setRawJson(JSON.stringify(body, null, 2));
      showToast("Saved ✓. Refresh the site to see changes");
    } else {
      const d = await res.json().catch(() => ({}));
      showToast(`Save failed: ${d.error ?? res.status}`);
    }
  }, [showToast]);

  /* Cmd/Ctrl+S saves */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (dirtyRef.current) save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [save]);

  async function logout() {
    if (dirty && !window.confirm("You have unsaved changes. Log out anyway?")) return;
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/dashboard/login";
  }

  const upload = useCallback(async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      showToast(`Upload failed: ${d.error ?? res.status}`);
      return null;
    }
    const d = await res.json();
    return d.path;
  }, [showToast]);

  if (!content) {
    return (
      <main className="min-h-screen flex items-center justify-center text-black/40">
        Loading content...
      </main>
    );
  }

  return (
    <DashCtx.Provider value={{ content, up, upload }}>
      <main className="mx-auto max-w-5xl px-4 py-6 pb-32">
        {/* Top bar */}
        <div className="sticky top-4 z-40 rounded-2xl bg-[#2f2f2f] text-white px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2 shadow-lg">
          <p className="font-extrabold">
            LEORUS<span className="text-accent">.</span>{" "}
            <span className="font-medium text-white/50">Dashboard</span>
          </p>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-sm text-white/60 hover:text-white transition-colors">
              View site ↗
            </a>
            <button
              onClick={() => save()}
              disabled={saving || !dirty}
              title="Cmd/Ctrl+S"
              className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-colors ${
                dirty ? "bg-accent text-white hover:bg-white hover:text-black" : "bg-white/10 text-white/40"
              }`}
            >
              {saving ? "Saving..." : dirty ? "Save changes" : "Saved"}
            </button>
            <button onClick={logout} className="text-sm text-white/50 hover:text-white transition-colors">
              Log out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                tab === t ? "bg-black text-white" : "bg-white border border-black/10 text-black/60 hover:border-black/30"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-accent/5 border border-accent/15 px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-black/60">{TAB_INFO[tab]?.blurb}</p>
          {TAB_INFO[tab]?.link && (
            <a
              href={TAB_INFO[tab].link}
              target="_blank"
              className="shrink-0 text-xs font-bold text-accent hover:underline"
            >
              See it on the site ↗
            </a>
          )}
        </div>

        <div className="mt-5 space-y-4">
          {tab === "Hero" && (
            <>
              <Card title="Headline">
                <Txt label="Line 1" path={["hero", "line1"]} />
                <Txt label="Line 2" path={["hero", "line2"]} />
              </Card>
              <Card title="Downloads badge">
                <Txt label="Number (e.g. 2.4)" path={["hero", "badgeNumber"]} />
                <Txt label="Word (e.g. Billion)" path={["hero", "badgeWord"]} />
                <Txt label="Label (e.g. Downloads)" path={["hero", "badgeLabel"]} />
                <div />
                <Img label="Badge mascot" path={["hero", "mascotBadge"]} />
                <Img label="Left mascot" path={["hero", "mascotLeft"]} />
                <Img label="Right mascot" path={["hero", "mascotRight"]} />
              </Card>
              {(content.hero.stats as unknown[]).map((_, i) => (
                <Card
                  key={i}
                  title={`Stat ${i + 1}`}
                  controls={<ListControls path={["hero", "stats"]} index={i} length={content.hero.stats.length} />}
                >
                  <Num label="Value" path={["hero", "stats", i, "value"]} />
                  <Txt label="Suffix (+, M+...)" path={["hero", "stats", i, "suffix"]} />
                  <Txt label="Label" path={["hero", "stats", i, "label"]} wide />
                </Card>
              ))}
              <AddButton path={["hero", "stats"]} blank={{ value: 0, suffix: "+", label: "New stat" }} label="Add stat" />
            </>
          )}

          {tab === "Games" && (
            <>
              <Card title="Homepage section text">
                <Txt label="Title line 1" path={["gamesSection", "titleLines", 0]} />
                <Txt label="Title line 2 (|word| = blue)" path={["gamesSection", "titleLines", 1]} />
                <Txt label="Title line 3" path={["gamesSection", "titleLines", 2]} />
                <div />
                <Area label="Description" path={["gamesSection", "body"]} />
                <ListField label="Category chips" path={["gamesSection", "chips"]} />
              </Card>
              {(content.games as unknown[]).map((_, i) => (
                <Card
                  key={i}
                  title={`Game ${i + 1}: ${content.games[i].title}`}
                  controls={<ListControls path={["games"]} index={i} length={content.games.length} />}
                >
                  <Txt label="Title" path={["games", i, "title"]} />
                  <Txt label="Genre (comma for multiple)" path={["games", i, "genre"]} />
                  <Txt label="Downloads (e.g. 50M+)" path={["games", i, "downloads"]} />
                  <Gradient label="Fallback gradient" path={["games", i, "gradient"]} />
                  <Area label="Description" path={["games", i, "description"]} />
                  <Img label="Icon / art (cards & grids)" path={["games", i, "icon"]} />
                  <Img label="Phone screen (image or GIF, empty = use icon)" path={["games", i, "screen"]} />
                  <Txt label="Android link (empty = hide button)" path={["games", i, "playUrl"]} />
                  <Txt label="iOS link (empty = hide button)" path={["games", i, "appUrl"]} />
                </Card>
              ))}
              <AddButton
                path={["games"]}
                blank={{ title: "New Game", genre: "Action", icon: "", screen: "", gradient: GRADIENTS[0], downloads: "1M+", description: "", playUrl: "", appUrl: "" }}
                label="Add game"
              />
            </>
          )}

          {tab === "Web" && content.webGames && (
            <>
              <Card title="Browser games section text">
                <Txt label="Title (|word| = blue)" path={["webGames", "title"]} wide />
                <Area label="Description" path={["webGames", "body"]} />
              </Card>
              {(content.webGames.items as unknown[]).map((_, i) => (
                <Card
                  key={i}
                  title={`Web game ${i + 1}: ${content.webGames.items[i].title}`}
                  controls={
                    <ListControls
                      path={["webGames", "items"]}
                      index={i}
                      length={content.webGames.items.length}
                    />
                  }
                >
                  <Txt label="Title" path={["webGames", "items", i, "title"]} />
                  <Txt label="Genre" path={["webGames", "items", i, "genre"]} />
                  <Img label="Cover art (16:9)" path={["webGames", "items", i, "cover"]} />
                  <Txt label="Play link" path={["webGames", "items", i, "url"]} />
                </Card>
              ))}
              <AddButton
                path={["webGames", "items"]}
                blank={{ title: "New Web Game", genre: "Puzzle", cover: "", url: "" }}
                label="Add web game"
              />
            </>
          )}

          {tab === "Services" && content.services && (
            <>
              <Card title="Page heading">
                <Txt label="Title (|word| = blue)" path={["services", "title"]} wide />
                <Area label="Intro" path={["services", "intro"]} />
              </Card>
              {(content.services.pillars as unknown[]).map((_, i) => (
                <Card
                  key={`pillar-${i}`}
                  title={`Service ${i + 1}: ${content.services.pillars[i].name}`}
                  controls={
                    <ListControls
                      path={["services", "pillars"]}
                      index={i}
                      length={content.services.pillars.length}
                    />
                  }
                >
                  <Txt label="Name" path={["services", "pillars", i, "name"]} />
                  <div />
                  <Area label="Summary" path={["services", "pillars", i, "body"]} />
                  <ListField label="Bullet points" path={["services", "pillars", i, "points"]} />
                </Card>
              ))}
              <AddButton
                path={["services", "pillars"]}
                blank={{ name: "New service", body: "", points: "" }}
                label="Add service"
              />

              <Card title="Technology stack">
                <Txt label="Section title (|word| = blue)" path={["services", "stackTitle"]} wide />
              </Card>
              {(content.services.stack as unknown[]).map((_, i) => (
                <Card
                  key={`stack-${i}`}
                  title={`Stack group ${i + 1}: ${content.services.stack[i].group}`}
                  controls={
                    <ListControls
                      path={["services", "stack"]}
                      index={i}
                      length={content.services.stack.length}
                    />
                  }
                >
                  <Txt label="Group name" path={["services", "stack", i, "group"]} />
                  <ListField label="Tools" path={["services", "stack", i, "items"]} />
                </Card>
              ))}
              <AddButton
                path={["services", "stack"]}
                blank={{ group: "New group", items: "" }}
                label="Add stack group"
              />

              <Card title="Why studios stay">
                <Txt label="Section title (|word| = blue)" path={["services", "whyTitle"]} wide />
              </Card>
              {(content.services.why as unknown[]).map((_, i) => (
                <Card
                  key={`why-${i}`}
                  title={`Reason ${i + 1}: ${content.services.why[i].name}`}
                  controls={
                    <ListControls
                      path={["services", "why"]}
                      index={i}
                      length={content.services.why.length}
                    />
                  }
                >
                  <Txt label="Heading" path={["services", "why", i, "name"]} />
                  <div />
                  <Area label="Text" path={["services", "why", i, "body"]} />
                </Card>
              ))}
              <AddButton
                path={["services", "why"]}
                blank={{ name: "New reason", body: "" }}
                label="Add reason"
              />

              <Card title="Closing call to action">
                <Txt label="Title" path={["services", "ctaTitle"]} wide />
                <Area label="Text" path={["services", "ctaBody"]} />
                <Txt label="Button label" path={["services", "ctaLabel"]} />
              </Card>
            </>
          )}

          {tab === "Partner" && (
            <>
              <Card title="Heading card">
                <Area label="Title (use line breaks)" path={["partner", "title"]} rows={2} />
                <Area label="Body" path={["partner", "body"]} />
                <Img label="Mascot image" path={["partner", "mascot"]} />
              </Card>
              {(content.partner.cards as unknown[]).map((_, i) => (
                <Card
                  key={i}
                  title={`Card ${i + 1}`}
                  controls={<ListControls path={["partner", "cards"]} index={i} length={content.partner.cards.length} />}
                >
                  <Txt label="Icon (emoji)" path={["partner", "cards", i, "icon"]} />
                  <Txt label="Title" path={["partner", "cards", i, "title"]} />
                  <Area label="Body" path={["partner", "cards", i, "body"]} />
                </Card>
              ))}
              <AddButton path={["partner", "cards"]} blank={{ icon: "✨", title: "New card", body: "" }} label="Add card" />
            </>
          )}

          {tab === "Careers" && (
            <Card title="Careers banner (About page)">
              <Txt label="Title" path={["growth", "careersTitle"]} wide />
              <Area label="Body" path={["growth", "careersBody"]} />
              <Txt label="Button text" path={["growth", "careersCta"]} />
              <Txt label="Button link" path={["growth", "careersLink"]} />
            </Card>
          )}

          {tab === "Studios" && (
            <>
              <Card title="Section text (homepage-style cards)">
                <Txt label="Title" path={["studios", "title"]} wide />
                <Area label="Body" path={["studios", "body"]} />
              </Card>
              {(content.studios.items as unknown[]).map((_, i) => (
                <Card
                  key={i}
                  title={`Studio ${i + 1}`}
                  controls={<ListControls path={["studios", "items"]} index={i} length={content.studios.items.length} />}
                >
                  <Txt label="Name" path={["studios", "items", i, "name"]} />
                  <Txt label="Focus" path={["studios", "items", i, "focus"]} />
                  <Img label="Wide image (empty = gradient)" path={["studios", "items", i, "image"]} />
                  <Toggle
                    label="Image is a logo"
                    path={["studios", "items", i, "logo"]}
                    hint="Shows it whole on white instead of cropping it to fill"
                  />
                  <Gradient label="Fallback gradient" path={["studios", "items", i, "gradient"]} />
                </Card>
              ))}
              <AddButton
                path={["studios", "items"]}
                blank={{ name: "New Studio", focus: "", gradient: GRADIENTS[0], image: "" }}
                label="Add studio"
              />
            </>
          )}

          {tab === "Reviews" && !content.reviews && (
            <EnableButton
              path={["reviews"]}
              blank={{ title: "Loved by Partners & Players", body: "", items: [] }}
              label="Enable reviews section"
            />
          )}
          {tab === "Reviews" && content.reviews && (
            <>
              <Card title="Section text">
                <Txt label="Title" path={["reviews", "title"]} wide />
                <Area label="Body" path={["reviews", "body"]} />
                <Num label="Reviews per page (1-6)" path={["reviews", "perPage"]} />
              </Card>
              {(content.reviews.items as unknown[]).map((_, i) => (
                <Card
                  key={i}
                  title={`Review ${i + 1}: ${content.reviews.items[i].name}`}
                  controls={<ListControls path={["reviews", "items"]} index={i} length={content.reviews.items.length} />}
                >
                  <Area label="Quote" path={["reviews", "items", i, "quote"]} />
                  <Txt label="Name" path={["reviews", "items", i, "name"]} />
                  <Txt label="Role / company" path={["reviews", "items", i, "role"]} />
                  <Num label="Rating (0-5)" path={["reviews", "items", i, "rating"]} />
                </Card>
              ))}
              <AddButton
                path={["reviews", "items"]}
                blank={{ quote: "", name: "New Client", role: "", rating: 5 }}
                label="Add review"
              />
            </>
          )}

          {tab === "Team" && !content.team && (
            <EnableButton
              path={["team"]}
              blank={{ title: "Meet the Team", body: "", members: [] }}
              label="Enable team section"
            />
          )}
          {tab === "Team" && content.team && (
            <>
              <Card title="Section text">
                <Txt label="Title" path={["team", "title"]} wide />
                <Area label="Body" path={["team", "body"]} />
              </Card>
              {(content.team.members as unknown[]).map((_, i) => (
                <Card
                  key={i}
                  title={`Member ${i + 1}: ${content.team.members[i].name || content.team.members[i].role}`}
                  controls={<ListControls path={["team", "members"]} index={i} length={content.team.members.length} />}
                >
                  <Txt label="Name" path={["team", "members", i, "name"]} />
                  <Txt label="Role" path={["team", "members", i, "role"]} />
                  <Img label="Photo" path={["team", "members", i, "photo"]} />
                </Card>
              ))}
              <AddButton
                path={["team", "members"]}
                blank={{ name: "New Member", role: "", photo: "" }}
                label="Add member"
              />
            </>
          )}

          {tab === "Gallery" && !content.gallery && (
            <EnableButton
              path={["gallery"]}
              blank={{ title: "Life at Leorus", body: "", interval: 4, images: [] }}
              label="Enable gallery section"
            />
          )}
          {tab === "Gallery" && content.gallery && (
            <>
              <Card title="Section text">
                <Txt label="Title" path={["gallery", "title"]} wide />
                <Area label="Body" path={["gallery", "body"]} />
                <Num label="Seconds per photo" path={["gallery", "interval"]} />
              </Card>
              {(content.gallery.images as unknown[]).map((_, i) => (
                <Card
                  key={i}
                  title={`Photo ${i + 1}`}
                  controls={<ListControls path={["gallery", "images"]} index={i} length={content.gallery.images.length} />}
                >
                  <Img label="Image" path={["gallery", "images", i]} />
                </Card>
              ))}
              <AddButton path={["gallery", "images"]} blank={""} label="Add photo" />
            </>
          )}

          {tab === "Arcade" && (
            <>
              <Card title="Page text">
                <Txt label="Title (|word| = colored)" path={["minigames", "title"]} wide />
                <Area label="Intro" path={["minigames", "body"]} />
              </Card>
              <Card title="Games shown (top to bottom = left to right on the page)">
                <div className="sm:col-span-2 space-y-2">
                  {((content.minigames?.games as string[]) ?? []).map((id, i, list) => (
                    <div key={id} className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-3 py-2">
                      <p className="text-sm font-semibold">{GAME_LABELS[id] ?? id}</p>
                      <ListControls path={["minigames", "games"]} index={i} length={list.length} />
                    </div>
                  ))}
                  {Object.keys(GAME_LABELS).filter((id) => !((content.minigames?.games as string[]) ?? []).includes(id)).length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-black/40 mb-2">Hidden, click to add back</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(GAME_LABELS)
                          .filter((id) => !((content.minigames?.games as string[]) ?? []).includes(id))
                          .map((id) => (
                            <button
                              key={id}
                              onClick={() => up(["minigames", "games"], [...((content.minigames?.games as string[]) ?? []), id])}
                              className="rounded-full border border-dashed border-black/25 px-3 py-1.5 text-xs font-semibold text-black/50 hover:border-accent hover:text-accent transition-colors"
                            >
                              + {GAME_LABELS[id]}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </>
          )}

          {tab === "Pages" && (
            <>
              <Card title="About page">
                <Txt label="Title" path={["about", "title"]} />
                <Txt label="Title (muted part)" path={["about", "titleMuted"]} />
                <Area label="Intro" path={["about", "intro"]} />
              </Card>
              {(content.about.values as unknown[]).map((_, i) => (
                <Card
                  key={i}
                  title={`Value ${i + 1}`}
                  controls={<ListControls path={["about", "values"]} index={i} length={content.about.values.length} />}
                >
                  <Txt label="Title" path={["about", "values", i, "title"]} wide />
                  <Area label="Body" path={["about", "values", i, "body"]} />
                </Card>
              ))}
              <AddButton path={["about", "values"]} blank={{ title: "New value", body: "" }} label="Add value" />
              <Card title="Games page">
                <Txt label="Title (|word| = blue)" path={["gamesPage", "title"]} wide />
                <Area label="Intro" path={["gamesPage", "intro"]} />
                <Num label="Card ticker speed (seconds per loop)" path={["gamesPage", "tickerSeconds"]} />
              </Card>
              <Card title="Contact page">
                <Txt label="Title (|word| = blue)" path={["contact", "title"]} wide />
                <Area label="Intro" path={["contact", "intro"]} />
                <Txt label="Email" path={["contact", "email"]} />
                <Txt label="Hours line" path={["contact", "hours"]} />
              </Card>
              <Card title="Contact form">
                <ListField label="Topic options" path={["contact", "form", "topics"]} />
                <Txt label="Send button text" path={["contact", "form", "button"]} wide />
                <Txt label="Success title" path={["contact", "form", "successTitle"]} />
                <Txt label="Success message" path={["contact", "form", "successBody"]} />
              </Card>
            </>
          )}

          {tab === "Site" && (
            <>
              <Card title="Brand & SEO">
                <Img label="Logo (shown in navbar & footer)" path={["logo"]} />
                <Txt label="Brand name (navbar/footer)" path={["brand"]} />
                <ColorField label="Main site color" path={["accentColor"]} />
                <Txt label="Browser tab title" path={["seo", "title"]} wide />
                <Area label="Search description (meta)" path={["seo", "description"]} />
              </Card>
              <Card title="Menu names">
                <Txt label="Home link" path={["nav", "home"]} />
                <Txt label="About link" path={["nav", "about"]} />
                <Txt label="Services link" path={["nav", "services"]} />
                <Txt label="Games link" path={["nav", "games"]} />
                <Txt label="Arcade link" path={["nav", "arcade"]} />
                <Txt label="Contact link" path={["nav", "contact"]} />
              </Card>
              <Card title="Footer">
                <Txt label="Email" path={["footer", "email"]} />
                <Txt label="Copyright" path={["footer", "copyright"]} />
              </Card>
              {(content.footer.socials as unknown[]).map((_, i) => (
                <Card
                  key={i}
                  title={`Social ${i + 1}`}
                  controls={<ListControls path={["footer", "socials"]} index={i} length={content.footer.socials.length} />}
                >
                  <Txt label="Label" path={["footer", "socials", i, "label"]} />
                  <Txt label="URL" path={["footer", "socials", i, "url"]} />
                </Card>
              ))}
              <AddButton path={["footer", "socials"]} blank={{ label: "New", url: "#" }} label="Add social" />
            </>
          )}

          {tab === "Media" && <MediaLibrary />}

          {tab === "JSON" && (
            <div className="rounded-xl bg-white border border-black/10 p-4">
              <p className="text-sm font-bold">Raw content (full control)</p>
              <p className="text-xs text-black/40 mt-1">
                Everything the site renders lives here. Edit and press Apply, invalid JSON is rejected.
              </p>
              <textarea
                value={rawJson}
                onChange={(e) => setRawJson(e.target.value)}
                spellCheck={false}
                className="mt-3 w-full h-[32rem] rounded-lg border border-black/15 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs p-4 outline-none focus:border-accent resize-y"
              />
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(rawJson);
                    setContent(parsed);
                    save(parsed);
                  } catch (err) {
                    showToast(`Invalid JSON: ${(err as Error).message.slice(0, 80)}`);
                  }
                }}
                className="mt-3 rounded-lg bg-black text-white text-sm font-bold px-5 py-2.5 hover:bg-accent transition-colors"
              >
                Apply & Save
              </button>
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-black text-white text-sm font-semibold px-6 py-3 shadow-2xl">
            {toast}
          </div>
        )}
      </main>
    </DashCtx.Provider>
  );
}
