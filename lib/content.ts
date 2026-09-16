import { promises as fs } from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), "content", "site.json");

export async function getContent(): Promise<any> {
  const raw = await fs.readFile(FILE, "utf8");
  return JSON.parse(raw);
}

export async function saveContent(data: unknown): Promise<void> {
  await fs.writeFile(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");
}
