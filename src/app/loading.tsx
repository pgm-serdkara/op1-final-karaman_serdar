import Skeleton from "@/components/Skeleton";

export default function LoadingRoot() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-80" />
    </div>
  );
}
