import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  // Get the request path
  const path = request.nextUrl.pathname;

  // Log user agent in server logs (helpful for debugging)
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  console.log(`Middleware handling: ${path} - User Agent: ${userAgent}`);

  // Create a response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set appropriate Content-Type headers based on file extension
  if (path.endsWith('.js') || path.includes('/_next/static/chunks/')) {
    response.headers.set('Content-Type', 'application/javascript; charset=utf-8');
  } else if (path.endsWith('.css') || path.includes('/_next/static/css/')) {
    response.headers.set('Content-Type', 'text/css; charset=utf-8');
  } else if (path.endsWith('.json')) {
    response.headers.set('Content-Type', 'application/json; charset=utf-8');
  } else if (!path.includes('/_next/') &&
      !path.includes('/api/') &&
      !path.match(/\.(jpg|jpeg|gif|png|svg|ico|css|js|json)$/i)) {
    // This is likely an HTML page
    response.headers.set('Content-Type', 'text/html; charset=utf-8');
  }

  // Always set security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Set CORS headers to allow all origins (helpful for mobile)
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

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
    // Also match API routes to add CORS headers
    '/api/:path*',
  ],
};
