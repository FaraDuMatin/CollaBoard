import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define which routes are public (don't require authentication)
const isPublicRoute = createRouteMatcher([
//   '/',  // Home page is public
  '/sign-in(.*)',  // Sign in pages
  '/sign-up(.*)',  // Sign up pages
  '/guest',  // Board that works without an account
]);

export default clerkMiddleware(async (auth, request) => {
  // Visitors without an account land on the guest board
  if (request.nextUrl.pathname === '/' && !(await auth()).userId) {
    return NextResponse.redirect(new URL('/guest', request.url));
  }

  // Protect all routes that are not public
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}; 