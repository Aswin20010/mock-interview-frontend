// app/api/questions/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  // Mock data – in real world, you'd fetch session details using the sessionId
  const mockSession = {
    company: "Google",
    roundType: "Coding",
  };

  const codingQuestion = {
    title: "Coding Question for Google",
    description: "Given an array of integers, return the maximum sum of any contiguous subarray.",
    constraints: "1 <= nums.length <= 10^5",
    examples: [
        {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum = 6."
        }
    ],
    testCases: [
        { input: "-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
        { input: "1 2 3", expectedOutput: "6" },
        { input: "-1 -2 -3", expectedOutput: "-1" },
        { input: "5", expectedOutput: "5" }
    ]
    };


  return NextResponse.json(codingQuestion);
}
