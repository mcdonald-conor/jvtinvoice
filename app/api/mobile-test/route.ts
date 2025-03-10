import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get the user agent
  const userAgent = request.headers.get('user-agent') || 'Unknown';

  // Determine if it's likely a mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

  return NextResponse.json(
    {
      status: 'ok',
      message: 'Mobile API test endpoint is working',
      timestamp: new Date().toISOString(),
      userAgent,
      isMobile,
      headers: Object.fromEntries(request.headers.entries()),
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    }
  );
}
