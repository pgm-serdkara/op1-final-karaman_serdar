import Skeleton from "@/components/Skeleton";

const SKELETON_COLUMN_WIDTHS = {
  cover: 96,
  title: 360,
  author: 200,
  genre: 120,
  year: 70,
  rating: 150,
} as const;
const SKELETON_TABLE_WIDTH = (Object.values(SKELETON_COLUMN_WIDTHS) as number[]).reduce((acc, value) => acc + value, 0);

// Skeleton spiegelt /books met dezelfde layout
export default function LoadingBooksList() {
  const rows = Array.from({ length: 8 });
  return (
    <div className="p-6 space-y-5">
      <Skeleton className="h-8 w-48" />

      <Skeleton className="h-10 w-full max-w-2xl" />

      <div className="flex flex-wrap gap-3 items-center">
        <Skeleton className="h-9 w-[280px]" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-28" />
      </div>

      <div
        className="border rounded overflow-hidden shadow-xl"
        style={{ width: "100%", maxWidth: `${SKELETON_TABLE_WIDTH}px` }}
      >
        <table
          className="text-sm table-fixed"
          style={{ width: "100%", maxWidth: `${SKELETON_TABLE_WIDTH}px` }}
        >
          <colgroup>
            <col style={{ width: SKELETON_COLUMN_WIDTHS.cover }} />
            <col style={{ width: SKELETON_COLUMN_WIDTHS.title }} />
            <col style={{ width: SKELETON_COLUMN_WIDTHS.author }} />
            <col style={{ width: SKELETON_COLUMN_WIDTHS.genre }} />
            <col style={{ width: SKELETON_COLUMN_WIDTHS.year }} />
            <col style={{ width: SKELETON_COLUMN_WIDTHS.rating }} />
          </colgroup>
          <thead className="bg-gray-100">
            <tr>
              {['Cover','Titel','Auteur','Genre','Jaar','Rating'].map(h => (
                <th key={h} className="text-left px-3 py-2"><Skeleton className="h-4 w-16" /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((_, i) => (
              <tr key={i} className={i % 2 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-3 py-2"><Skeleton className="h-24 w-16 rounded shadow" /></td>
                <td className="px-3 py-2"><Skeleton className="h-5 w-[320px]" /></td>
                <td className="px-3 py-2"><Skeleton className="h-5 w-[180px]" /></td>
                <td className="px-3 py-2"><Skeleton className="h-5 w-[90px]" /></td>
                <td className="px-3 py-2"><Skeleton className="h-5 w-[50px]" /></td>
                <td className="px-3 py-2"><Skeleton className="h-5 w-[130px]" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
}
