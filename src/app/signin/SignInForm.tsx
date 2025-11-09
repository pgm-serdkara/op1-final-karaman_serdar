"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignInForm() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const callbackUrl = params.get("callbackUrl") || "/";

    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    setLoading(false);
    if (!res || res.error) {
      setError("Ongeldige inloggegevens");
      return;
    }
    window.location.href = callbackUrl;
  }

  return (
    <>
      {error ? <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p> : null}
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm">E-mailadres</label>
          <input id="email" name="email" type="email" required className="w-full rounded border p-2" />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm">Wachtwoord</label>
          <input id="password" name="password" type="password" required className="w-full rounded border p-2" />
        </div>
        <button type="submit" disabled={loading} className="rounded-[2rem] bg-black px-6 py-2 text-white disabled:opacity-60">
          {loading ? "Aanmelden..." : "Aanmelden"}
        </button>
      </form>
    </>
  );
}