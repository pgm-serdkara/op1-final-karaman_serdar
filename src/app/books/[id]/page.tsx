import prisma from "@/lib/client";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import RatingBox from "@/components/RatingBox";
import WishlistButton from "@/components/WishlistButton";
import type { Metadata } from "next";
import Image from "next/image";
import BookEditForm from "@/components/BookEditForm";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

interface BookDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const bookId = Number.parseInt(id, 10);
  if (Number.isNaN(bookId)) {
    return { title: "Boek niet gevonden", description: "Ongeldig boek-id." };
  }
  const book = await prisma.book.findUnique({ where: { id: bookId }, select: { title: true, description: true, author: true, genre: true, coverImageUrl: true } });
  if (!book) {
    return { title: "Boek niet gevonden", description: "Het opgevraagde boek bestaat niet." };
  }
  const parts: string[] = [];
  if (book.author) parts.push(book.author);
  if (book.genre) parts.push(book.genre);
  const descriptor = parts.length ? ` – ${parts.join(" | ")}` : "";
  const cover = book.coverImageUrl || null;
  const imageUrl = cover ? (cover.startsWith('http') ? cover : `${process.env.NEXT_PUBLIC_BASE_URL}${cover}`) : null;

  return {
    title: `${book.title}${descriptor}`,
    description: book.description ? book.description.slice(0, 160) : `Details en beoordelingen voor ${book.title} in The Grand Library.`,
    openGraph: {
      title: book.title,
      description: book.description ? book.description.slice(0, 200) : `Bekijk informatie en beoordelingen voor ${book.title}.`,
      type: "article",
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Cover van ${book.title}`,
        },
      ] : undefined,
    },
    twitter: imageUrl ? {
      card: "summary_large_image",
      title: book.title,
      description: book.description ? book.description.slice(0, 200) : `Bekijk informatie en beoordelingen voor ${book.title}.`,
      images: [imageUrl],
    } : undefined,
  };
}

async function updateBook(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const title = String(formData.get("title") || "").trim();
  const author = String(formData.get("author") || "").trim() || null;
  const genre = String(formData.get("genre") || "").trim() || null;
  const publishedYearRaw = String(formData.get("publishedYear") || "").trim();
  const publishedYear = publishedYearRaw ? Number.parseInt(publishedYearRaw, 10) : null;
  let coverImageUrl = String(formData.get("coverImageUrl") || "").trim() || null;
  const coverImageFile = formData.get("coverImageFile") as File | null;

  if (coverImageFile && coverImageFile.size > 0) {
    const buffer = Buffer.from(await coverImageFile.arrayBuffer());
    const filename = `${Date.now()}-${coverImageFile.name.replace(/\s/g, "_")}`;
    try {
      const coversDir = path.join(process.cwd(), "public", "img", "covers");
      await mkdir(coversDir, { recursive: true });
      const targetPath = path.join(coversDir, filename);
      await writeFile(targetPath, buffer);
      coverImageUrl = `/img/covers/${filename}`;
    } catch (error) {
      console.error("Failed to write file:", error);
      throw new Error("Failed to upload cover image.");
    }
  }

  if (!title) {
    throw new Error("Title is required");
  }

  await prisma.book.update({
    where: { id },
    data: {
      title,
      author,
      genre,
      publishedYear: Number.isNaN(publishedYear as number) ? null : publishedYear,
      coverImageUrl,
    },
  });

  redirect(`/books/${id}`);
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  const bookId = Number.parseInt(id, 10);
  if (Number.isNaN(bookId)) return notFound();

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: {
      id: true,
      title: true,
      description: true,
      numberOfPages: true,
      publishedYear: true,
      genre: true,
      author: true,
      publisher: true,
      coverImageUrl: true,
    },
  });

  if (!book) return notFound();

  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  const isAdmin = session?.role === "ADMIN";

  const aggPromise = prisma.rating.aggregate({
    where: { bookId },
    _avg: { value: true },
    _count: { _all: true },
  });

  let userPromise = null;
  if (email) {
    userPromise = prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        ratings: { where: { bookId }, select: { value: true } },
        wishlistItems: { where: { bookId }, select: { bookId: true } },
      },
    });
  }

  const [agg, user] = await Promise.all([aggPromise, userPromise]);

  const { _avg, _count } = agg;
  const currentRating = user?.ratings[0]?.value ?? null;
  const inWishlist = Boolean(user?.wishlistItems[0]);

  async function deleteBook() {
    "use server";
    if (!isAdmin) {
      throw new Error("Not authorized");
    }
  // Eerst relaties opruimen
    await prisma.loan.deleteMany({ where: { bookId } });
    await prisma.rating.deleteMany({ where: { bookId } });
    await prisma.wishlistItem.deleteMany({ where: { bookId } });
    await prisma.book.delete({ where: { id: bookId } });
    redirect("/books");
  }

  return (
    <div className="p-6 space-y-10">
      {/* Bovenaan: cover links, details rechts, knop rechtsboven */}
      <div className="flex gap-8 items-start flex-wrap">
        {/* Cover */}
        <div className="w-56 flex-shrink-0">
          {book.coverImageUrl ? (
            (() => {
              const src = book.coverImageUrl.trim();
              const isLocal = src.startsWith("/");
              return (
                <figure className="relative">
                  {isLocal ? (
                    <Image
                      src={src}
                      alt={`Cover van ${book.title}`}
                      width={360}
                      height={540}
                      className="w-56 h-auto rounded shadow object-cover"
                      priority
                    />
                  ) : (
                    <Image
                      src={src}
                      alt={`Cover van ${book.title}`}
                      width={360}
                      height={540}
                      className="w-56 h-auto rounded shadow object-cover"
                      loading="lazy"
                      unoptimized
                    />
                  )}
                  <figcaption className="mt-2 text-xs text-gray-500">Cover</figcaption>
                </figure>
              );
            })()
          ) : (
            <div className="relative w-56 h-[340px] rounded shadow bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-center p-4">
              <span className="text-sm font-semibold text-gray-200 leading-snug">
                Geen cover<br/>Voeg een URL toe om deze ruimte te gebruiken.
              </span>
            </div>
          )}
        </div>
        {/* Details */}
        <div className="flex-1 min-w-[260px] relative">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-semibold leading-tight pr-4">{book.title}</h1>
            <Link href="/books" className="px-3 py-1 border rounded-[2rem] text-sm hover:bg-gray-50 whitespace-nowrap">Terug naar overzicht</Link>
          </div>
          <div className="grid gap-2 text-sm max-w-2xl">
        <div><span className="font-medium">Titel:</span> {book.title}</div>
        <div><span className="font-medium">Beschrijving:</span> {book.description ?? '-'}</div>
        <div><span className="font-medium">Aantal pagina&apos;s:</span> {book.numberOfPages ?? '-'}</div>
        <div><span className="font-medium">Publicatiejaar:</span> {book.publishedYear ?? '-'}</div>
        <div><span className="font-medium">Genre:</span> {book.genre ?? '-'} </div>
        <div><span className="font-medium">Auteur:</span> {book.author ?? '-'}</div>
        <div><span className="font-medium">Uitgeverij:</span> {book.publisher ?? '-'}</div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Beoordeling</h2>
        {email ? (
          <RatingBox bookId={bookId} initialValue={currentRating} initialAvg={_avg.value} initialCount={_count._all} />
        ) : (
          <div className="text-gray-600">Meld je aan om een rating te geven.</div>
        )}
      </div>

      <div className="mt-4">
        {email ? (
          <WishlistButton bookId={bookId} inWishlist={inWishlist} />
        ) : (
          <div className="text-gray-600">Meld je aan om dit boek op je verlanglijst te zetten.</div>
        )}
      </div>

      {isAdmin && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">Beheer</h2>

          {/* Clientcomponent voor bewerken (met bestandsupload) */}
          <BookEditForm book={book} updateBookAction={updateBook} />

          {/* Verwijderformulier blijft serveractie */}
          <div className="mt-6 max-w-lg">
            <form action={deleteBook} className="flex items-center gap-3">
              <input id="confirmDelete" name="confirmDelete" type="checkbox" required className="h-4 w-4" />
              <label htmlFor="confirmDelete" className="text-sm">Ik bevestig dat ik dit boek wil verwijderen</label>
              <button type="submit" className="bg-red-600 text-white px-3 py-1 rounded-[2rem]">Verwijderen</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
