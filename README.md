# Introduction

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Installation

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

3. Seed de database (SQLite)

	1. Genereer (of werk) het coversjabloon bij:

		```bash
		npm run generate:cover-map
		```

	Dit maakt `prisma/cover-mapping.json` aan met alle bestanden uit `public/img/covers`. Vul voor elke entry titel, auteur, beschrijving, enz. in.

	2. Seed de database op basis van die mapping:

		```bash
		npm run seed
		```

	De seed leegt de volledige database (inclusief users) en voegt alleen boeken toe die in `prisma/cover-mapping.json` een titel hebben gekregen. Laat je een entry leeg, dan wordt hij overgeslagen.

## Prisma

- Schema: `prisma/schema.prisma`
- Seed script: `prisma/seed.js` via script alias `npm run seed`

# Feature Overview

## Routes

- /books: Overzicht van boeken met zoeken, filteren per genre en paginatie.
- /books/new: Formulier om nieuwe boeken toe te voegen. Na succesvol opslaan word je geredirect naar /books.
- /books/:id: Detailpagina met alle gegevens van een boek.

# Author

Serdar Karaman