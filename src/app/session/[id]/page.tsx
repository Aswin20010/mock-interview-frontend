type Params = { id: string };

async function getSession(id: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const r = await fetch(`${base}/api/sessions/${id}`, { cache: "no-store" });
  return r.json();
}


export default async function SessionPage({ params }: { params: Params }) {
  const data = await getSession(params.id);

  if (!data?.id) {
    return <main className="p-8">Session not found.</main>;
  }

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">{data.company} — Session</h1>
      <div className="border p-4 rounded">
        <div>Round {data.current + 1} of {data.rounds.length}</div>
        <div>Type: <b>{data.rounds[data.current].type}</b></div>
      </div>
      <p className="text-sm text-gray-500">
        (Next: we’ll add “Start Round” and show a mock question.)
      </p>
    </main>
  );
}
