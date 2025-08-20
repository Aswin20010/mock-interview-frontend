"use client";
import { useEffect, useState } from "react";

const companies = ["Google", "Walmart", "Meta", "Amazon", "Target"] as const;
const roundTypes = ["Behavioral", "Coding", "System Design"] as const;
type RoundType = typeof roundTypes[number];

export default function Home() {
  const [company, setCompany] = useState<typeof companies[number]>("Google");
  const [rounds, setRounds] = useState<{ type: RoundType }[]>([
    { type: "Behavioral" },
  ]);
  const [loading, setLoading] = useState(false);

  // 👇 new: remember last session
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);

  useEffect(() => {
    // safe in client component
    setLastSessionId(localStorage.getItem("lastSessionId"));
  }, []);

  const addRound = () => setRounds((r) => [...r, { type: "Behavioral" }]);

  const setType = (i: number, t: RoundType) => {
    const copy = rounds.slice();
    copy[i].type = t;
    setRounds(copy);
  };

  const start = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/sessions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ company, rounds }),
      });
      const j = await r.json();
      if (!r.ok || !j.id) {
        alert("Failed to create session");
        return;
      }
      // 👇 new: store last session id (and optionally company)
      localStorage.setItem("lastSessionId", j.id);
      localStorage.setItem("lastSessionCompany", company);
      window.location.href = `/session/${j.id}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Mock Interview</h1>

      <label className="block">
        <span className="block mb-1">Company</span>
        <select
          className="border p-2 w-full"
          value={company}
          onChange={(e) => setCompany(e.target.value as any)}
        >
          {companies.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>

      <div className="space-y-3">
        {rounds.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-24">Round {i + 1}</span>
            <select
              className="border p-2 flex-1"
              value={r.type}
              onChange={(e) => setType(i, e.target.value as RoundType)}
            >
              {roundTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        ))}
        <button className="border px-3 py-2 rounded" onClick={addRound}>
          + Add round
        </button>
      </div>

      {/* 👇 new: resume link if a previous session exists */}
      {lastSessionId && (
        <a
          href={`/session/${lastSessionId}`}
          className="inline-block border px-3 py-2 rounded"
        >
          Resume last session
        </a>
      )}

      <button
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={start}
        disabled={loading}
      >
        {loading ? "Starting..." : "Start Interview"}
      </button>
    </main>
  );
}
