export const dynamic = "force-dynamic";

export async function GET() {
  // In mock mode we just return ok:true.
  // Later, when USE_BACKEND=1, we’ll proxy to the real backend.
  return Response.json({ ok: true }, { status: 200 });
}
