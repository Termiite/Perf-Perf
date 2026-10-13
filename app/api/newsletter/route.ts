import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { email } = (await request.json().catch(() => ({}))) as { email?: string };
  const normalized = email?.trim().toLowerCase();
  if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  await getPool().query("INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING", [
    normalized,
  ]);
  return NextResponse.json({ ok: true });
}
