import prisma from "@/lib/client";
import type { Book, Prisma } from "@/app/_generated/prisma";
import Link from "next/link";
import Image from "next/image";
import { Container, Button, Flex, Text } from "@radix-ui/themes";
import StarDisplay from "@/components/StarDisplay";
import DeletedBanner from "@/components/DeletedBanner";
import BooksFilters from "../../components/BooksFilters";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boekenoverzicht",
  description: "Blader door alle boeken, filter op genre en bekijk gemiddelde ratings in The Grand Library.",
};

export const dynamic = "force-dynamic"; // houd data vers tijdens ontwikkeling

function parseIntOrDefault(value: string | null, def: number) {
  const n = value ? parseInt(value, 10) : NaN;
  return Number.isNaN(n) ? def : n;
}

interface BooksPageProps {
  searchParams?: Promise<{
    page?: string;
    q?: string;
    genre?: string;
    pageSize?: string;
    deleted?: string;
  }>
}
import { cookies } from "next/headers";

const COLUMN_WIDTHS = {
  cover: 96,
  title: 320,
  author: 200,
  genre: 200,
  year: 70,
  rating: 250,
} as const;
const TABLE_WIDTH_PX = (Object.values(COLUMN_WIDTHS) as number[]).reduce((acc, value) => acc + value, 0);

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.role === "ADMIN";
  const params = (await searchParams) || {};
  const cookieStore = await cookies();
  const cookieGenre = (cookieStore.get("books_genre")?.value ?? "").trim();
  const cookiePageSizeStr = cookieStore.get("books_pageSize")?.value ?? null;

  const page = Math.max(1, parseIntOrDefault(params.page ?? null, 1));
  const resolvedPageSize = params.pageSize ?? cookiePageSizeStr;
  const pageSize = Math.min(50, Math.max(1, parseIntOrDefault(resolvedPageSize ?? null, 10)));
  const skip = (page - 1) * pageSize;
  const q = params.q?.trim() || "";
  const genre = (params.genre ?? cookieGenre)?.trim() || "";

  // Bouw where zonder lege objecten (voorkomt Prisma-fouten)
  const where: Prisma.BookWhereInput = {};
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { author: { contains: q } }
    ];
  }
  if (genre) {
    where.genre = { equals: genre };
  }

  const [total, books] = await Promise.all([
    prisma.book.count({ where }),
    prisma.book.findMany({ where, skip, take: pageSize, orderBy: { id: "desc" } }),
  ]);

  // Haal gemiddelden voor alle getoonde boeken op
  const bookIds = books.map(b => b.id);
  const ratingGroups = bookIds.length
    ? await prisma.rating.groupBy({
        by: ["bookId"],
        where: { bookId: { in: bookIds } },
        _avg: { value: true },
        _count: { _all: true },
      })
    : [];
  const ratingMap = new Map<number, { avg: number | null; count: number }>();
  for (const g of ratingGroups) {
    ratingMap.set(g.bookId, { avg: g._avg.value, count: g._count._all });
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const buildQuery = (overrides: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (genre) sp.set("genre", genre);
    sp.set("pageSize", pageSize.toString());
    const newPage = overrides.page ?? page;
    Object.entries(overrides).forEach(([k,v]) => {
      if (v === undefined) return;
  if (k === "page") return; // apart afhandelen
      sp.set(k, String(v));
    });
    sp.set("page", String(newPage));
    return `?${sp.toString()}`;
  };

  const genres = await prisma.book.findMany({
    select: { genre: true },
    where: { genre: { not: null } },
    distinct: ["genre"],
    orderBy: { genre: "asc" }
  });

  const showDeleted = params.deleted === "1";

  return (
    <Container
      size="4"
      px={{ initial: "4", sm: "6" }}
      py="5"
      className="mx-auto w-full"
      style={{ maxWidth: `${TABLE_WIDTH_PX}px` }}
    >
        <h1 className="text-2xl font-semibold mt-10">Boeken</h1>
      <DeletedBanner initialShow={showDeleted} />

      <BooksFilters
        initial={{ q, genre, pageSize }}
        genres={genres.filter((g: { genre: string | null }) => g.genre).map((g: { genre: string | null }) => g.genre!)}
        isAdmin={isAdmin}
        maxWidthPx={TABLE_WIDTH_PX}
      />

      <div
        className="border border-transparent rounded-[1rem] overflow-hidden mb-6 shadow-xl hover:shadow-lg transition-shadow duration-200 bg-white"
        style={{ width: "100%", maxWidth: `${TABLE_WIDTH_PX}px` }}
      >
        <table
          className="text-sm table-fixed"
          style={{ width: "100%", maxWidth: `${TABLE_WIDTH_PX}px` }}
        >
          <colgroup>
            <col style={{ width: COLUMN_WIDTHS.cover }} />
            <col style={{ width: COLUMN_WIDTHS.title }} />
            <col style={{ width: COLUMN_WIDTHS.author }} />
            <col style={{ width: COLUMN_WIDTHS.genre }} />
            <col style={{ width: COLUMN_WIDTHS.year }} />
            <col style={{ width: COLUMN_WIDTHS.rating }} />
          </colgroup>
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-3 py-2" style={{ width: COLUMN_WIDTHS.cover }}>Cover</th>
              <th className="text-left px-3 py-2" style={{ width: COLUMN_WIDTHS.title }}>Titel</th>
              <th className="text-left px-3 py-2" style={{ width: COLUMN_WIDTHS.author }}>Auteur</th>
              <th className="text-left px-3 py-2" style={{ width: COLUMN_WIDTHS.genre }}>Genre</th>
              <th className="text-left px-3 py-2" style={{ width: COLUMN_WIDTHS.year }}>Jaar</th>
              <th className="text-left px-3 py-2" style={{ width: COLUMN_WIDTHS.rating }}>Rating</th>
              {/* Losse tekstnodes verwijderd voor hydrationfix */}
            </tr>
          </thead>
          <tbody>
            {books.map((b: Book) => (
              <tr key={b.id} className="odd:bg-white even:bg-gray-50">
                <td className="px-3 py-2 align-top" style={{ width: COLUMN_WIDTHS.cover }}>
                  {b.coverImageUrl ? (
                    (b.coverImageUrl as string).startsWith("/") ? (
                      <div className="relative w-16 h-24 rounded overflow-hidden shadow">
                        <Image
                          src={b.coverImageUrl as string}
                          alt={`Cover van ${b.title}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="relative w-16 h-24 rounded overflow-hidden shadow">
                        <Image
                          src={b.coverImageUrl as string}
                          alt={`Cover van ${b.title}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                          unoptimized
                          loading="lazy"
                        />
                      </div>
                    )
                  ) : (
                    <div className="w-16 h-24 rounded overflow-hidden shadow bg-gray-200 border border-gray-300" aria-hidden="true" />
                  )}
                </td>
                <td className="px-3 py-2 font-medium" style={{ width: COLUMN_WIDTHS.title }}>
                  <div className="min-w-[300px]" style={{ maxWidth: `${COLUMN_WIDTHS.title}px` }}>
                    <Link className="text-blue-700 hover:text-blue-600 block truncate" href={`/books/${b.id}`}>{b.title}</Link>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis" style={{ width: COLUMN_WIDTHS.author }}>{b.author ?? '-'} </td>
                <td className="px-3 py-2 truncate" style={{ width: COLUMN_WIDTHS.genre }}>{b.genre ?? '-'} </td>
                <td className="px-3 py-2 whitespace-nowrap tabular-nums" style={{ width: COLUMN_WIDTHS.year }}>{b.publishedYear ?? '-'} </td>
                <td className="px-3 py-2 whitespace-nowrap tabular-nums" style={{ width: COLUMN_WIDTHS.rating }}>
                  {(() => {
                    const r = ratingMap.get(b.id);
                    if (!r || r.count === 0 || r.avg == null) return '-';
                    return (
                      <div className="truncate" style={{ maxWidth: `${COLUMN_WIDTHS.rating}px` }}>
                        <Flex align="center" gap="1">
                          <StarDisplay value={r.avg ?? 0} size="1" />
                          <Text size="1" color="gray" className="truncate">{r.avg.toFixed(1)} ({r.count})</Text>
                        </Flex>
                      </div>
                    );
                  })()}
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-gray-500">Geen boeken gevonden.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          {page > 1 ? (
            <Button style={{ borderRadius: '2rem' }} variant="outline" asChild>
              <Link href={buildQuery({ page: page - 1 })}>Vorige</Link>
            </Button>
          ) : (
            <Button style={{ borderRadius: '2rem' }} variant="outline" disabled>Vorige</Button>
          )}
        </div>
        <div className="px-2 text-center">
          <span>Pagina {page} / {totalPages} (Totaal: {total})</span>
        </div>
        <div className="flex-1 flex justify-end">
          {page < totalPages ? (
            <Button style={{ borderRadius: '2rem' }} variant="outline" asChild>
              <Link href={buildQuery({ page: page + 1 })}>Volgende</Link>
            </Button>
          ) : (
            <Button style={{ borderRadius: '2rem' }} variant="outline" disabled>Volgende</Button>
          )}
        </div>
      </div>
    </Container>
  );
}
