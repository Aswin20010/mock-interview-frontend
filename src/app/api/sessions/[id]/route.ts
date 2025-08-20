import { getSession } from "../../../../../lib/mockStore";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }  // Next 15: params is a Promise
) {
  const { id } = await ctx.params;
  const s = getSession(id);
  if (!s) {
    return Response.json({ error: "session_not_found" }, { status: 404 });
  }
  return Response.json(s, { status: 200 });
}
