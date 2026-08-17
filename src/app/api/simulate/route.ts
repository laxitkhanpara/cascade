import { simulateDisruption } from "@/lib/queries";
import { jsonError, jsonOk } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      targetType?: string;
      targetId?: string;
    };
    const targetType = body.targetType;
    const targetId = body.targetId;
    if (
      targetType !== "city" &&
      targetType !== "factory" &&
      targetType !== "supplier"
    ) {
      return jsonError(new Error("Pick a city, factory, or supplier."));
    }
    if (!targetId) {
      return jsonError(new Error("Missing targetId."));
    }
    const data = await simulateDisruption(targetType, targetId);
    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}
