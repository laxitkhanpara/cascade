"use client";

import { useCallback, useEffect, useState } from "react";

type ApiErrorBody = { error?: string; message?: string };

export function useApi<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    async function run() {
      try {
        const response = await fetch(url);
        const body = (await response.json()) as T & ApiErrorBody;
        if (cancelled) return;
        if (!response.ok) {
          throw new Error(body.message || "Request failed.");
        }
        setData(body);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setData(null);
        setError(err instanceof Error ? err.message : "Request failed.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [url, tick]);

  const reload = useCallback(() => {
    setLoading(true);
    setTick((value) => value + 1);
  }, []);

  return { data, error, loading, reload };
}

export async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await response.json()) as T & ApiErrorBody;
  if (!response.ok) {
    throw new Error(body.message || "Request failed.");
  }
  return body;
}
