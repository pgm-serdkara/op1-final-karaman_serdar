import prisma from "@/lib/client";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { Role } from "@/app/_generated/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Registreren",
	description: "Maak een account aan voor The Grand Library om boeken te beoordelen en je verlanglijst bij te houden.",
};

export default async function RegisterPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
	async function register(formData: FormData) {
		"use server";

		const email = String(formData.get("email") || "").trim().toLowerCase();
		const password = String(formData.get("password") || "");
		const name = String(formData.get("name") || "").trim();

		const isStudent = email.endsWith("@student.arteveldehs.be");
		const isStaff = email.endsWith("@arteveldehs.be");
		if (!isStudent && !isStaff) {
			redirect("/register?error=Ongeldig e-mailadres. Gebruik je Artevelde (student) adres.");
		}

		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			redirect("/register?error=Er bestaat al een account met dit e-mailadres.");
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const role = isStudent ? Role.USER : Role.ADMIN;

		await prisma.user.create({
			data: { email, name, hashedPassword, role },
		});

		redirect("/signin?registered=1");
	}

		const sp = (await searchParams) || {};
		const error = sp.error;

	return (
		<div className="mx-auto max-w-md p-8">
			<h1 className="text-2xl font-semibold mb-4">Registreren</h1>
			{error ? (
				<p className="mb-4 rounded bg-red-100 p-3 text-red-700">{decodeURIComponent(error)}</p>
			) : null}
			<form className="space-y-4" action={register}>
				<div className="space-y-1">
					<label htmlFor="name" className="block text-sm">Naam</label>
					<input id="name" name="name" type="text" required className="w-full rounded border p-2" />
				</div>
				<div className="space-y-1">
					<label htmlFor="email" className="block text-sm">E-mailadres</label>
					<input id="email" name="email" type="email" required className="w-full rounded border p-2" placeholder="jij@student.arteveldehs.be" />
				</div>
				<div className="space-y-1">
					<label htmlFor="password" className="block text-sm">Wachtwoord</label>
					<input id="password" name="password" type="password" required minLength={8} className="w-full rounded border p-2" />
				</div>
				<button type="submit" className="rounded bg-black px-4 py-2 text-white">Maak account</button>
			</form>
			<p className="mt-4 text-sm text-gray-600">Toegelaten domeinen: @student.arteveldehs.be (student) en @arteveldehs.be (medewerker).</p>
		</div>
	);
}
