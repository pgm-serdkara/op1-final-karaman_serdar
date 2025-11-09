import type { Metadata } from "next";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "Aanmelden",
  description: "Meld je aan bij The Grand Library om boeken te beoordelen en je verlanglijst te beheren.",
};

export default async function SignInPage({ searchParams }: { searchParams?: Promise<{ registered?: string }> }) {
  const sp = (await searchParams) || {};
  const registered = sp.registered;
  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-semibold mb-4">Aanmelden</h1>
      {registered ? (
        <p className="mb-4 rounded bg-green-100 p-3 text-green-700">Registratie geslaagd. Je kan nu aanmelden.</p>
      ) : null}
      <SignInForm />
    </div>
  );
}
