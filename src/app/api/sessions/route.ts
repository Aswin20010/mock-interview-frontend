import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth(); // ✅ await here!

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { company, rounds } = body;

  if (!company || !Array.isArray(rounds)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const sessionId = crypto.randomUUID();

  const session = {
    id: sessionId,
    userId,
    company,
    rounds,
    createdAt: new Date().toISOString(),
  };

  console.log("📦 Session created:", session);

  return NextResponse.json({ id: sessionId }, { status: 200 });
}
