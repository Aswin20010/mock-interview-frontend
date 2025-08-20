import { headers } from "next/headers";

async function getBaseUrl() {
  const h = await headers(); // ✅ await
  const host =
    h.get("x-forwarded-host") ??
    h.get("host") ??
    "localhost:3000"; // fallback for dev
  const proto =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");
  return `${proto}://${host}`;
}

async function getScore(id: string) {
  const base = await getBaseUrl();
  const r = await fetch(`${base}/api/sessions/${id}/score`, { cache: "no-store" });
  return r.json();
}

export default async function Results({ params }: { params: { id: string } }) {
  const data = await getScore(params.id);

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Scorecard — Session {params.id.slice(0,8)}…</h1>

      <div className="grid grid-cols-3 gap-3">
        <div className="border p-4 rounded">
          <div className="text-sm text-gray-500">STAR</div>
          <div className="text-2xl font-semibold">{Math.round(data.star * 100)}%</div>
        </div>
        <div className="border p-4 rounded">
          <div className="text-sm text-gray-500">Clarity</div>
          <div className="text-2xl font-semibold">{Math.round(data.clarity * 100)}%</div>
        </div>
        <div className="border p-4 rounded">
          <div className="text-sm text-gray-500">Impact</div>
          <div className="text-2xl font-semibold">{Math.round(data.impact * 100)}%</div>
        </div>
      </div>

      <div className="border p-4 rounded">
        <div className="text-sm text-gray-500">Final Score</div>
        <div className="text-3xl font-bold">{data.final_score}/100</div>
      </div>

      <div className="border p-4 rounded space-y-2">
        <div className="font-medium">Strengths</div>
        <ul className="list-disc ml-6">
          {data.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
        </ul>
        <div className="font-medium mt-3">Improvements</div>
        <ul className="list-disc ml-6">
          {data.improvements?.map((s: string, i: number) => <li key={i}>{s}</li>)}
        </ul>
      </div>

      <div className="border p-4 rounded">
        <div className="font-medium">Summary</div>
        <p className="mt-1">{data.summary}</p>
      </div>

      <a href="/" className="inline-block bg-black text-white px-4 py-2 rounded">New interview</a>
    </main>
  );
}
