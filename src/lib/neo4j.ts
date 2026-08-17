import neo4j, { type Driver, type Integer, type Session } from "neo4j-driver";

const globalForNeo4j = globalThis as unknown as { cascadeDriver?: Driver };

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new ConfigError(
      `Missing ${name}. Copy .env.example to .env.local and add your CognoDB credentials.`,
    );
  }
  return value;
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export class DatabaseUnreachableError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "DatabaseUnreachableError";
  }
}

export function getDriver(): Driver {
  if (!globalForNeo4j.cascadeDriver) {
    const uri = requiredEnv("COGNODB_URI");
    const password = requiredEnv("COGNODB_PASSWORD");
    const user = process.env.COGNODB_USER || "cognodb";
    globalForNeo4j.cascadeDriver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }
  return globalForNeo4j.cascadeDriver;
}

export function toNative(value: unknown): unknown {
  if (value == null) return value;
  if (neo4j.isInt(value)) return (value as Integer).toNumber();
  if (Array.isArray(value)) return value.map(toNative);
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
        key,
        toNative(nested),
      ]),
    );
  }
  return value;
}

async function withSession<T>(work: (session: Session) => Promise<T>): Promise<T> {
  const driver = getDriver();
  const session = driver.session();
  try {
    return await work(session);
  } catch (error) {
    if (error instanceof ConfigError) throw error;
    const message =
      error instanceof Error ? error.message : "Unknown database error";
    throw new DatabaseUnreachableError(
      `CognoDB is unreachable. ${message}`,
      { cause: error },
    );
  } finally {
    await session.close();
  }
}

export async function readQuery<T>(
  cypher: string,
  params: Record<string, unknown> = {},
): Promise<T[]> {
  return withSession(async (session) => {
    const result = await session.executeRead((tx) => tx.run(cypher, params));
    return result.records.map((record) => toNative(record.toObject()) as T);
  });
}

export async function writeQuery<T>(
  cypher: string,
  params: Record<string, unknown> = {},
): Promise<T[]> {
  return withSession(async (session) => {
    const result = await session.executeWrite((tx) => tx.run(cypher, params));
    return result.records.map((record) => toNative(record.toObject()) as T);
  });
}

export function isDatabaseError(
  error: unknown,
): error is ConfigError | DatabaseUnreachableError {
  return error instanceof ConfigError || error instanceof DatabaseUnreachableError;
}
