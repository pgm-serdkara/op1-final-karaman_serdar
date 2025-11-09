"use client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

interface BooksFiltersProps {
  initial: { q: string; genre: string; pageSize: number };
  genres: string[];
  isAdmin: boolean;
  maxWidthPx?: number;
}

export default function BooksFilters({ initial, genres, isAdmin, maxWidthPx }: BooksFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(initial.q);
  const [isPending, startTransition] = useTransition();

  const buildParamsString = useCallback((overrides: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (q.trim()) {
      params.set("q", q.trim());
    } else {
      params.delete("q");
    }

    Object.entries(overrides).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    params.set("page", "1");
    return `${pathname}?${params.toString()}`;
  }, [searchParams, pathname, q]);

  const persistFilters = (data: { genre?: string; pageSize?: string | number }) => {
    try {
      if (data.genre !== undefined) {
        if (data.genre === "") {
          // Kies "Alle genres": cookie wissen
          document.cookie = `books_genre=; path=/; max-age=0`;
        } else {
          document.cookie = `books_genre=${encodeURIComponent(data.genre)}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 dagen
        }
      }
      if (data.pageSize !== undefined) {
        document.cookie = `books_pageSize=${encodeURIComponent(String(data.pageSize))}; path=/; max-age=${60 * 60 * 24 * 30}`;
      }
    } catch { /* negeren */ }
  };

  const instantNavigate = useCallback((overrides: Record<string, string | number | undefined>) => {
    persistFilters({
      genre: overrides.genre !== undefined ? String(overrides.genre) : undefined,
      pageSize: overrides.pageSize !== undefined ? overrides.pageSize : undefined,
    });
    const target = buildParamsString(overrides);
    startTransition(() => {
      router.replace(target, { scroll: false });
    });
  }, [buildParamsString, router, startTransition]);

  const onGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const raw = e.target.value;
    const value = raw || undefined;
    if (!raw) {
      persistFilters({ genre: "" });
    }
    instantNavigate({ genre: value });
  };

  const onPageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    instantNavigate({ pageSize: value });
  };

  // Debounce live zoekveld
  useEffect(() => {
    const currentQ = (searchParams.get("q") ?? "").trim();
    const nextQ = q.trim();
    if (currentQ === nextQ) return;
    const id = setTimeout(() => {
      instantNavigate({});
    }, 100);
    return () => clearTimeout(id);
  }, [q, searchParams, instantNavigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-wrap items-center gap-2 mb-6 mt-6 border border-transparent rounded-[1rem] bg-white shadow-xl hover:shadow-lg transition-shadow duration-200 p-3 w-full"
      style={{ maxWidth: maxWidthPx ? `${maxWidthPx}px` : undefined }}
      aria-busy={isPending}
    >
      <input
        type="text"
        name="q"
        placeholder="Zoek op titel of auteur..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="border rounded-[2rem] px-2 py-1 bg-gray-100"
      />
      <select
        name="genre"
        value={(searchParams.get("genre") ?? initial.genre ?? "")}
        onChange={onGenreChange}
        className="border-none rounded-[2rem] px-2 py-1 bg-gray-100"
        aria-label="Filter op genre"
      >
        <option value="">Alle genres</option>
        {genres.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
      <select
        name="pageSize"
        value={String(searchParams.get("pageSize") ?? initial.pageSize)}
        onChange={onPageSizeChange}
        className="border-none rounded-[2rem] px-2 py-1 bg-gray-100"
        aria-label="Aantal boeken per pagina"
      >
        {[5,10,20,30,50].map(sz => (
          <option key={sz} value={sz}>{sz}/pagina</option>
        ))}
      </select>
      {isAdmin && (
        <div className="ml-auto">
          <Button style={{ borderRadius: '2rem' }} color="blue" asChild>
            <Link href="/books/new">Boek toevoegen</Link>
          </Button>
        </div>
      )}
    </form>
  );
}
