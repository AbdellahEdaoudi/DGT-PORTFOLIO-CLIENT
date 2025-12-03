import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

// Middleware function
export default withAuth(async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hostname = request.headers.get('host') || '';
  const isAuth = await getToken({ req: request });

  // Check if it's a custom domain (not dgtportfolio.com or localhost)
  const isCustomDomain = !hostname.includes('dgtportfolio.com') && 
                         !hostname.includes('localhost') && 
                         !hostname.includes('127.0.0.1') &&
                         !hostname.includes('vercel.app');

  // If it's a custom domain, fetch the username from the backend
  if (isCustomDomain) {
    try {
      const backendUrl = process.env.BACKEND_URL || 'https://dgt-portfolio-server.vercel.app';
      const response = await fetch(`${backendUrl}/api/custom-domain/by-domain/${hostname}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status && data.user?.username) {
          // Rewrite to the user's profile page, preserving the path
          const url = request.nextUrl.clone();
          // If path is root '/', go to /username
          // If path is '/something', go to /username/something (if your app supports it)
          // Or just keep rewriting to /username if it's a single page app
          
          if (pathname === '/') {
             url.pathname = `/${data.user.username}`;
          } else {
             // If you want to support sub-routes like /contact, /projects etc.
             // url.pathname = `/${data.user.username}${pathname}`;
             
             // For now, let's assume it's a single page portfolio or we just rewrite root
             // If accessing assets or API, don't rewrite
             if (!pathname.startsWith('/api') && !pathname.startsWith('/_next') && !pathname.includes('.')) {
                 url.pathname = `/${data.user.username}${pathname}`;
             }
          }
          
          return NextResponse.rewrite(url);
        }
      }
    } catch (error) {
      console.error('Error fetching custom domain user:', error);
    }
  }

  const protectedRoutes = ['/BusinessLinks','/update-profile','/support','/subscription','/Admin'];
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

// Configuration for matcher
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};