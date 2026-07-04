import { Card, CardContent } from '@/components/ui/card';

export function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <div className="h-44 bg-muted animate-pulse" />
      <CardContent className="p-4">
        <div className="h-5 bg-muted rounded animate-pulse mb-2" />
        <div className="h-3 bg-muted rounded animate-pulse w-1/2 mb-3" />
        <div className="h-4 bg-muted rounded animate-pulse mb-1" />
        <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-3" />
        <div className="flex items-center justify-between">
          <div className="h-6 bg-muted rounded animate-pulse w-20" />
          <div className="h-9 bg-muted rounded animate-pulse w-24" />
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
