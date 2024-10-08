import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.method === "GET") {
    const headers = new Headers(request.headers);
    headers.set("path-name", request.nextUrl.pathname);
    return NextResponse.next({ headers });
  }

  const originHeader = request.headers.get("Origin");
  const hostHeader =
    request.headers.get("Host") || request.headers.get("X-Forwarded-Host");
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
