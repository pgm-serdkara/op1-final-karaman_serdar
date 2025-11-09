import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  const session = await getServerSession(authOptions);
  return NextResponse.json({
    token: token,
    session: session,
  });
}