import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/client";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ loanId: string }> }) {
  const p = await params;
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  const role = session?.role as undefined | "USER" | "ADMIN";
  if (!email) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const loanId = Number(p.loanId);
  if (!Number.isInteger(loanId) || loanId <= 0) {
    return NextResponse.json({ error: "Ongeldige lening-id" }, { status: 400 });
  }

  const loan = await prisma.loan.findUnique({ where: { id: loanId } });
  if (!loan) {
    return NextResponse.json({ error: "Lening niet gevonden" }, { status: 404 });
  }

  // Controleer eigenaar of admin
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "Gebruiker niet gevonden" }, { status: 404 });
  const isOwner = loan.userId === user.id;
  const isAdmin = role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }

  if (loan.returnedAt) {
    return NextResponse.json({ error: "Lening is al teruggebracht" }, { status: 400 });
  }
  if (loan.renewed) {
    return NextResponse.json({ error: "Lening is al verlengd" }, { status: 400 });
  }

  const base = loan.dueDate ?? new Date();
  const newDue = new Date(base.getTime() + 21 * 24 * 60 * 60 * 1000); // verleng met 21 dagen

  await prisma.loan.update({ where: { id: loan.id }, data: { renewed: true, dueDate: newDue } });

  return NextResponse.json({ ok: true, dueDate: newDue.toISOString() });
}
