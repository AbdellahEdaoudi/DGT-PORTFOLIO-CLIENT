import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default withAuth(
  async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const hostname = request.headers.get('host') || '';
    const isAuth = await getToken({ req: request });

    // تحديد هل النطاق هو Custom Domain
    const isCustomDomain =
      !hostname.includes('dgtportfolio.com') &&
      !hostname.includes('localhost') &&
      !hostname.includes('127.0.0.1') &&
      !hostname.includes('vercel.app');

    // ---------------------------------------------
    // معالجة Custom Domain
    // ---------------------------------------------
    if (isCustomDomain) {
      try {
        const backendUrl =
          process.env.BACKEND_URL || 'https://dgt-portfolio-server.vercel.app';

        const response = await fetch(
          `${backendUrl}/api/custom-domain/by-domain/${hostname}`
        );

        if (response.ok) {
          const data = await response.json();

          if (data.status && data.user?.username) {
            const url = request.nextUrl.clone();

            // إعادة كتابة الرابط
            if (pathname === '/') {
              url.pathname = `/${data.user.username}`;
            } else {
              if (
                !pathname.startsWith('/api') &&
                !pathname.startsWith('/_next') &&
                !pathname.includes('.')
              ) {
                url.pathname = `/${data.user.username}${pathname}`;
              }
            }

            // ⚠️ مهم جداً: إضافة الـ host الحقيقي للكوكيز
            const rewritten = NextResponse.rewrite(url);
            rewritten.cookies.set('real-host', hostname);

            return rewritten;
          }
        }
      } catch (error) {
        console.error('Error fetching custom domain user:', error);
      }
    }

    // ---------------------------------------------
    // حماية الروتات الخاصة
    // ---------------------------------------------
    const protectedRoutes = [
      '/BusinessLinks',
      '/update-profile',
      '/support',
      '/subscription',
      '/Admin',
    ];
    const isAuthRoute = pathname.startsWith('/auth');
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!isAuth && isProtectedRoute) {
      return NextResponse.redirect(new URL('/api/auth/signin', request.url));
    }

    if (isAuthRoute && isAuth) {
      return NextResponse.redirect(new URL('/update-profile', request.url));
    }

    // ⚠️ الطلبات العادية → نمرر الـ host أيضاً
    const res = NextResponse.next();
    res.cookies.set('real-host', hostname);
    return res;
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

// Configuration
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
