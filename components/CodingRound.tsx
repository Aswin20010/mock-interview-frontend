"use client";

import { useState } from "react";

export default function CodingRound({ sessionId }: { sessionId: string }) {
  const [code, setCode] = useState("// Write your code here");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/submit-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language_id: 63, // JavaScript (Node.js)
          stdin: "",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOutput(data.stdout || data.stderr || "No output");
      } else {
        alert(data.error || "Submission failed");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white p-4 rounded border border-white">
      <h2 className="text-xl font-bold mb-4">Coding Round</h2>
      <p className="mb-2">Session ID: {sessionId}</p>

      <textarea
        className="w-full h-64 p-2 text-black"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-green-600 px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Code"}
      </button>

      {output && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Output:</h3>
          <pre className="bg-gray-900 text-green-400 p-4 rounded whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
