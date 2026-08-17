"use client";

import { Suspense, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHeader, StatCard } from "@/components/AppShell";
import { GraphCanvas } from "@/components/GraphCanvas";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { postJson, useApi } from "@/lib/use-api";
import type { SimulateResponse, TargetsResponse } from "@/lib/types";

function SimulateForm() {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("type") as "city" | "factory" | "supplier" | null) ?? "city";
  const initialId = searchParams.get("id") ?? "";

  const { data: targets, error, loading, reload } = useApi<TargetsResponse>("/api/targets");
  const [targetType, setTargetType] = useState<"city" | "factory" | "supplier">(initialType);
  const [targetId, setTargetId] = useState(initialId);
  const [result, setResult] = useState<SimulateResponse | null>(null);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  const options = useMemo(() => {
    if (!targets) return [];
    if (targetType === "city") return targets.cities;
    if (targetType === "factory") return targets.factories;
    return targets.suppliers;
  }, [targets, targetType]);

  async function runSimulation(event: FormEvent) {
    event.preventDefault();
    const id = targetId || options[0]?.id;
    if (!id) return;
    setRunning(true);
    setRunError(null);
    try {
      const payload = await postJson<SimulateResponse>("/api/simulate", {
        targetType,
        targetId: id,
      });
      setResult(payload);
    } catch (err) {
      setResult(null);
      setRunError(err instanceof Error ? err.message : "Simulation failed.");
    } finally {
      setRunning(false);
    }
  }

  if (loading) return <LoadingState label="Loading cities, factories, and suppliers…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!targets || targets.cities.length === 0) {
    return (
      <EmptyState
        title="Nothing to disrupt yet"
        body="Seed the CognoDB instance with npm run seed, then come back to simulate Harrodsburg or Tainan."
      />
    );
  }

  return (
    <div>
      <PageHeader
        kicker="Disruption simulator"
        title="Simulate a flood, typhoon, or factory outage"
        body="The query walks City → Factory → Supplier → nested Component → Product. That is four to six hops. In SQL it would be recursive CTEs or a handful of self-joins on a BOM table."
      />

      <form onSubmit={runSimulation} className="card mb-8 grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto]">
        <label className="text-sm">
          <span className="mb-2 block text-[var(--muted)]">Target</span>
          <select
            className="field"
            value={targetType}
            onChange={(event) => {
              setTargetType(event.target.value as "city" | "factory" | "supplier");
              setTargetId("");
            }}
          >
            <option value="city">City</option>
            <option value="factory">Factory</option>
            <option value="supplier">Supplier</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-2 block text-[var(--muted)]">Where</span>
          <select
            className="field"
            value={targetId || options[0]?.id || ""}
            onChange={(event) => setTargetId(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
                {option.extra ? ` — ${option.extra}` : ""}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full md:w-auto" disabled={running}>
            {running ? "Tracing impact…" : "Simulate disruption"}
          </button>
        </div>
      </form>

      {runError ? <ErrorState message={runError} /> : null}

      {!result && !runError ? (
        <EmptyState
          title="No simulation yet"
          body="Try Harrodsburg (sole-source cover glass) or Tainan (every Helios SoC). Affected products light up after one graph walk."
        />
      ) : null}

      {result ? (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-[var(--muted)]">
              Shock from {result.target.type}{" "}
              <span className="text-white">{result.target.name}</span>
              {result.target.extra ? ` · ${result.target.extra}` : ""}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Products delayed" value={result.summary.products} />
            <StatCard label="Parts hit" value={result.summary.parts} />
            <StatCard label="Suppliers" value={result.summary.suppliers} />
            <StatCard label="Factories" value={result.summary.factories} />
          </div>
          <GraphCanvas
            graph={result.graph}
            emptyLabel="This target does not sit on any product path."
          />
          {result.products.length === 0 ? (
            <EmptyState
              title="No finished goods in the blast radius"
              body="The selected node is in the graph, but no Product assembles from parts that pass through it."
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {result.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="card p-4 hover:border-[var(--danger)]/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
                        {product.category}
                      </p>
                      <p className="mt-1 text-white">{product.name}</p>
                    </div>
                    {product.soleSourceHits > 0 ? (
                      <span className="hazard hazard-tornado">sole-source</span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    {product.hitParts.slice(0, 4).join(" · ")}
                    {product.hitParts.length > 4
                      ? ` · +${product.hitParts.length - 4} more`
                      : ""}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function SimulatePage() {
  return (
    <Suspense fallback={<LoadingState label="Opening simulator…" />}>
      <SimulateForm />
    </Suspense>
  );
}
