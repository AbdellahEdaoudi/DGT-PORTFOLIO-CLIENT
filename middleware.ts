import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default withAuth(async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hostname = request.headers.get('host') || '';
  const isAuth = await getToken({ req: request });

  // Detect custom domain
  const isCustomDomain =
    !hostname.includes('dgtportfolio.com') &&
    !hostname.includes('localhost') &&
    !hostname.includes('127.0.0.1') &&
    !hostname.includes('vercel.app');

  if (isCustomDomain) {
    try {
      const backendUrl =
        process.env.BACKEND_URL || 'https://dgt-portfolio-server.vercel.app';

      const res = await fetch(`${backendUrl}/api/custom-domain/by-domain/${hostname}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status && data.user?.username) {
          const url = request.nextUrl.clone();

          if (pathname === '/') {
            url.pathname = `/${data.user.username}`;
          } else if (
            !pathname.startsWith('/api') &&
            !pathname.startsWith('/_next') &&
            !pathname.includes('.')
          ) {
            url.pathname = `/${data.user.username}${pathname}`;
          }

          const response = NextResponse.rewrite(url);

          // ✅ Pass host via cookie AND header
          response.cookies.set('x-current-host', hostname, { path: '/' });
          response.headers.set('x-current-host', hostname);

          return response;
        }
      }
    } catch (err) {
      console.error('Middleware custom domain error:', err);
    }
  }

  // Auth Protection
  const protectedRoutes = [
    '/BusinessLinks',
    '/update-profile',
    '/support',
    '/subscription',
    '/Admin',
  ];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isAuth && isProtected) {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url));
  }

  const isAuthRoute = pathname.startsWith('/auth');
  if (isAuthRoute && isAuth) {
    return NextResponse.redirect(new URL('/update-profile', request.url));
  }

  const response = NextResponse.next();
  response.cookies.set('x-current-host', hostname, { path: '/' });
  response.headers.set('x-current-host', hostname);
  return response;
}, {
  callbacks: { async authorized() { return true; } },
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
