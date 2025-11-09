import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/client";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mijn verlanglijst",
  description: "Bekijk en beheer je verlanglijst en geleende boeken in The Grand Library.",
};

export const dynamic = "force-dynamic"; // wishlist wijzigt per gebruiker

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!email) {
    return <div className="p-6">Meld je aan om je verlanglijst te bekijken.</div>;
  }
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) {
    return <div className="p-6">Gebruiker niet gevonden.</div>;
  }
  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    include: { book: true },
    orderBy: { createdAt: "desc" },
  });
  const loans = await prisma.loan.findMany({
    where: { userId: user.id, returnedAt: null },
    include: { book: true },
    orderBy: { borrowedAt: "desc" },
  });

  async function renewLoan(formData: FormData) {
    "use server";
    const loanId = Number(String(formData.get("loanId") ?? ""));
    if (!Number.isInteger(loanId) || loanId <= 0) return;

  // Controleer eigenaar en éénmalige verlenging op de server
    const sess = await getServerSession(authOptions);
    const sessEmail = sess?.user?.email ?? null;
    if (!sessEmail) return;
    const u = await prisma.user.findUnique({ where: { email: sessEmail }, select: { id: true } });
    if (!u) return;

    const loan = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan || loan.userId !== u.id || loan.returnedAt || loan.renewed) {
      revalidatePath("/wishlist");
      return;
    }
    const base = loan.dueDate ?? new Date();
    const newDue = new Date(base.getTime() + 21 * 24 * 60 * 60 * 1000);
    await prisma.loan.update({ where: { id: loan.id }, data: { renewed: true, dueDate: newDue } });
    revalidatePath("/wishlist");
  }
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Mijn verlanglijst</h1>
      {items.length === 0 && <div className="text-gray-600">Nog geen boeken toegevoegd.</div>}
      <ul className="list-disc ml-6 space-y-1">
        {items.map(it => (
          <li key={it.id} className="flex items-center gap-2">
            <Link href={`/books/${it.bookId}`} className="text-blue-600 underline">{it.book.title}</Link>
            <form action={async () => {
              "use server";
              await prisma.wishlistItem.deleteMany({ where: { userId: user.id, bookId: it.bookId } });
            }}>
              <button type="submit" className="text-xs text-red-600 hover:underline">Verwijderen</button>
            </form>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Geleende boeken</h2>
        {loans.length === 0 ? (
          <div className="text-gray-600">Geen actieve leningen.</div>
        ) : (
          <ul className="ml-6 space-y-2">
            {loans.map((ln) => (
              <li key={ln.id} className="flex items-center gap-3">
                <Link href={`/books/${ln.bookId}`} className="text-blue-600 underline">{ln.book.title}</Link>
                {ln.dueDate && <span className="text-xs text-gray-600">(terug op {new Date(ln.dueDate).toLocaleDateString()})</span>}
                <form action={renewLoan}>
                  <input type="hidden" name="loanId" value={String(ln.id)} />
                  <button type="submit" className="text-xs px-2 py-1 rounded border bg-amber-50 border-amber-300 hover:bg-amber-100" disabled={ln.renewed}>
                    {ln.renewed ? "Reeds verlengd" : "Verleng 1x"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}