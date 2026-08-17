"use client";

import { useEffect, useRef } from "react";
import type { GraphPayload, NodeType } from "@/lib/types";

const colors: Record<NodeType, string> = {
  City: "#ff5c6a",
  Factory: "#c4b5fd",
  Supplier: "#f0b429",
  Component: "#2dd4bf",
  Product: "#5b8cff",
};

export function GraphCanvas({
  graph,
  emptyLabel,
}: {
  graph: GraphPayload | null;
  emptyLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!graph || graph.nodes.length === 0 || !containerRef.current) return;

    let cancelled = false;
    let cy: { destroy: () => void } | undefined;

    void (async () => {
      const cytoscape = (await import("cytoscape")).default;
      if (cancelled || !containerRef.current) return;

      cy = cytoscape({
        container: containerRef.current,
        elements: [
          ...graph.nodes.map((node) => ({
            data: {
              id: node.id,
              label: node.label,
              type: node.type,
              subtitle: node.subtitle ?? "",
            },
          })),
          ...graph.edges.map((edge) => ({
            data: {
              id: edge.id,
              source: edge.source,
              target: edge.target,
            },
          })),
        ],
        style: [
          {
            selector: "node",
            style: {
              label: "data(label)",
              color: "#e8eef4",
              "font-size": 10,
              "font-family": "var(--font-geist-sans), sans-serif",
              "text-valign": "center",
              "text-halign": "center",
              "text-wrap": "wrap",
              "text-max-width": "86px",
              width: 78,
              height: 78,
              "background-color": "#1a2330",
              "border-width": 2,
              "border-color": "#5b8cff",
              "text-outline-color": "#080b10",
              "text-outline-width": 2,
            },
          },
          ...Object.entries(colors).map(([type, color]) => ({
            selector: `node[type = "${type}"]`,
            style: { "border-color": color, "background-color": "#141b24" },
          })),
          {
            selector: "edge",
            style: {
              width: 1.4,
              "line-color": "#314155",
              "target-arrow-color": "#314155",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier",
              "arrow-scale": 0.8,
            },
          },
        ],
        layout: {
          name: "cose",
          animate: false,
          padding: 24,
          nodeRepulsion: () => 9000,
          idealEdgeLength: () => 92,
          gravity: 0.25,
        },
        minZoom: 0.4,
        maxZoom: 2.2,
      });
    })();

    return () => {
      cancelled = true;
      cy?.destroy();
    };
  }, [graph]);

  if (!graph || graph.nodes.length === 0) {
    return (
      <div className="card flex h-[420px] items-center justify-center p-6 text-sm text-[var(--muted)]">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap gap-3 border-b border-[var(--border)] px-4 py-3 text-xs text-[var(--muted)]">
        {Object.entries(colors).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: color }}
            />
            {type}
          </span>
        ))}
      </div>
      <div ref={containerRef} className="h-[460px] w-full bg-[#0b1016]" />
    </div>
  );
}
