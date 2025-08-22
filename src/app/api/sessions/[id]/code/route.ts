import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id: sessionId } = params;
  const { code } = await req.json();

  // TODO: Evaluate the code, store result, or queue for judging
  console.log("Received submission:", sessionId, code);

  return NextResponse.json({ message: "Code received" }, { status: 200 });
}
