import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import type { Role } from "@/app/_generated/prisma";
import prisma from "@/lib/client";

type SessionUser = {
  id: string;
  role: Role;
};

const isSessionUser = (candidate: unknown): candidate is SessionUser =>
  Boolean(
    candidate &&
      typeof candidate === "object" &&
      "id" in candidate &&
      typeof (candidate as { id?: unknown }).id === "string" &&
      "role" in candidate &&
      typeof (candidate as { role?: unknown }).role === "string"
  );

const authOptions: NextAuthOptions = {
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
        if (!user || !user.hashedPassword) {
          return null;
        }
        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!passwordsMatch) {
          return null;
        }

        const sanitizedUser: SessionUser & {
          email: string;
          name: string | null;
        } = {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
          role: user.role,
        };

        return sanitizedUser;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Voegt userId toe aan de sessie zodat client (useSession) en server (getServerSession) hem zien
    session: async ({ session }) => {
        if (!session.user?.email) {
          return session;
        }

        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, role: true },
        });

        if (user) {
          session.role = user.role;
          session.user = {
            ...session.user,
            id: user.id,
          };
        }

        return session;
      },
    // Voegt rol toe aan het token zodat middleware die kan gebruiken
    jwt: async ({ token, user }) => {
        if (isSessionUser(user)) {
          token.role = user.role;
          token.userId = user.id;
        }
        return token;
      },
    },
};

const handler = NextAuth(authOptions);

export { authOptions };
export { handler as GET, handler as POST };