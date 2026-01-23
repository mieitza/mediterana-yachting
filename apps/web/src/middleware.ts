import NextAuth from 'next-auth';
import { authConfigEdge } from '@/lib/auth/config.edge';

// Use edge-compatible config (no database access)
const { auth } = NextAuth(authConfigEdge);

export default auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
