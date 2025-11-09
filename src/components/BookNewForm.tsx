"use client";

import Link from "next/link";

interface BookNewFormProps {
  createBookAction: (formData: FormData) => Promise<void>;
}

export default function BookNewForm({ createBookAction }: BookNewFormProps) {
  return (
    <form action={createBookAction} className="space-y-4 max-w-md">
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="font-medium">Titel</label>
        <input id="title" name="title" type="text" required className="border rounded px-2 py-1" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="font-medium">Beschrijving</label>
        <input id="description" name="description" type="text" className="border rounded px-2 py-1" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="numberOfPages" className="font-medium">Aantal pagina&apos;s</label>
        <input id="numberOfPages" name="numberOfPages" type="number" className="border rounded px-2 py-1" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="publishedYear" className="font-medium">Publicatiejaar</label>
        <input id="publishedYear" name="publishedYear" type="number" className="border rounded px-2 py-1" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="genre" className="font-medium">Genre</label>
        <input id="genre" name="genre" type="text" className="border rounded px-2 py-1" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="author" className="font-medium">Auteur</label>
        <input id="author" name="author" type="text" className="border rounded px-2 py-1" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="publisher" className="font-medium">Uitgeverij</label>
        <input id="publisher" name="publisher" type="text" className="border rounded px-2 py-1" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="coverImageUrl" className="font-medium">Coverafbeelding URL</label>
        <div className="flex items-center gap-2">
          <input id="coverImageUrl" name="coverImageUrl" type="text" placeholder="https://... of /img/.." className="border rounded px-2 py-1 flex-grow" />
          <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-1 border rounded">
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
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Opslaan</button>
        <Link href="/books" className="px-3 py-1 border rounded">Annuleren</Link>
      </div>
    </form>
  );
}
