import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/client";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const bookId = Number(body?.bookId);
  const value = Number(body?.value);
  if (!Number.isInteger(bookId) || bookId <= 0) {
    return NextResponse.json({ error: "Ongeldige boek-id" }, { status: 400 });
  }
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return NextResponse.json({ error: "Ongeldige rating" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Onbekende gebruiker" }, { status: 404 });
  }

  await prisma.rating.upsert({
    where: { userId_bookId: { userId: user.id, bookId } },
    create: { userId: user.id, bookId, value },
    update: { value },
  });

  const agg = await prisma.rating.aggregate({
    where: { bookId },
    _avg: { value: true },
    _count: { _all: true },
  });

  return NextResponse.json({ ok: true, avg: agg._avg.value, count: agg._count._all });
}
