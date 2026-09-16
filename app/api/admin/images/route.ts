import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getContent } from "@/lib/content";

const ROOT = () => path.join(process.cwd(), "public", "img");

async function walk(dir: string, base: string): Promise<{ path: string; size: number }[]> {
  const out: { path: string; size: number }[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walk(full, base)));
    } else if (/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(e.name)) {
      const stat = await fs.stat(full);
      out.push({ path: "/" + path.relative(base, full).split(path.sep).join("/"), size: stat.size });
    }
  }
  return out;
}

export async function GET() {
  const base = path.join(process.cwd(), "public");
  const images = await walk(ROOT(), base);
  const contentStr = JSON.stringify(await getContent());
  const withUsage = images
    .map((img) => ({ ...img, inUse: contentStr.includes(img.path) }))
    .sort((a, b) => a.path.localeCompare(b.path));
  return NextResponse.json({ images: withUsage });
}

export async function DELETE(req: Request) {
  const { path: rel } = await req.json().catch(() => ({}));
  if (typeof rel !== "string" || !rel.startsWith("/img/")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  // resolve inside public/img only — no traversal
  const base = path.join(process.cwd(), "public");
  const full = path.resolve(base, "." + rel);
  if (!full.startsWith(ROOT() + path.sep) && full !== ROOT()) {
    return NextResponse.json({ error: "Path outside image root" }, { status: 400 });
  }
  const contentStr = JSON.stringify(await getContent());
  if (contentStr.includes(rel)) {
    return NextResponse.json({ error: "Image is in use on the site — remove it from content first" }, { status: 409 });
  }
  await fs.unlink(full).catch(() => null);
  return NextResponse.json({ ok: true });
}
