// app/api/submit-code/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code, language_id, stdin } = await req.json();

  const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
  const JUDGE0_API_HOST = process.env.JUDGE0_API_HOST;

  if (!JUDGE0_API_KEY || !JUDGE0_API_HOST) {
    return NextResponse.json({ error: "Missing API key or host" }, { status: 500 });
  }

  const submissionRes = await fetch(`https://${JUDGE0_API_HOST}/submissions?base64_encoded=false&wait=true`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": JUDGE0_API_KEY,
      "X-RapidAPI-Host": JUDGE0_API_HOST,
    },
    body: JSON.stringify({
      source_code: code,
      language_id,
      stdin,
    }),
  });

  const result = await submissionRes.json();
  return NextResponse.json(result);
}
