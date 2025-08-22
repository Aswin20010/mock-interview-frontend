export const dynamic = "force-dynamic";

import { addAnswer, getSession } from "../../../../../../lib/mockStore";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const { text } = await req.json().catch(() => ({ text: "" }));

  const s = getSession(id);
  if (!s) return Response.json({ error: "session_not_found" }, { status: 404 });

  addAnswer(id, s.current, text);

  // simple follow-up
  const follow_up =
    "Thanks! Can you quantify the impact with a specific metric (%, time saved, cost reduced, or revenue)?";

  return Response.json({ follow_up, done: true }, { status: 200 });
}
