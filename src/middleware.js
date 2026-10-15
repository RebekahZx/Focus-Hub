import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// The landing page is public; the dashboard and study rooms need a sign-in.
export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname, search } = req.nextUrl;

  if (pathname === "/user-auth") {
    return token ? NextResponse.redirect(new URL("/dashboard", req.url)) : NextResponse.next();
  }
  if (!token) {
    const url = new URL("/user-auth", req.url);
    url.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/s/:path*", "/user-auth"],
};
