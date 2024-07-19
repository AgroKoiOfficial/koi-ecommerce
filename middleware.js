import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createCsrfMiddleware } from '@edge-csrf/nextjs';

const csrfMiddleware = createCsrfMiddleware({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  }
});

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const pathname = url.pathname;

  const authRoutes = ["/cart", "/checkout", "/payment", "/user", "transaction-result"];
  const adminRoutes = ["/dashboard"];
  const guestRoutes = [
    "/register",
    "/login",
    "/forgot-password",
    "/reset-password",
  ];

  const csrfResponse = await csrfMiddleware(req);
  if (csrfResponse) {
    return csrfResponse;
  }

  if (guestRoutes.some((route) => pathname.startsWith(route)) && token) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (authRoutes.some((route) => pathname.startsWith(route)) && !token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (
    adminRoutes.some((route) => pathname.startsWith(route)) &&
    (!token || token.role !== "ADMIN")
  ) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Add CSP headers
  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim());
  
  return response;
}

export const config = {
  matcher: [
    "/cart",
    "/checkout",
    "/payment",
    "/user/:path*",
    "/dashboard/:path*",
    "/register",
    "/login",
    "/forgot-password",
    "/reset-password",
  ],
};