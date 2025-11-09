import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/client";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ bookId: string }> }) {
  const p = await params;
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!email) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }
  const bookIdNum = Number(p.bookId);
  if (!Number.isInteger(bookIdNum) || bookIdNum <= 0) {
    return NextResponse.json({ error: "Ongeldige boek-id" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) {
    return NextResponse.json({ error: "Gebruiker niet gevonden" }, { status: 404 });
  }
  await prisma.wishlistItem.deleteMany({ where: { userId: user.id, bookId: bookIdNum } });
  return NextResponse.json({ ok: true });
}
