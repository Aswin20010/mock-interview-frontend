export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const { text } = await req.json().catch(() => ({ text: "" }));

  // naive mock scoring or echo
  const done = true;
  const follow_up =
    "Thanks. Can you quantify the impact with a specific metric (%, time saved, cost reduced, or revenue)?";

  return Response.json({ follow_up, done }, { status: 200 });
}
