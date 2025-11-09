import Skeleton from "@/components/Skeleton";

export default function LoadingWishlist() {
  return (
    <div className="p-6 space-y-6">
    <Skeleton className="h-8 w-56" />
      <ul className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-center gap-2">
            <Skeleton className="h-5 w-72" />
            <Skeleton className="h-5 w-20" />
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Skeleton className="h-6 w-48 mb-2" />
        <ul className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-7 w-28" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
