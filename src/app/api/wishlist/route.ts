import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/client";

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!email) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) {
    return NextResponse.json({ error: "Gebruiker niet gevonden" }, { status: 404 });
  }
  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    include: { book: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!email) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const bookId = Number(body?.bookId);
  if (!Number.isInteger(bookId) || bookId <= 0) {
    return NextResponse.json({ error: "Ongeldige boek-id" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) {
    return NextResponse.json({ error: "Gebruiker niet gevonden" }, { status: 404 });
  }
  try {
    await prisma.wishlistItem.create({ data: { userId: user.id, bookId } });
  } catch (e) {
    // Prisma-unique constraint (code P2002)
    if (typeof e === "object" && e && "code" in e && (e as { code?: string }).code === "P2002") {
      return NextResponse.json({ ok: true, already: true });
    }
    return NextResponse.json({ error: "Kon niet toevoegen" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
