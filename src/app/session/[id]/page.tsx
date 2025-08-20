"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SessionPage() {
  const p = useParams<{ id: string | string[] }>();
  const id = Array.isArray(p.id) ? p.id[0] : p.id;

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [followUp, setFollowUp] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/sessions/${id}`).then(r => r.json()).then(setSession);
  }, [id]);

  const startRound = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/sessions/${id}/start`, { method: "POST" });
      if (!r.ok) { alert("Failed to start"); return; }
      const j = await r.json();
      setQuestion(j.question || "(no question)");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!id || !answer.trim()) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/sessions/${id}/answer`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: answer })
      });
      if (!r.ok) { alert("Failed to submit"); return; }
      const j = await r.json();
      setFollowUp(j.follow_up || "");
      setAnswer("");
    } finally {
      setLoading(false);
    }
  };

  if (!id) return <main className="p-8">Loading…</main>;
  if (!session) return <main className="p-8">Loading session…</main>;

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">{session.company} — Session</h1>
      <div className="text-sm text-gray-500">
        Round {session.current + 1} of {session.rounds.length} — Type:{" "}
        <b>{session.rounds[session.current].type}</b>
      </div>

      <div className="border p-4 rounded space-y-3">
        <button
          className="border px-3 py-2 rounded"
          onClick={startRound}
          disabled={loading || !!question}
        >
          {question ? "Question loaded" : loading ? "Starting…" : "Start Round"}
        </button>

        {question && (
          <>
            <div className="font-medium">Question</div>
            <div className="border p-3 rounded bg-gray-50 dark:bg-gray-900 whitespace-pre-wrap">
              {question}
            </div>

            <textarea
              className="border w-full p-2 rounded h-32"
              placeholder="Type your answer..."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
            />

            <button
              className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={submitAnswer}
              disabled={loading || !answer.trim()}
            >
              {loading ? "Submitting…" : "Submit Answer"}
            </button>
          </>
        )}

        {followUp && (
          <div className="mt-4 space-y-3">
            <div className="font-medium">Follow‑up</div>
            <div className="border p-3 rounded bg-gray-50 dark:bg-gray-900 whitespace-pre-wrap">
              {followUp}
            </div>
            <a
              href={`/session/${id}/results`}
              className="inline-block bg-black text-white px-4 py-2 rounded"
            >
              View Score
            </a>
          </div>
        )}

      </div>
    </main>
  );
}
