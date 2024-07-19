import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createCsrfMiddleware } from '@edge-csrf/nextjs';
import { v4 as uuidv4 } from 'uuid';

const csrfMiddleware = createCsrfMiddleware({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  }
});

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const pathname = url.pathname;
  const nonce = uuidv4();  // Membuat nonce unik

  const authRoutes = ["/cart", "/checkout", "/payment", "/user", "/transaction-result"];
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

  // Menambahkan header CSP dengan nonce
  const response = NextResponse.next();
  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com;
    connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com;
    font-src 'self' data:;
    frame-src 'self' https://www.google.com https://www.youtube.com;
    frame-ancestors 'self';
    form-action 'self';
  `.replace(/\n/g, ' ').replace(/\s\s+/g, ' ');
  response.headers.set('Content-Security-Policy', csp.trim());

  // Menyimpan nonce di header agar dapat diakses di halaman
  response.headers.set('X-Nonce', nonce);

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
