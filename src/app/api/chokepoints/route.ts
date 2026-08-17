import { getChokePoints } from "@/lib/queries";
import { jsonError, jsonOk } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getChokePoints();
    return jsonOk({ chokePoints: data });
  } catch (error) {
    return jsonError(error);
  }
}
