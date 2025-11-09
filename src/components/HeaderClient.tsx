"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@radix-ui/themes";

type Props = {
  isAuthed: boolean;
  email: string;
  isAdmin: boolean;
};

export default function HeaderClient({ isAuthed, email, isAdmin }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const target = e.target as Node;
      if (!open) return;
      if (menuRef.current && !menuRef.current.contains(target) && btnRef.current && !btnRef.current.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">
          <Link href="/books">The Grand Library</Link>
        </h1>
        <Link href="/about" className="hidden sm:inline-block px-3 py-1.5 rounded-full hover:bg-gray-100">
          Over
        </Link>
      </div>

  {/* Desktop: volledige controls; mobiel: hamburger */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-3">
          {!isAuthed && (
            <Button style={{ borderRadius: '2rem' }} color="blue" asChild>
              <Link href="/register">Registreren</Link>
            </Button>
          )}
          {!isAuthed && (
            <Button style={{ borderRadius: '2rem' }} color="blue" variant="soft" asChild>
              <Link href="/signin">Aanmelden</Link>
            </Button>
          )}
          {isAuthed && (
            <Button style={{ borderRadius: '2rem' }} color="blue" variant="soft" disabled>
              {email}
            </Button>
          )}
          {isAuthed && (
            <Button style={{ borderRadius: '2rem' }} color="blue" variant="outline" asChild>
              <Link href="/signout">Afmelden</Link>
            </Button>
          )}
          {isAuthed && (
            <Button style={{ borderRadius: '2rem' }} color="blue" asChild>
              <Link href="/wishlist">Verlanglijst</Link>
            </Button>
          )}
          {isAdmin && (
            <Button style={{ borderRadius: '2rem' }} color="blue" asChild>
              <Link href="/users">Gebruikers</Link>
            </Button>
          )}
        </div>

  {/* Mobiel menu zonder Home/Over */}
        <div className="md:hidden relative">
          <button
            ref={btnRef}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((s) => !s)}
            className="p-2 rounded-md hover:bg-gray-100"
            title="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {open && (
            <div
              id="mobile-menu"
              ref={menuRef}
              className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 z-50"
              role="menu"
            >
              {!isAuthed && (
                <Link href="/register" className="block px-4 py-2 text-blue-600 hover:bg-blue-50" role="menuitem" onClick={() => setOpen(false)}>
                  Registreren
                </Link>
              )}
              {!isAuthed && (
                <Link href="/signin" className="block px-4 py-2 text-blue-600 hover:bg-blue-50" role="menuitem" onClick={() => setOpen(false)}>
                  Aanmelden
                </Link>
              )}
              {isAuthed && (
                <div className="block px-4 py-2 text-sm text-gray-700" role="menuitem">
                  {email}
                </div>
              )}
              {isAuthed && (
                <Link href="/signout" className="block px-4 py-2 text-blue-600 hover:bg-blue-50" role="menuitem" onClick={() => setOpen(false)}>
                  Afmelden
                </Link>
              )}
              {isAuthed && (
                <Link href="/wishlist" className="block px-4 py-2 text-blue-600 hover:bg-blue-50" role="menuitem" onClick={() => setOpen(false)}>
                  Verlanglijst
                </Link>
              )}
              {isAdmin && (
                <Link href="/users" className="block px-4 py-2 text-blue-600 hover:bg-blue-50" role="menuitem" onClick={() => setOpen(false)}>
                  Gebruikers
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
