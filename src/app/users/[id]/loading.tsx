import Skeleton from "@/components/Skeleton";

export default function LoadingUserDetail() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <Skeleton className="h-8 w-52 mb-2" />
        <Skeleton className="h-5 w-72" />
      </div>
      <section>
        <Skeleton className="h-6 w-40 mb-3" />
        <ul className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-6 w-20" />
            </li>
          ))}
        </ul>
      </section>
      <section>
        <Skeleton className="h-6 w-48 mb-3" />
        <ul className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-60" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-24" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
