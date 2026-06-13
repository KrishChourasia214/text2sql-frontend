export default function SkeletonLoader() {
  return (
    <div className="space-y-6">
      {/* SQL skeleton */}
      <div className="rounded-[10px] bg-sql-bg border border-border p-5 space-y-3">
        <div className="skeleton-line h-3 w-24 mb-4" />
        <div className="skeleton-line h-3.5 w-[85%]" />
        <div className="skeleton-line h-3.5 w-[65%]" />
        <div className="skeleton-line h-3.5 w-[45%]" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-[10px] bg-surface border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60">
          <div className="skeleton-line h-3 w-16" />
          <div className="skeleton-line h-3 w-12" />
        </div>
        {/* Header row */}
        <div className="flex gap-4 px-4 py-3 border-b border-border/40">
          <div className="skeleton-line h-2.5 w-12 shrink-0" />
          <div className="skeleton-line h-2.5 w-24 shrink-0" />
          <div className="skeleton-line h-2.5 w-20 shrink-0" />
          <div className="skeleton-line h-2.5 w-16 shrink-0" />
        </div>
        {/* Data rows */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`flex gap-4 px-4 py-3 ${i % 2 === 0 ? 'row-even' : 'row-odd'}`}
          >
            <div className="skeleton-line h-3 w-8 shrink-0" />
            <div className="skeleton-line h-3 w-28 shrink-0" />
            <div className="skeleton-line h-3 w-16 shrink-0" />
            <div className="skeleton-line h-3 w-14 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
