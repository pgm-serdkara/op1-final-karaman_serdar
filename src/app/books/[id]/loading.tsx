import Skeleton from "@/components/Skeleton";

export default function LoadingBookDetail() {
  return (
    <div className="p-6 space-y-10">
      <div className="flex gap-8 items-start flex-wrap">
        <div className="w-56 flex-shrink-0">
          <Skeleton className="w-56 h-[340px]" />
        </div>
        <div className="flex-1 min-w-[260px]">
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="h-8 w-[360px]" />
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="grid gap-2 max-w-2xl">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </div>
      </div>

      <div>
        <Skeleton className="h-6 w-44 mb-2" />
        <Skeleton className="h-16 w-[420px]" />
      </div>

      <div>
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div>
        <Skeleton className="h-6 w-36 mb-3" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="max-w-lg mb-3">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="mt-6 flex items-center gap-3 max-w-lg">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-80" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </div>
  );
}
