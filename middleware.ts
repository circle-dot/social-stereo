import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import communities from './data/communities.json'

export function middleware(request: NextRequest) {
  // Get the organization from the pathname
  const org = request.nextUrl.pathname.split('/')[1]

  // Skip middleware for non-org routes and static files
  if (
    !org || 
    org === '_next' || 
    org === 'api' || 
    org === 'favicon.ico' ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('/api/') ||
    request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|ico)$/)
  ) {
    return NextResponse.next()
  }

  // Check if the organization exists in communities
  const communityExists = Object.keys(communities).some(
    key => key.toLowerCase() === org.toLowerCase()
  )

  // If organization doesn't exist, redirect to 404
  if (!communityExists) {
    return NextResponse.rewrite(new URL('/not-found', request.url))
  }

  return NextResponse.next()
}

// Configure matcher for the routes you want to protect
export const config = {
  matcher: [
    '/:org/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}