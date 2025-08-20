export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> } // Next.js 15: await params
) {
  const { id } = await ctx.params;
  // you could vary the question by id if you want
  return Response.json(
    {
      type: "Behavioral",
      question:
        "Tell me about a time you owned a problem end-to-end. What was the situation, what actions did you take, and what was the impact?"
    },
    { status: 200 }
  );
}
