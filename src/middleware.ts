import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Autorisatie: adminOnly voor beheer, authOnly voor standaard loginroutes
const adminOnly: RegExp[] = [
    /^\/books\/new$/,
    /^\/books\/\d+\/edit$/,
    /^\/books\/\d+\/delete$/,
    /^\/api\/books(\/.*)?$/,
    /^\/api\/loans(\/.*)?$/,
];

const authOnly: RegExp[] = [
    /^\/wishlist(\/.*)?$/,
    /^\/api\/wishlist(\/.*)?$/,
    /^\/api\/ratings(\/.*)?$/,
    /^\/api\/loans\/[^/]+\/renew$/,
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const isApi = pathname.startsWith("/api/");
    const FORBIDDEN_PATH = "/403";

    const needsAdmin = adminOnly.some((re) => re.test(pathname));
    const needsAuthOnly = authOnly.some((re) => re.test(pathname));
    const requiresAuth = needsAdmin || needsAuthOnly;

    const token = await getToken({ req });
    const role = token?.role as undefined | "USER" | "ADMIN";
    const tokenUserId = (token as unknown as { userId?: string } | undefined)?.userId;

    if (requiresAuth && !token) {
        if (isApi) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const url = new URL(FORBIDDEN_PATH, req.url);
        return NextResponse.rewrite(url);
    }

    // /users uitzonderingen (eigen profiel of admin)
    if (pathname.startsWith("/users")) {
        if (pathname === "/users" || pathname === "/users/") {
            if (role !== "ADMIN") {
                if (isApi) {
                    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
                }
                const url = new URL(FORBIDDEN_PATH, req.url);
                return NextResponse.rewrite(url);
            }
        } else {
            const match = pathname.match(/^\/users\/([^/]+)\/?$/);
            if (match) {
                const id = match[1];
                if (role !== "ADMIN" && (!tokenUserId || tokenUserId !== id)) {
                    if (isApi) {
                        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
                    }
                    const url = new URL(FORBIDDEN_PATH, req.url);
                    return NextResponse.rewrite(url);
                }
            } else {
                if (role !== "ADMIN") {
                    if (isApi) {
                        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
                    }
                    const url = new URL(FORBIDDEN_PATH, req.url);
                    return NextResponse.rewrite(url);
                }
            }
        }
    } else if (needsAdmin && role !== "ADMIN") {
        if (isApi) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const url = new URL(FORBIDDEN_PATH, req.url);
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // /books:* zodat /books/new beschermd is en browsen open blijft
        "/books/:path*",
        "/wishlist",
        "/users/:path*",
        "/api/wishlist/:path*",
        "/api/ratings/:path*",
        "/api/loans/:path*",
        "/api/books/:path*",
    ],
};