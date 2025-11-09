import Skeleton from "@/components/Skeleton";

export default function LoadingUsersList() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-7 w-40" />
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-80" />
        ))}
      </div>
    </div>
  );
}
