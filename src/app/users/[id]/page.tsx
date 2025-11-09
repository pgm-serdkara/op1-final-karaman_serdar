import prisma from "@/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = await params;
  const id = p.id;
  const user = await prisma.user.findUnique({ where: { id }, select: { email: true, role: true } });
  if (!user) {
    return {
      title: "Gebruiker niet gevonden",
      description: "De opgevraagde gebruiker bestaat niet in The Grand Library.",
    };
  }
  return {
    title: `Gebruiker: ${user.email}`,
    description: `Detailpagina voor ${user.email} (${String(user.role).toLowerCase()}) in The Grand Library`,
  };
}

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const id = p.id;

  const session = await getServerSession(authOptions);
  const isAdmin = session?.role === "ADMIN";
  const sessionUserId = (session && typeof session === "object" && "user" in session
    ? (session.user as { id?: string } | undefined)?.id
    : undefined);

  if (!isAdmin && (!sessionUserId || sessionUserId !== id)) {
    redirect("/403");
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      email: true,
      role: true,
      wishlistItems: { include: { book: true }, orderBy: { createdAt: "desc" } },
      loans: { where: { returnedAt: null }, include: { book: true }, orderBy: { borrowedAt: "desc" } },
    },
  });
  if (!user) return notFound();

  async function loanFromWishlist(formData: FormData) {
    "use server";
    const sess = await getServerSession(authOptions);
    if (sess?.role !== "ADMIN") {
      redirect("/403");
    }
    const bookIdStr = String(formData.get("bookId") ?? "").trim();
    const bookId = Number.parseInt(bookIdStr, 10);
    if (!Number.isInteger(bookId) || bookId <= 0) {
      throw new Error("Ongeldige boek-id");
    }
    const existingLoan = await prisma.loan.findFirst({ where: { userId: id, bookId, returnedAt: null } });
    if (existingLoan) {
      revalidatePath(`/users/${id}`);
      return;
    }
    const dueDate = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);
    await prisma.$transaction([
      prisma.wishlistItem.deleteMany({ where: { userId: id, bookId } }),
      prisma.loan.create({ data: { userId: id, bookId, borrowedAt: new Date(), dueDate, renewed: false } }),
    ]);
    revalidatePath(`/users/${id}`);
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Gebruiker</h1>
        <div className="text-gray-700">{user.email} <span className="ml-2 text-xs">({String(user.role).toLowerCase()})</span></div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2">Verlanglijst</h2>
        {user.wishlistItems.length === 0 ? (
          <div className="text-gray-600">Nog geen boeken op de verlanglijst.</div>
        ) : (
          <ul className="ml-0 space-y-2">
            {user.wishlistItems.map((it) => (
              <li key={it.id} className="flex items-center gap-3">
                <Link href={`/books/${it.bookId}`} className="text-blue-600 underline">{it.book.title}</Link>
                {isAdmin && (
                  <form action={loanFromWishlist} className="inline">
                    <input type="hidden" name="bookId" value={String(it.bookId)} />
                    <button type="submit" className="text-xs px-2 py-1 rounded border bg-emerald-50 border-emerald-300 hover:bg-emerald-100">Uitlenen</button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Geleende boeken</h2>
        {user.loans.length === 0 ? (
          <div className="text-gray-600">Geen actieve leningen.</div>
        ) : (
          <ul className="list-disc ml-6 space-y-1">
            {user.loans.map((ln) => (
              <li key={ln.id}>
                <Link href={`/books/${ln.bookId}`} className="text-blue-600 underline">{ln.book.title}</Link>
                {ln.dueDate && (
                  <span className="ml-2 text-xs text-gray-600">
                    (terug op {new Date(ln.dueDate).toLocaleDateString()})
                  </span>
                )}
                {ln.renewed && (
                  <span className="ml-2 text-[10px] uppercase tracking-wide text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded">
                    verlengd
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
