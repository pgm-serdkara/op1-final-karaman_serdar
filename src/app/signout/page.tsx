import type { Metadata } from "next";
import SignOutContent from "./SignOutContent";

export const metadata: Metadata = {
  title: "Afmelden",
  description: "Meld je af bij The Grand Library.",
};

export default function SignOutPage() {
  return (
    <div className="mx-auto max-w-md p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Afmelden</h1>
      <p>Je staat op het punt om af te melden.</p>
      <SignOutContent />
    </div>
  );
}
