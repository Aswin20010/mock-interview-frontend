export const dynamic = "force-dynamic";

import { getSession } from "../../../../../../lib/mockStore";
import { scoreBehavioral } from "../../../../../../lib/scorer";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const s = getSession(id);
  if (!s) return Response.json({ error: "session_not_found" }, { status: 404 });

  // for now we score the last answer in this session
  const last = s.answers.at(-1);
  if (!last || !last.text) {
    return Response.json({ error: "no_answer" }, { status: 400 });
  }

  // if the current round is non-behavioral, you could branch later
  const result = scoreBehavioral(last.text);

  return Response.json({ sessionId: id, rubric: "STAR", ...result }, { status: 200 });
}
