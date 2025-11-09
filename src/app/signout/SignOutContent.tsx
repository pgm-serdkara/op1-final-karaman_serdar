"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function SignOutContent() {
  const [signedOut, setSignedOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setError(null);
    try {
      // Afmelden zonder directe navigatie zodat de bevestigingsbanner zichtbaar blijft
      await signOut({ redirect: false });
      setSignedOut(true);
      // Navigeer na korte vertraging naar home (niet-blokkerende UX)
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch {
      setError("Kon niet afmelden. Probeer opnieuw.");
    }
  }

  return (
    <div className="space-y-4">
      {signedOut && (
        <div
          role="status"
          aria-live="polite"
          className="p-3 border rounded bg-green-50 text-green-800 flex items-start justify-between gap-4"
        >
          <span>Je bent afgemeld.</span>
          <button
            type="button"
            onClick={() => setSignedOut(false)}
            aria-label="Sluit melding"
            className="text-green-900/70 hover:text-green-900 focus:outline-none"
          >
            ×
          </button>
        </div>
      )}
      {error && (
        <div className="p-3 border rounded bg-red-50 text-red-800" role="alert">{error}</div>
      )}
      {!signedOut && (
        <button
          className="rounded bg-black px-4 py-2 text-white"
          onClick={handleSignOut}
        >
          Afmelden
        </button>
      )}
    </div>
  );
}