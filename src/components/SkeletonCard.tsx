import { Card, CardContent } from '@/components/ui/card';

export function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <div className="h-44 skeleton-shimmer" />
      <CardContent className="p-4">
        <div className="h-5 rounded skeleton-shimmer mb-2" />
        <div className="h-3 rounded skeleton-shimmer w-1/2 mb-3" />
        <div className="h-4 rounded skeleton-shimmer mb-1" />
        <div className="h-4 rounded skeleton-shimmer w-3/4 mb-3" />
        <div className="flex items-center justify-between">
          <div className="h-6 rounded skeleton-shimmer w-20" />
          <div className="h-9 rounded skeleton-shimmer w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
