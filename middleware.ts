import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default withAuth(async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hostname = request.headers.get('host') || '';
  const isAuth = await getToken({ req: request });

  // Detect custom domain (not dgtportfolio, not localhost)
  const isCustomDomain =
    !hostname.includes('dgtportfolio.com') &&
    !hostname.includes('localhost') &&
    !hostname.includes('127.0.0.1') &&
    !hostname.includes('vercel.app');

  // 1️⃣ Custom Domain Logic
  if (isCustomDomain) {
    try {
      const backendUrl =
        process.env.BACKEND_URL || 'https://dgt-portfolio-server.vercel.app';

      const res = await fetch(`${backendUrl}/api/custom-domain/by-domain/${hostname}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status && data.user?.username) {
          const url = request.nextUrl.clone();

          // Rewrite to /[username]
          // Preserve path, e.g. /some-path -> /username/some-path
          // But since we only have single page for now, usually it's just /username
          if (pathname === '/') {
            url.pathname = `/${data.user.username}`;
          } else if (
            !pathname.startsWith('/api') &&
            !pathname.startsWith('/_next') &&
            !pathname.includes('.')
          ) {
             url.pathname = `/${data.user.username}${pathname}`;
          }

          const requestHeaders = new Headers(request.headers);
          requestHeaders.set('x-current-host', hostname);

          const response = NextResponse.rewrite(url, {
            request: {
              headers: requestHeaders,
            },
          });

          // ✅ Pass host via cookie AND header (for client/response)
          // Cookies might not be seen by crawlers, but header/rewrite handles the content
          response.cookies.set('x-current-host', hostname, { path: '/' });
          response.headers.set('x-current-host', hostname);

          return response;
        }
      }
    } catch (err) {
      console.error('Middleware custom domain error:', err);
    }
  }

  // 2️⃣ Subdomain Logic (e.g. username.dgtportfolio.com)
  // Rewrite to /username so it hits app/[username]/page.jsx
  const isSubdomain = hostname.includes('.dgtportfolio.com') && !hostname.startsWith('www.');
  
  if (isSubdomain) {
      const subdomain = hostname.split('.')[0];
      // Avoid rewriting for 'api', 'admin', etc if they are subdomains (though usually they are paths)
      // Assuming all subdomains are users except specific reserved ones if any
      const reservedSubdomains = ['www', 'api', 'admin', 'assets', 'static'];
      
      if (subdomain && !reservedSubdomains.includes(subdomain)) {
          const url = request.nextUrl.clone();
          
          if (pathname === '/') {
              url.pathname = `/${subdomain}`;
          } else if (
              !pathname.startsWith('/api') &&
              !pathname.startsWith('/_next') &&
              !pathname.includes('.')
          ) {
              url.pathname = `/${subdomain}${pathname}`;
          }

          const requestHeaders = new Headers(request.headers);
          requestHeaders.set('x-current-host', hostname);

          const response = NextResponse.rewrite(url, {
              request: {
                  headers: requestHeaders,
              }
          });
          
          response.cookies.set('x-current-host', hostname, { path: '/' });
          response.headers.set('x-current-host', hostname);

          return response;
      }
  }

  // Auth Protection
  const protectedRoutes = [
    '/BusinessLinks',
    '/update-profile',
    '/support',
    '/subscription',
    '/Admin',
    '/custom-domain',
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
