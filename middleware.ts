import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // STEP 1: Allow static assets (images, icons, etc.)
  if (pathname.match(/\.(png|jpg|jpeg|svg|gif|ico|webp)$/)) {
    return NextResponse.next()
  }

  // Read cookies
  const session = request.cookies.get('pos_session')?.value
  const loginTS = request.cookies.get('pos_login_ts')?.value

  const isLoggedIn = session === 'active'
  const isSplash = pathname === '/'

  // Allow splash page
  if (isSplash) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Block everything else if not logged in
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
