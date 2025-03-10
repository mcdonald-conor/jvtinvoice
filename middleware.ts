import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  // Get the request path
  const path = request.nextUrl.pathname;

  // Create a response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Only set Content-Type for HTML pages, not for static assets
  if (!path.includes('/_next/') &&
      !path.includes('/api/') &&
      !path.match(/\.(jpg|jpeg|gif|png|svg|ico|css|js|json)$/i)) {
    // This is likely an HTML page
    response.headers.set('Content-Type', 'text/html; charset=utf-8');
  }

  // Always set security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');

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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
