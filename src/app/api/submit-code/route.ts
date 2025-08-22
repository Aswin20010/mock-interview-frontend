// app/api/submit-code/route.ts

import { NextRequest, NextResponse } from "next/server";

const JUDGE0_BASE_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";

export async function POST(req: NextRequest) {
  const { code, language_id, stdin } = await req.json();

  // ✅ Sample test cases (will be dynamic in the future)
  const testCases = [
    { input: "-2 1 -3 4 -1 2 1 -5 4", expected: "6" },
    { input: "1 2 3 4 5", expected: "15" },
    { input: "-1 -2 -3 -4", expected: "-1" },
  ];

  const headers = {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": process.env.JUDGE0_API_KEY!,
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  };

  const results = [];

  for (const testCase of testCases) {
    const response = await fetch(JUDGE0_BASE_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        source_code: code,
        language_id,
        stdin: testCase.input,
      }),
    });

    const result = await response.json();

    results.push({
      input: testCase.input,
      output: result.stdout?.trim(),
      expected: testCase.expected,
      passed: result.stdout?.trim() === testCase.expected,
    });
  }

  return NextResponse.json({ results });
}
