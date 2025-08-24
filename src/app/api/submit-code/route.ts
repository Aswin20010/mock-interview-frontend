// File: app/api/submit-code/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { code, language_id, sessionId } = await req.json();

  // Fetch the question for this session (replace with real DB/API in production)
  const questionRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/questions-code?sessionId=${sessionId}`);
  const question = await questionRes.json();

  const results = [];

  for (const test of question.testCases) {
    const res = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.JUDGE0_API_KEY!,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        source_code: code,
        language_id,
        stdin: test.input,
      }),
    });

    const judgeRes = await res.json();
    const stdout = judgeRes.stdout || "";
    const stderr = judgeRes.stderr || "";
    const passed = stdout.trim() === test.expectedOutput.trim();

    results.push({
      input: test.input,
      expected: test.expectedOutput,
      output: stdout || stderr,
      status: passed ? "Passed" : "Failed",
    });
  }

  return NextResponse.json({ results });
}
