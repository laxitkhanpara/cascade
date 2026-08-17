"use client";

import Link from "next/link";
import { HazardBadge, PageHeader } from "@/components/AppShell";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { useApi } from "@/lib/use-api";
import type { ChokePoint } from "@/lib/types";

export default function ChokePointsPage() {
  const { data, error, loading, reload } = useApi<{ chokePoints: ChokePoint[] }>(
    "/api/chokepoints",
  );

  if (loading) return <LoadingState label="Finding single-supplier parts…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data || data.chokePoints.length === 0) {
    return (
      <EmptyState
        title="No choke points"
        body="Either the graph is empty or every part has more than one supplier. Seed the database to load Helios sole-source glass, silicon, and sensors."
      />
    );
  }

  return (
    <div>
      <PageHeader
        kicker="Single points of failure"
        title="Parts with exactly one supplier"
        body="This is the query a relational BOM struggles with: walk a variable-depth parts tree, count suppliers per leaf, then fan back out to every finished SKU. Cypher does it in one pattern."
      />
      <div className="space-y-3">
        {data.chokePoints.map((point) => (
          <article key={point.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
                  {point.category} · {point.criticality}
                </p>
                <h2 className="mt-1 text-lg text-white">{point.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {point.supplier} · {point.city}, {point.country}
                </p>
              </div>
              <HazardBadge hazard={point.hazard} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {point.products.length === 0 ? (
                <span className="text-sm text-[var(--muted)]">No finished SKU uses this part yet.</span>
              ) : (
                point.products.map((name) => (
                  <span
                    key={name}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]"
                  >
                    {name}
                  </span>
                ))
              )}
            </div>
            <p className="mt-4 text-xs text-[var(--muted)]">
              <Link href="/simulate" className="text-[var(--accent)] hover:underline">
                Simulate this city
              </Link>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
