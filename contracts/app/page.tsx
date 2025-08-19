async function getHealth() {
  const r = await fetch("http://localhost:3000/api/health", { cache: "no-store" });
  return r.json();
}

export default async function Home() {
  const health = await getHealth();
  return (
    <main className="p-8 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Mock Interview</h1>
      <pre className="border p-3 rounded bg-gray-50 text-sm">
        {JSON.stringify(health, null, 2)}
      </pre>
    </main>
  );
}
