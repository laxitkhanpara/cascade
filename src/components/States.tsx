"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function LoadingState({ label = "Loading graph…" }: { label?: string }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="card flex min-h-48 flex-col items-start justify-center p-8">
      <p className="text-lg font-medium text-white">{title}</p>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
        {body}
      </p>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="card border-[var(--danger)]/40 p-6">
      <p className="text-sm tracking-[0.16em] text-[var(--danger)] uppercase">
        Database unreachable
      </p>
      <p className="mt-2 text-white">{message}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Check COGNODB_URI and COGNODB_PASSWORD, then confirm the CognoDB instance
        is still running.
      </p>
      {onRetry ? (
        <button type="button" className="btn-secondary mt-4" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}
