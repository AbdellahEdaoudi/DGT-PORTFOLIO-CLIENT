import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default withAuth(async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hostname = request.headers.get('host') || '';
  const isAuth = await getToken({ req: request });

  // 1. Identify if it's a Custom Domain
  const isCustomDomain = !hostname.includes('dgtportfolio.com') && 
                         !hostname.includes('localhost') && 
                         !hostname.includes('127.0.0.1') &&
                         !hostname.includes('vercel.app');

  // 2. Handle Custom Domain Logic
  if (isCustomDomain) {
    try {
      // Fetch user associated with this domain
      // Use a public backend URL or internal one. 
      // Note: Middleware runs on Edge, so ensure fetch is compatible.
      const backendUrl = process.env.BACKEND_URL || 'https://dgt-portfolio-server.vercel.app';
      const response = await fetch(`${backendUrl}/api/custom-domain/by-domain/${hostname}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status && data.user?.username) {
          const username = data.user.username;
          
          // Rewrite the URL to the user's profile path
          // e.g. abdellah.site/about -> dgtportfolio.com/abdellah/about
          const url = request.nextUrl.clone();
          
          if (pathname === '/') {
             url.pathname = `/${username}`;
          } else {
             // Avoid rewriting API or static files
             if (!pathname.startsWith('/api') && !pathname.startsWith('/_next') && !pathname.includes('.')) {
                 url.pathname = `/${username}${pathname}`;
             }
          }
          
          const response = NextResponse.rewrite(url);
          
          // IMPORTANT: Set a header so page.js knows the original custom domain
          response.headers.set('x-current-host', hostname);
          return response;
        }
      }
    } catch (error) {
      console.error('Middleware: Error fetching custom domain user:', error);
    }
  }

  // 3. Standard Auth Protection Logic
  const protectedRoutes = ['/BusinessLinks','/update-profile','/support','/subscription','/Admin'];
  const isAuthRoute = pathname.startsWith('/auth');
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (!isAuth && isProtectedRoute) {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url));
  }

  if (isAuthRoute && isAuth) {
    return NextResponse.redirect(new URL('/update-profile', request.url));
  }
  
  // For standard requests, we still want to pass the host just in case
  const response = NextResponse.next();
  response.headers.set('x-current-host', hostname);
  return response;

}, {
  callbacks: {
    async authorized() {
      return true;
    },
  },
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
