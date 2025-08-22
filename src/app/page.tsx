"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
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
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);
  const [lastSessionCompany, setLastSessionCompany] = useState<string | null>(null);

  // Load prefs
  useEffect(() => {
    const savedCompany = localStorage.getItem("prefCompany");
    const savedRounds = localStorage.getItem("prefRounds");
    if (savedCompany) setCompany(savedCompany as any);
    if (savedRounds) {
      try {
        const parsed = JSON.parse(savedRounds) as { type: RoundType }[];
        if (Array.isArray(parsed) && parsed.length > 0) setRounds(parsed);
      } catch {}
    }
    setLastSessionId(localStorage.getItem("lastSessionId"));
    setLastSessionCompany(localStorage.getItem("lastSessionCompany"));
  }, []);

  useEffect(() => {
    localStorage.setItem("prefCompany", company);
  }, [company]);
  useEffect(() => {
    localStorage.setItem("prefRounds", JSON.stringify(rounds));
  }, [rounds]);

  const addRound = () => setRounds((r) => [...r, { type: "Behavioral" }]);

  const removeRound = (i: number) =>
    setRounds((r) => (r.length <= 1 ? r : r.filter((_, idx) => idx !== i)));

  const setType = (i: number, t: RoundType) => {
    setRounds((r) => {
      const copy = r.slice();
      copy[i] = { type: t };
      return copy;
    });
  };

  const start = async () => {
  if (rounds.length === 0) {
    alert("Add at least one round.");
    return;
  }
  setLoading(true);
  try {
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, rounds }),
    });

    const j = await res.json().catch(() => ({})); // prevent crash if response is not JSON

    if (!res.ok || !j.id) {
      alert(j.error || "Failed to create session");
      return;
    }

    localStorage.setItem("lastSessionId", j.id);
    localStorage.setItem("lastSessionCompany", company);

    // Redirect to upload page
    window.location.href = `/session/${j.id}/upload`;
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mock Interview</h1>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </header>

      {/* Show when NOT logged in */}
      <SignedOut>
        <p className="text-lg">
          Please <SignInButton mode="modal">sign in</SignInButton> to start your interview.
        </p>
      </SignedOut>

      {/* Show when LOGGED IN */}
      <SignedIn>
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
              <button
                type="button"
                onClick={() => removeRound(i)}
                className="border px-2 py-1 rounded disabled:opacity-50"
                disabled={rounds.length <= 1}
                title={rounds.length <= 1 ? "Keep at least one round" : "Remove round"}
              >
                −
              </button>
            </div>
          ))}
          <button className="border px-3 py-2 rounded" onClick={addRound}>
            + Add round
          </button>
        </div>

        {lastSessionId && (
          <a
            href={`/session/${lastSessionId}`}
            className="inline-block border px-3 py-2 rounded"
            title={lastSessionCompany ? `Resume ${lastSessionCompany}` : "Resume last session"}
          >
            Resume last session{lastSessionCompany ? ` (${lastSessionCompany})` : ""}
          </a>
        )}

        <button
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={start}
          disabled={loading}
        >
          {loading ? "Starting..." : "Start Interview"}
        </button>
      </SignedIn>
    </main>
  );
}
