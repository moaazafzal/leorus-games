import crypto from "node:crypto";

const COOKIE = "leorus_admin";
const WEEK = 7 * 24 * 60 * 60 * 1000;

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function createToken(email: string): string {
  const secret = process.env.AUTH_SECRET!;
  const body = b64url(Buffer.from(JSON.stringify({ email, exp: Date.now() + WEEK })));
  const sig = b64url(crypto.createHmac("sha256", secret).update(body).digest());
  return `${body}.${sig}`;
}

export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) {
    // still burn constant time
    crypto.timingSafeEqual(ba, ba);
    return false;
  }
  return crypto.timingSafeEqual(ba, bb);
}

export { COOKIE };
