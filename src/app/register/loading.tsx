import Skeleton from "@/components/Skeleton";

export default function LoadingRegister() {
  return (
    <div className="mx-auto max-w-md p-8 space-y-6">
      <Skeleton className="h-8 w-64" />
  {/* Optioneel foutbericht */}
      <Skeleton className="h-12 w-full" />
  {/* Formvelden: naam, e-mail, wachtwoord */}
      {['Naam','E-mailadres','Wachtwoord'].map((_, i) => (
        <div key={i} className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-40" />
  {/* Notitietekst */}
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  );
}
