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

  const handleSubmit = async () => {
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

  return (
    <div className="min-h-screen bg-[#0f111a] text-white p-4 font-mono">
      <h1 className="text-3xl font-bold mb-2">Coding Round</h1>
      <p className="text-gray-400 text-sm mb-4">Session ID: {sessionId}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Question */}
        <div className="bg-white text-black p-4 rounded shadow h-fit">
          {loading ? (
            <p>Loading question...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">{question.title}</h2>
              <p className="mb-2">{question.description}</p>
              <p className="font-bold mb-1">Constraints:</p>
              <pre className="text-sm mb-2">{question.constraints}</pre>
              <p className="font-bold mb-1">Example:</p>
              <pre className="text-sm mb-2">Input: {question.examples[0].input}</pre>
              <pre className="text-sm mb-2">Output: {question.examples[0].output}</pre>
              <pre className="text-sm">Explanation: {question.examples[0].explanation}</pre>
            </>
          )}
        </div>

        {/* Right: Code + Console */}
        <div className="flex flex-col gap-3">
          {/* Language Selector & Submit */}
          <div className="flex justify-between">
            <select
              className="text-black p-1 rounded"
              value={languageId}
              onChange={(e) => setLanguageId(Number(e.target.value))}
            >
              <option value={63}>JavaScript (Node.js)</option>
              <option value={71}>Python (3.8.1)</option>
              <option value={54}>C++ (GCC 9.2)</option>
              <option value={62}>Java (OpenJDK 13)</option>
            </select>
            <button
              onClick={handleSubmit}
              className="bg-green-600 px-4 py-1 rounded hover:bg-green-700"
            >
              Submit
            </button>
          </div>

          {/* Monaco Editor */}
          <MonacoEditor
            height="300px"
            defaultLanguage="javascript"
            language={
              languageId === 71
                ? "python"
                : languageId === 54
                ? "cpp"
                : languageId === 62
                ? "java"
                : "javascript"
            }
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
          />

          {/* Custom Input */}
          <div>
            <label className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={useCustomInput}
                onChange={() => setUseCustomInput(!useCustomInput)}
              />
              <span className="text-sm">Use custom input</span>
            </label>
            {useCustomInput && (
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter custom input here"
                className="w-full bg-[#1e1e1e] text-white p-2 rounded h-24 resize-none"
              />
            )}
          </div>

          {/* Console */}
          <div className="mt-2">
            <button
              className="text-sm text-blue-400 mb-1 hover:underline"
              onClick={() => setShowConsole((prev) => !prev)}
            >
              {showConsole ? "Hide Console" : "Show Console"}
            </button>
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
