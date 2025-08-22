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

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/questions-code?sessionId=${sessionId}`);
        if (!res.ok) throw new Error("Failed to fetch question");
        const data = await res.json();
        setQuestion(data);
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
      if (!submitted) handleSubmit(); // Auto-submit
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, submitted]);

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);

    const res = await fetch("/api/submit-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        language_id: languageId,
        stdin: useCustomInput ? customInput : "",
      }),
    });

    const data = await res.json();
    setOutput(data.stdout || data.stderr || "No output");
  };

  const formatTime = (t: number) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#0f111a] text-white p-4 font-mono">
      <h1 className="text-3xl font-bold">Coding Round</h1>
      <p className="text-sm text-gray-400 mb-2">Session ID: {sessionId}</p>

      <div className="bg-[#141625] p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Coding Round</h2>
          <span className="text-red-500 font-semibold flex items-center gap-2">
            ⏰ Time Left: {formatTime(timeLeft)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Question panel */}
          <div className="bg-white text-black p-4 rounded overflow-auto h-fit">
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

          {/* Editor + actions */}
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
              height="300px"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
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
              <div className="bg-[#1e1e1e] text-green-300 p-3 rounded h-32 overflow-y-auto">
                <h4 className="font-bold text-white mb-1">Console Output:</h4>
                <pre className="whitespace-pre-wrap text-sm">{output}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
