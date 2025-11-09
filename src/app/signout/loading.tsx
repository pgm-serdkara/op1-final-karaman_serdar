import Skeleton from "@/components/Skeleton";

export default function LoadingSignout() {
  return (
    <div className="mx-auto max-w-md p-8 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-5 w-72" />
      <Skeleton className="h-10 w-40" />
    </div>
  );
}
