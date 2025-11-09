type AppRole = "USER" | "ADMIN";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    role?: AppRole;
  }
  // Minimal declaration so we can use getServerSession in server components
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function getServerSession(...args: any[]): Promise<Session | null>;
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppRole;
  }
  // Add a declaration for getToken to ensure TS can resolve it in middleware
  // Runtime is provided by next-auth; this signature is sufficient for our usage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function getToken(params: { req: any }): Promise<JWT | null>;
}
