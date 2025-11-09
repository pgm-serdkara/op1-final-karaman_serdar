import prisma from "@/lib/client";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import BookNewForm from "@/components/BookNewForm";
import { writeFile } from "fs/promises";
import path from "path";

export const metadata: Metadata = {
  title: "Nieuw boek toevoegen",
  description: "Voeg een nieuw boek toe aan The Grand Library (alleen voor beheerders).",
};

export const dynamic = "force-dynamic";

async function createBook(formData: FormData) {
  "use server";
  const title = String(formData.get("title") || "").trim();
  const author = String(formData.get("author") || "").trim() || null;
  const genre = String(formData.get("genre") || "").trim() || null;
  const publishedYearRaw = String(formData.get("publishedYear") || "").trim();
  const publishedYear = publishedYearRaw ? Number.parseInt(publishedYearRaw, 10) : null;
  let coverImageUrl = String(formData.get("coverImageUrl") || "").trim() || null;
  const coverImageFile = formData.get("coverImageFile") as File | null;

  if (coverImageFile && coverImageFile.size > 0) {
    const buffer = Buffer.from(await coverImageFile.arrayBuffer());
    const filename = `${Date.now()}-${coverImageFile.name.replace(/\s/g, "_")}`;
    try {
      await writeFile(
        path.join(process.cwd(), "public/img/covers", filename),
        buffer
      );
      coverImageUrl = `/img/covers/${filename}`;
    } catch (error) {
      console.error("Failed to write file:", error);
      throw new Error("Failed to upload cover image.");
    }
  }

  if (!title) {
    throw new Error("Title is required");
  }

  await prisma.book.create({
    data: {
      title,
      author,
      genre,
      publishedYear: Number.isNaN(publishedYear as number) ? null : publishedYear,
      coverImageUrl,
    },
  });

  redirect("/books");
}

export default function NewBookPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Nieuw boek toevoegen</h1>
      <BookNewForm createBookAction={createBook} />
    </div>
  );
}
