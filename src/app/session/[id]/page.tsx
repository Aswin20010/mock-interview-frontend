import CodingRound from "../../../../components/CodingRound";


export default async function CodingPage({ params }: { params: { id: string } }) {
  const sessionId = params.id; // ✅ params is fine here in an async server component

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Coding Round</h1>
      <p className="text-lg mb-6">Session ID: {sessionId}</p>

      {/* ✅ Pass sessionId as prop */}
      <CodingRound sessionId={sessionId} />
    </div>
  );
}

