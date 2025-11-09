import Skeleton from "@/components/Skeleton";

export default function LoadingSignin() {
  return (
    <div className="mx-auto max-w-md p-8 space-y-6">
    <Skeleton className="h-8 w-56" />
    <Skeleton className="h-12 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-40" />
    </div>
  );
}
