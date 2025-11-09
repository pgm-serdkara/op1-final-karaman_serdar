import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toegang geweigerd",
  description: "Je hebt onvoldoende rechten om deze pagina te bekijken.",
};

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-xl p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Toegang geweigerd</h1>
      <p>Je hebt onvoldoende rechten om deze pagina te bekijken.</p>
      <div className="flex flex-wrap gap-3">
        <Link className="px-3 py-1 rounded border" href="/books">Terug naar overzicht</Link>
        <Link className="px-3 py-1 rounded border" href="/signin">Aanmelden</Link>
      </div>
    </div>
  );
}
