import { NextResponse, type NextRequest } from 'next/server';
import { detectLanguageFromAcceptLanguage } from '@/lib/i18n';

const PUBLIC_FILE = /\.(.*)$/;
const SKIP_PREFIXES = ['/_next', '/api', '/icon', '/apple-icon', '/opengraph-image', '/manifest', '/robots', '/sitemap', '/sw.js', '/favicon'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (SKIP_PREFIXES.some((p) => pathname.startsWith(p)) || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    const lang = detectLanguageFromAcceptLanguage(req.headers.get('accept-language'));
    const url = req.nextUrl.clone();
    url.pathname = `/${lang}`;
    return NextResponse.redirect(url, 307);
  }

  // Expose pathname to server components so root layout can set <html lang>
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
