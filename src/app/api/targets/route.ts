import { getTargets } from "@/lib/queries";
import { jsonError, jsonOk } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getTargets();
    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}
