export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="mb-3 h-4 w-36 animate-pulse rounded bg-muted" />
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
