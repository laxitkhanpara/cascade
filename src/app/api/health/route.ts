import { pingDatabase } from "@/lib/queries";
import { jsonError, jsonOk } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ok = await pingDatabase();
    return jsonOk({ ok });
  } catch (error) {
    return jsonError(error);
  }
}
