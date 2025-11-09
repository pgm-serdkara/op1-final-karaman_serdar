import prisma from "../../lib/client";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gebruikersbeheer",
    description: "Overzicht van gebruikers voor beheerders in The Grand Library.",
};

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    const users = await prisma.user.findMany({ select: { id: true, email: true, role: true } });

    const admins = users.filter(u => String(u.role) === "ADMIN");
    const others = users.filter(u => String(u.role) !== "ADMIN");

    return (
        <div className="p-6 space-y-6">
            {admins.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold">Admins</h2>
                    <ul className="list-disc ml-6 space-y-1">
                        {admins.map(a => (
                            <li key={a.id}>
                                <Link className="text-blue-600 underline" href={`/users/${a.id}`}>{a.email}</Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <section>
                <h2 className="text-xl font-semibold">Users</h2>
                <ul className="list-disc ml-6 space-y-1">
                    {others.map(u => (
                        <li key={u.id}>
                            <Link className="text-blue-600 underline" href={`/users/${u.id}`}>{u.email}</Link>
                        </li>
                    ))}
                    {users.length === 0 && <li className="text-gray-600">Geen gebruikers gevonden.</li>}
                </ul>
            </section>
        </div>
    );
}