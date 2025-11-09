import Skeleton from "@/components/Skeleton";

export default function LoadingBookNew() {
  return (
    <div className="p-6 space-y-6">
    <Skeleton className="h-8 w-64" />
      {[
        "Titel",
        "Beschrijving",
        "Aantal pagina's",
        "Publicatiejaar",
        "Genre",
        "Auteur",
        "Uitgeverij",
        "Coverafbeelding URL",
      ].map((label, i) => (
        <div key={i} className="flex flex-col gap-1 max-w-md">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <div className="flex gap-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
}
