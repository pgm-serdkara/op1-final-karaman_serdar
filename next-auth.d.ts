import type { Role } from "@prisma/client";
import type { NextAuthOptions, DefaultSession } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextRequest } from "next/server";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & { id?: string };
    role?: Role;
  }

  interface User {
    id: string;
    role: Role;
  }

  export function getServerSession(
    ...args:
      | [NextAuthOptions]
      | [NextApiRequest, NextApiResponse, NextAuthOptions]
  ): Promise<Session | null>;
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    userId?: string;
  }

  export function getToken(params: { req: NextRequest }): Promise<JWT | null>;
}
