import CodingRound from "../../../../components/CodingRound";


export default async function CodingPage({ params }: { params: { id: string } }) {
  const sessionId = params.id; // ✅ params is fine here in an async server component

  return (
    <div className="p-6">

      {/* ✅ Pass sessionId as prop */}
      <CodingRound sessionId={sessionId} />
    </div>
  );
}

