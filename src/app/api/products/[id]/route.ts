import { getProductDetail } from "@/lib/queries";
import { jsonError, jsonOk } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const data = await getProductDetail(id);
    if (!data) {
      return jsonOk({ error: "not_found", message: "Product not found." }, 404);
    }
    return jsonOk(data);
  } catch (error) {
    return jsonError(error);
  }
}
