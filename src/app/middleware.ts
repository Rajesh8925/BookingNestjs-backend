// middleware.ts
import { NextResponse } from "next/server";

export function middleware(req: { cookies: { get: (arg0: string) => { (): any; new(): any; value: null; }; }; nextUrl: { pathname: any; }; url: string | URL | undefined; }) {
  const token = req.cookies.get("token")?.value || null;
  const role = req.cookies.get("role")?.value || null;

  const path = req.nextUrl.pathname;

  // Protected
  if (path.startsWith("/dashboard") || path.startsWith("/register")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin only
  if (path.startsWith("/admin")) {
    if (!token || role !== "admin")
      return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/register/:path*", "/admin/:path*"],
};
