import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/client";
import bcrypt from "bcrypt";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
        },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          return null;
        }
        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword!
        );

        return passwordsMatch ? user : null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Voegt userId toe aan de sessie zodat client (useSession) en server (getServerSession) hem zien
    session: async ({ session }: { session: { user?: { email?: string; id?: string }; role?: string } }) => {
        const user = await prisma.user.findUnique({
          where: { email: session?.user?.email ?? undefined },
          select: { id: true, role: true },
        });
        if (user) {
          session.role = user.role;
          // Zorg dat session.user bestaat en voeg id toe voor gemak
          session.user = session.user || {};
          session.user.id = user.id;
        }
        return session;
      },
    // Voegt rol toe aan het token zodat middleware die kan gebruiken
    jwt: async ({ token, user }: { token: Record<string, unknown>; user?: Record<string, unknown> }) => {
        if (user && typeof user === "object") {
          const u = user as { role?: string; id?: string };
          if (u.role) {
            (token as { role?: string }).role = u.role;
          }
          if (u.id) {
            (token as { userId?: string }).userId = u.id;
          }
        }
        return token;
      },
    },
} as const;

const handler = (NextAuth as any)(authOptions);

export { authOptions };
export { handler as GET, handler as POST };