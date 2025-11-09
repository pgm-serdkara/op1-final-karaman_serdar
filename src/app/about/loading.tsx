import Skeleton from "@/components/Skeleton";

export default function LoadingAbout() {
  return (
    <div className="p-6 space-y-8">
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <Skeleton className="h-[260px] w-screen" />
      </div>

      <div>
        <Skeleton className="h-9 w-72 mb-3" />
        <Skeleton className="h-5 w-[640px] mb-1" />
        <Skeleton className="h-5 w-[560px]" />
      </div>

      <section className="space-y-3">
        <Skeleton className="h-7 w-56" />
        <ul className="space-y-2 ml-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i}><Skeleton className="h-5 w-[620px]" /></li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <Skeleton className="h-7 w-64" />
        <ul className="space-y-2 ml-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i}><Skeleton className="h-5 w-[600px]" /></li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <Skeleton className="h-7 w-56" />
        <ul className="space-y-2 ml-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i}><Skeleton className="h-5 w-[520px]" /></li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <Skeleton className="h-7 w-52" />
        <ul className="space-y-2 ml-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i}><Skeleton className="h-5 w-[360px]" /></li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-5 w-[560px]" />
        <Skeleton className="h-5 w-[480px]" />
      </section>

      <div className="flex justify-center">
        <Skeleton className="h-40 w-40 rounded-full" />
      </div>
    </div>
  );
}
