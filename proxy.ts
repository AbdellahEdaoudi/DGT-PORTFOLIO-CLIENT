import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default withAuth(async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAuth = await getToken({ req: request });
  const protectedRoutes = ['/business-links', '/update-profile', '/support', '/payment', '/admin', '/api/proxy/users/:path*', '/api/proxy/alldata/:path*', '/api/proxy/links/:path*', '/custom-domain'];
  const isAuthRoute = pathname.startsWith('/auth');
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  // If not authenticated and accessing protected route
  if (!isAuth && isProtectedRoute) {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url));
  }
  // If authenticated and accessing non-auth route
  if (isAuthRoute && isAuth) {
    return NextResponse.redirect(new URL('/update-profile', request.url));
  }
}, {
  // Optional callback function
  callbacks: {
    async authorized() {
      return true;
    },
  },
});

export const config = {
  matcher: ['/business-links', '/update-profile', '/support', '/payment', '/admin', '/auth/:path*', '/api/proxy/:path*', '/custom-domain',],
};