import type { Metadata } from "next";
import { Open_Sans, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "The Grand Library",
    template: "%s | The Grand Library",
  },
  description: "Blader, beoordeel en beheer boeken in The Grand Library - een Next.js bibliotheekapp.",
  keywords: ["boeken", "bibliotheek", "ratings", "wishlist", "Next.js", "Prisma"],
  authors: [{ name: "Serdar Karaman" }],
  creator: "Serdar Karaman",
  metadataBase: new URL("https://example.com"), // TODO: vervang door echte productie URL
  openGraph: {
    title: "The Grand Library",
    description: "Ontdek en beoordeel boeken. Beheer verlanglijsten en leningen.",
    type: "website",
    siteName: "The Grand Library",
    locale: "nl_BE",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-open-sans",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-sans-3",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.className} ${openSans.variable} ${sourceSans.variable} antialiased`}
      >
        <Theme accentColor="blue">
          <Header />
          {children}
        </Theme>
      </body>
    </html>
  );
}

