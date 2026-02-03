import { NextRequest, NextResponse } from 'next/server';
import { db, newsletterSubscribers } from '@/lib/db';
import { eq } from 'drizzle-orm';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mediteranayachting.com';

// Handle GET requests (clicked from email)
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return new NextResponse(generateHtmlResponse(false, 'Invalid unsubscribe link.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const subscriber = db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.unsubscribeToken, token))
    .get();

  if (!subscriber) {
    return new NextResponse(generateHtmlResponse(false, 'Invalid or expired unsubscribe link.'), {
      status: 404,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  if (subscriber.status === 'unsubscribed') {
    return new NextResponse(generateHtmlResponse(true, 'You have already been unsubscribed.'), {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  // Update subscriber status
  db.update(newsletterSubscribers)
    .set({
      status: 'unsubscribed',
      unsubscribedAt: new Date(),
    })
    .where(eq(newsletterSubscribers.id, subscriber.id))
    .run();

  return new NextResponse(
    generateHtmlResponse(true, 'You have been successfully unsubscribed from our newsletter.'),
    { headers: { 'Content-Type': 'text/html' } }
  );
}

// Handle POST requests (programmatic unsubscribe)
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Unsubscribe token is required' },
        { status: 400 }
      );
    }

    const subscriber = db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.unsubscribeToken, token))
      .get();

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Invalid or expired unsubscribe token' },
        { status: 404 }
      );
    }

    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json({
        success: true,
        message: 'Already unsubscribed',
      });
    }

    db.update(newsletterSubscribers)
      .set({
        status: 'unsubscribed',
        unsubscribedAt: new Date(),
      })
      .where(eq(newsletterSubscribers.id, subscriber.id))
      .run();

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed',
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

function generateHtmlResponse(success: boolean, message: string): string {
  const statusColor = success ? '#10b981' : '#ef4444';
  const statusIcon = success ? '✓' : '✗';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribe - Mediterana Yachting</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      padding: 3rem;
      max-width: 500px;
      text-align: center;
    }
    .icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: ${statusColor}15;
      color: ${statusColor};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin: 0 auto 1.5rem;
    }
    h1 {
      color: #1e293b;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    p {
      color: #64748b;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    .btn {
      display: inline-block;
      background-color: #1e3a5f;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    .btn:hover {
      background-color: #2d4a6f;
    }
    .logo {
      margin-top: 2rem;
      color: #94a3b8;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">${statusIcon}</div>
    <h1>${success ? 'Unsubscribed' : 'Error'}</h1>
    <p>${message}</p>
    <a href="${baseUrl}" class="btn">Visit Our Website</a>
    <p class="logo">Mediterana Yachting</p>
  </div>
</body>
</html>
  `.trim();
}
