"use client";

import Link from "next/link";
import { HazardBadge, PageHeader, StatCard } from "@/components/AppShell";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { useApi } from "@/lib/use-api";
import type { OverviewResponse } from "@/lib/types";

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function HomePage() {
  const { data, error, loading, reload } = useApi<OverviewResponse>("/api/overview");

  if (loading) return <LoadingState label="Reading the Helios graph…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data || data.stats.products === 0) {
    return (
      <EmptyState
        title="The graph is empty"
        body="Run npm run seed after setting COGNODB_URI and COGNODB_PASSWORD. The seed loads Helios products, nested parts, suppliers, factories, and cities."
      />
    );
  }

  return (
    <div>
      <PageHeader
        kicker="Helios operations"
        title="If one city goes dark, what ships late?"
        body="Cascade traces nested bills of materials through suppliers and factories into cities. A flood, typhoon, or tornado is one traversal — not a stack of SQL joins."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Products" value={data.stats.products} hint="Finished Helios SKUs" />
        <StatCard label="Components" value={data.stats.components} hint="Nested BOM nodes" />
        <StatCard label="Suppliers" value={data.stats.suppliers} />
        <StatCard label="Factories" value={data.stats.factories} />
        <StatCard label="Cities" value={data.stats.cities} />
        <StatCard
          label="Sole-source parts"
          value={data.stats.soleSourceParts}
          hint="Single supplier — a real choke point"
        />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-lg font-medium text-white">Cities by blast radius</h2>
          <Link href="/simulate" className="text-sm text-[var(--accent)] hover:underline">
            Simulate a disruption
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {data.cities.map((city) => (
            <Link
              key={city.id}
              href={`/simulate?type=city&id=${city.id}`}
              className="card p-4 transition-colors hover:border-[var(--accent)]/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{city.name}</p>
                  <p className="text-sm text-[var(--muted)]">{city.country}</p>
                </div>
                <HazardBadge hazard={city.hazard} />
              </div>
              <p className="mt-4 font-mono text-2xl text-white">
                {city.productsAtRisk}
                <span className="ml-2 text-sm text-[var(--muted)]">SKUs at risk</span>
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {city.factories} factor{city.factories === 1 ? "y" : "ies"} in graph
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-medium text-white">Product exposure</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="card p-4 transition-colors hover:border-[var(--info)]/40"
            >
              <p className="text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
                {product.category}
              </p>
              <p className="mt-1 text-white">{product.name}</p>
              <p className="mt-3 text-sm text-[var(--muted)]">
                {money(product.asp)} · {product.cityCount} cities ·{" "}
                {product.soleSourceCount} sole-source parts
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
