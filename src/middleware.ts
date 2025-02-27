import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get("auth_token"); // Check for a session token

//   if (!isAuthenticated && req.nextUrl.pathname !== "/login") {
//     const loginUrl = new URL("/login", req.nextUrl.origin);
//     return NextResponse.redirect(loginUrl);
//   }

  return NextResponse.next();
}
// export const config = {
//     matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// }

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
  };