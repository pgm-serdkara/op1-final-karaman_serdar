"use client";

import { useState, useTransition } from "react";

type Props = {
  bookId: number;
  inWishlist: boolean;
};

export default function WishlistButton({ bookId, inWishlist }: Props) {
  const [isInList, setIsInList] = useState<boolean>(inWishlist);
  const [pending, startTransition] = useTransition();

  async function add() {
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bookId }),
    });
    if (res.ok) setIsInList(true);
  }

  async function remove() {
    const res = await fetch(`/api/wishlist/${bookId}`, { method: "DELETE" });
    if (res.ok) setIsInList(false);
  }

  return (
    <button
      onClick={() => startTransition(() => (isInList ? remove() : add()))}
      className={`px-3 py-1 rounded-[2rem] border ${isInList ? "bg-amber-100 border-amber-400" : "bg-white"}`}
      disabled={pending}
      aria-busy={pending}
    >
      {isInList ? "Verwijderen uit verlanglijst" : "Zet op verlanglijst"}
    </button>
  );
}
