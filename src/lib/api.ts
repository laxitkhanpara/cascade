import { NextResponse } from "next/server";
import {
  ConfigError,
  DatabaseUnreachableError,
} from "@/lib/neo4j";

export const runtime = "nodejs";

export function jsonError(error: unknown) {
  if (error instanceof ConfigError) {
    return NextResponse.json(
      { error: "not_configured", message: error.message },
      { status: 503 },
    );
  }
  if (error instanceof DatabaseUnreachableError) {
    return NextResponse.json(
      { error: "database_unreachable", message: error.message },
      { status: 503 },
    );
  }
  const message = error instanceof Error ? error.message : "Unexpected error";
  return NextResponse.json({ error: "internal", message }, { status: 500 });
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
