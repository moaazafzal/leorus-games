import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getContent, saveContent } from "@/lib/content";

export async function GET() {
  return NextResponse.json(await getContent());
}

export async function PUT(req: Request) {
  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return NextResponse.json({ error: "Content must be a JSON object" }, { status: 400 });
  }
  await saveContent(data);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
