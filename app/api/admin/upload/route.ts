import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

const ALLOWED = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif"]);
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED.has(ext)) {
    return NextResponse.json({ error: `Unsupported type ${ext}` }, { status: 400 });
  }
  const base = path
    .basename(file.name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .slice(0, 40) || "img";
  const name = `${Date.now()}-${base}${ext}`;
  const dir = path.join(process.cwd(), "public", "img", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ path: `/img/uploads/${name}` });
}
