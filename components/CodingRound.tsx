"use client";

import { useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";

export default function CodingRound({ sessionId }: { sessionId: string }) {
  const [code, setCode] = useState("// Write your code here");
  const [question, setQuestion] = useState<any>(null);
  const [output, setOutput] = useState("");
  const [languageId, setLanguageId] = useState(63);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConsole, setShowConsole] = useState(true);
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins
  const [submitted, setSubmitted] = useState(false);
  const [testCases, setTestCases] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/questions-code?sessionId=${sessionId}`);
        if (!res.ok) throw new Error("Failed to fetch question");
        const data = await res.json();
        setQuestion(data);
        setTestCases(data.examples || []);
      } catch (err) {
        setError("Error fetching question");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [sessionId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      if (!submitted) handleSubmit();
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, submitted]);

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);

    const newResults = await Promise.all(
      testCases.map(async (test) => {
        const res = await fetch("/api/submit-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            language_id: languageId,
            stdin: useCustomInput ? customInput : test.input || "",
          }),
        });

        const data = await res.json();
        return {
          input: test.input,
          expected: test.output,
          actual: data.stdout?.trim() || data.stderr?.trim() || "No output",
          passed: data.stdout?.trim() === test.output.trim(),
        };
      })
    );

    setTestResults(newResults);
  };

  const formatTime = (t: number) => {
    const mins = String(Math.floor(t / 60)).padStart(2, "0");
    const secs = String(t % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const timeClass = timeLeft <= 5 * 60 ? "text-red-500" : "text-green-400";

  return (
    <div className="w-screen min-h-screen bg-[#0f111a] text-white font-mono overflow-x-hidden">
      <header className="sticky top-0 z-10 bg-[#141625] p-3 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-xl font-bold">Coding Round</h1>
        <span className={`font-semibold flex items-center gap-2 ${timeClass}`}>
          ⏰ Time Left: {formatTime(timeLeft)}
        </span>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow">
        {/* Question panel */}
        <div className="bg-white text-black p-4 rounded shadow overflow-auto">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <>
              <h3 className="text-lg font-bold mb-2">{question.title}</h3>
              <p className="mb-2">{question.description}</p>
              <p className="font-bold">Constraints:</p>
              <pre className="text-sm mb-2">{question.constraints}</pre>
              <p className="font-bold">Example:</p>
              <pre className="text-sm">Input: {question.examples[0].input}</pre>
              <pre className="text-sm">Output: {question.examples[0].output}</pre>
              <pre className="text-sm">Explanation: {question.examples[0].explanation}</pre>
            </>
          )}
        </div>

        {/* Editor and interaction area */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <select
              className="text-black p-2 rounded"
              value={languageId}
              onChange={(e) => setLanguageId(Number(e.target.value))}
            >
              <option value={63}>JavaScript (Node.js)</option>
              <option value={71}>Python (3.8.1)</option>
              <option value={54}>C++ (GCC 9.2)</option>
              <option value={62}>Java (OpenJDK 13)</option>
            </select>
            <button
              className={`px-4 py-2 rounded ${submitted ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"}`}
              onClick={handleSubmit}
              disabled={submitted}
            >
              {submitted ? "Submitted" : "Submit"}
            </button>
          </div>

          <MonacoEditor
            height="400px"
            theme="vs-dark"
            defaultLanguage="javascript"
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              lineNumbers: "on",
              tabSize: 2,
            }}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useCustomInput}
              onChange={() => setUseCustomInput((prev) => !prev)}
            />
            <label className="text-sm">Use Custom Input</label>
          </div>

          {useCustomInput && (
            <textarea
              className="bg-[#1e1e1e] text-white p-2 rounded h-24"
              placeholder="Enter custom input..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
            />
          )}

          <div className="text-sm text-blue-400 cursor-pointer" onClick={() => setShowConsole((prev) => !prev)}>
            {showConsole ? "Hide Console" : "Show Console"}
          </div>

          {showConsole && (
            <div className="bg-[#1e1e1e] text-green-300 p-3 rounded overflow-y-auto max-h-48">
              <h4 className="font-bold text-white mb-1">Console Output:</h4>
              {testResults.length > 0 ? (
                <ul className="text-sm space-y-2">
                  {testResults.map((res, idx) => (
                    <li key={idx} className={res.passed ? "text-green-400" : "text-red-400"}>
                      <strong>Test {idx + 1}:</strong> {res.passed ? "Passed" : "Failed"}
                      <br />
                      <span className="text-gray-400">Input:</span> {res.input}
                      <br />
                      <span className="text-gray-400">Expected:</span> {res.expected}
                      <br />
                      <span className="text-gray-400">Actual:</span> {res.actual}
                    </li>
                  ))}
                </ul>
              ) : (
                <pre className="whitespace-pre-wrap text-sm">{output}</pre>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
