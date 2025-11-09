"use client";

import Link from "next/link";

interface BookEditFormProps {
  book: {
    id: number;
    title: string;
    author: string | null;
    genre: string | null;
    publishedYear: number | null;
    coverImageUrl: string | null;
  };
  updateBookAction: (formData: FormData) => Promise<void>;
}

export default function BookEditForm({ book, updateBookAction }: BookEditFormProps) {
  return (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">Boek bewerken</h3>
      <form action={updateBookAction} className="space-y-4 max-w-md">
        <input type="hidden" name="id" value={book.id} />
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="font-medium">Titel</label>
          <input id="title" name="title" type="text" required defaultValue={book.title} className="border rounded-[2rem] px-2 py-1" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="author" className="font-medium">Auteur</label>
          <input id="author" name="author" type="text" defaultValue={book.author ?? ""} className="border rounded-[2rem] px-2 py-1" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="genre" className="font-medium">Genre</label>
          <input id="genre" name="genre" type="text" defaultValue={book.genre ?? ""} className="border rounded-[2rem] px-2 py-1" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="publishedYear" className="font-medium">Publicatiejaar</label>
          <input id="publishedYear" name="publishedYear" type="number" defaultValue={book.publishedYear ?? ""} className="border rounded-[2rem] px-2 py-1" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="coverImageUrl" className="font-medium">Coverafbeelding URL</label>
          <div className="flex items-center gap-2">
            <input id="coverImageUrl" name="coverImageUrl" type="text" defaultValue={book.coverImageUrl ?? ""} placeholder="https://... of /img/.." className="border rounded-[2rem] px-2 py-1 flex-grow" />
            <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-1 border rounded-[2rem]">
              Upload foto
              <input
                id="coverImageFile"
                name="coverImageFile"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const coverImageUrlInput = document.getElementById('coverImageUrl') as HTMLInputElement;
                    coverImageUrlInput.value = `Uploading ${file.name}...`;
                  }
                }}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">Optioneel: absolute URL of pad binnen /public. Wordt gebruikt voor Open Graph delen.</p>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded-[2rem]">Opslaan</button>
          <Link href={`/books/${book.id}`} className="px-3 py-1 border rounded-[2rem]">Annuleren</Link>
        </div>
      </form>
    </div>
  );
}
