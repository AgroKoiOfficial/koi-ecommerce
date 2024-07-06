import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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
