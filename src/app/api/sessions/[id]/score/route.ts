export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  // 🔮 mock rubric
  const score = {
    sessionId: id,
    rubric: "STAR",
    star: 0.7,          // 0..1
    clarity: 0.6,
    impact: 0.5,
    final_score: 68,    // 0..100
    strengths: ["clear actions", "good ownership"],
    improvements: ["quantify impact", "tighten structure"],
    summary:
      "Solid example with clear actions. Add metrics and outcomes to strengthen the Result."
  };

  return Response.json(score, { status: 200 });
}
