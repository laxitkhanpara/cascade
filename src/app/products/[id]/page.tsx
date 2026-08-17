"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { HazardBadge, PageHeader, StatCard } from "@/components/AppShell";
import { GraphCanvas } from "@/components/GraphCanvas";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { useApi } from "@/lib/use-api";
import type { ProductDetail } from "@/lib/types";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const { data, error, loading, reload } = useApi<ProductDetail>(
    params.id ? `/api/products/${params.id}` : null,
  );

  if (loading) return <LoadingState label="Walking this SKU’s bill of materials…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) {
    return (
      <EmptyState
        title="Product not found"
        body="That id is not in the graph. Go back to Overview and pick a Helios SKU."
      />
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-white">
          Overview
        </Link>
        <span className="px-2">/</span>
        {data.name}
      </p>
      <PageHeader
        kicker={data.category}
        title={data.name}
        body="Every city on this page sits somewhere under the nested BOM. That is the geographic exposure of a single SKU — a multi-hop reachability query."
      />
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Cities on the path" value={data.cities.length} />
        <StatCard label="Sole-source parts" value={data.soleSourceParts.length} />
        <StatCard
          label="List price"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(data.asp)}
        />
      </div>
      <GraphCanvas
        graph={data.graph}
        emptyLabel="This product has no sourced components yet."
      />
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-sm tracking-[0.16em] text-[var(--muted)] uppercase">
            Geographic exposure
          </h2>
          <ul className="mt-4 space-y-3">
            {data.cities.map((city) => (
              <li key={city.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-white">{city.name}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {city.parts.slice(0, 3).join(" · ")}
                  </p>
                </div>
                <HazardBadge hazard={city.hazard} />
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="text-sm tracking-[0.16em] text-[var(--muted)] uppercase">
            Sole-source parts
          </h2>
          {data.soleSourceParts.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--muted)]">
              Every leaf part on this SKU has more than one supplier.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {data.soleSourceParts.map((part) => (
                <li key={part.id}>
                  <p className="text-white">{part.name}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {part.supplier} · {part.city}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
