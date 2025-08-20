import { NextRequest } from "next/server";
import { saveSession } from "../../../../lib/mockStore";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json(); // { company: string, rounds: [{type: ...}] }
  const id = randomUUID();
  const session = { id, current: 0, ...body };
  saveSession(session);
  return Response.json(session, { status: 200 });
}
