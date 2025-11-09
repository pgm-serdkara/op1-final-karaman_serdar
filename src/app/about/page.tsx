import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Over het project",
  description: "Leer meer over The Grand Library: functionaliteiten, rollen, gebruikte technologieën en de maker.",
};

export const dynamic = "force-dynamic"; 

export default function AboutPage() {
  return (
    <div className="p-6 space-y-8">
  <section className="about-highlights">
        <figure className="about-image-card relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          <Image
            src="/img/library_books.webp"
            alt="Library books"
            width={1920}
            height={600}
            sizes="100vw"
            className="w-screen max-w-none h-auto object-cover"
            priority
          />
        </figure>
      </section>
      
      <header>
        <h1 className="text-3xl font-semibold">Over dit project</h1>
        <p className="text-gray-700 mt-2 max-w-2xl">
          Dit is een kleine bibliotheek-app gebouwd als eindopdracht. Je kunt boeken doorzoeken, beoordelen,
          aan uw verlanglijst toevoegen en als admin; ook boeken en gebruikers beheren en boeken uitlenen.
        </p>
      </header>

     <section className="space-y-2">
        <h2 className="text-xl font-semibold">Hoe te gebruiken</h2>
        <ul className="list-disc ml-6 space-y-1 text-gray-800">
          <li>Navigeer naar de homepage door op <Link className="text-blue-600 underline" href="/books">The Grand Library</Link> te klikken om te bladeren en te zoeken door de boekencollectie.</li>
          <li>Meld je aan of registreer om de verlanglijst en ratings te gebruiken.</li>
          <li>Admins kunnen boeken toevoegen via de “Boek toevoegen” knop bij de zoekbalk op de boekenlijst.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Functionaliteiten</h2>
        <ul className="list-disc ml-6 space-y-1 text-gray-800">
          <li>
            Boeken ontdekken: zoeken op titel/auteur, filteren op genre, ratings bekijken. Ga naar <Link className="text-blue-600 underline" href="/books">/books</Link>.
          </li>
          <li>
            Beoordelingen: ingelogde gebruikers kunnen (1–5) sterren geven; gemiddelde en aantal ratings worden live berekend.
          </li>
          <li>
            Verlanglijst: boeken toevoegen/verwijderen. Ga naar <Link className="text-blue-600 underline" href="/wishlist">/wishlist</Link> om je eigen lijst te zien.
          </li>
          <li>
            Uitlenen (admin): vanuit de gebruikersdetailpagina kan een admin boeken uit iemands verlanglijst uitlenen; het item verhuist dan naar “Geleende boeken”.
          </li>
          <li>
            Verlengen (user): de lener kan een actieve lening éénmalig verlengen vanaf de verlanglijstpagina.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Rollen en toegang</h2>
        <ul className="list-disc ml-6 space-y-1 text-gray-800">
          <li>Niet ingelogde gebruiker: boeken bekijken/zoeken.</li>
          <li>Ingelogde student: verlanglijst beheren, ratings plaatsen, eigen leningen 1x verlengen.</li>
          <li>Ingelogde medewerker: boeken en gebruikers beheren, uitlenen/terugnemen; kan elke gebruikersdetailpagina openen.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Technologieën</h2>
        <ul className="list-disc ml-6 space-y-1 text-gray-800">
          <li>Next.js app router</li>
          <li>Prisma + SQLite</li>
          <li>NextAuth (Credentials) voor authenticatie en role‑based toegang</li>
          <li>Radix UI + eenvoudige Tailwind‑achtige utility classes voor styling</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Over mij</h2>
        <p className="text-gray-700 max-w-2xl">
          Ik ben Serdar Karaman. Ik bouw graag full‑stack webapplicaties en heb in dit project vooral bijgeleerd over Next.js,
          server actions, authenticatie en Prisma database-beheer.
        </p>
      </section>

      <section className="about-highlights">
        <figure className="about-image-card">
            <Image
              src="/img/serdar.webp"
              alt="Serdar Karaman"
              width={160}
              height={160}
              className="w-40 h-40 rounded-full object-cover mx-auto"
              loading="lazy"
            />
        </figure>
      </section>
    </div>
  );
}
