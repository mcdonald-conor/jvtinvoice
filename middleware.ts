import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  // Get the user agent
  const userAgent = request.headers.get('user-agent') || '';

  // Create a response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Add security and content-type headers
  response.headers.set('Content-Type', 'text/html; charset=utf-8');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Add cache control for better performance
  response.headers.set('Cache-Control', 'public, max-age=3600');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .*\\.(?:jpg|jpeg|gif|png|svg|ico|css|js)$ (static files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|css|js)$).*)',
  ],
};
