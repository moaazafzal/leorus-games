import { NextResponse } from "next/server";
import { COOKIE, createToken, safeEqual } from "@/lib/auth";

const attempts = new Map<string, { count: number; reset: number }>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const now = Date.now();
  const entry = attempts.get(ip) ?? { count: 0, reset: now + 15 * 60 * 1000 };
  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + 15 * 60 * 1000;
  }
  if (entry.count >= 10) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const { email, password } = await req.json().catch(() => ({}));
  const okEmail = typeof email === "string" && safeEqual(email, process.env.ADMIN_EMAIL ?? "");
  const okPass = typeof password === "string" && safeEqual(password, process.env.ADMIN_PASSWORD ?? "");

  if (!okEmail || !okPass) {
    entry.count += 1;
    attempts.set(ip, entry);
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, createToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
