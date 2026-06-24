export default function GameCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-surface-border">
      <div className="skeleton aspect-[3/4] w-full" />
      <div className="p-2 bg-surface-card space-y-1.5">
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-2.5 w-1/2 rounded" />
      </div>
    </div>
  )
}
