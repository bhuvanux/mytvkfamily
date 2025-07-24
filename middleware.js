import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/',
    '/pricing',
    '/dashboard(.*)',
    '/api/(.*)', // ✅ This covers all API routes including /loadHistory
  ],
};