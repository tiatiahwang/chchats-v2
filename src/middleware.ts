import { getToken } from 'next-auth/jwt';
import {
  type NextRequest,
  NextResponse,
} from 'next/server';
import { i18n } from './i18n.config';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';

const secret = process.env.JWT_SECRET;

function getLocale(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach(
    (value, key) => (negotiatorHeaders[key] = value),
  );

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;
  const languages = new Negotiator({
    headers: negotiatorHeaders,
  })
    .languages()
    .reverse();

  const locale = match(
    languages,
    locales,
    i18n.defaultLocale,
  );
  return locale;
}

export async function middleware(req: NextRequest) {
  // 'next-auth.session-token' 쿠키가 존재할 때
  const token = await getToken({
    req,
    secret,
    raw: true,
  });

  const { pathname } = req.nextUrl;

  const pathnameWithoutLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}`) &&
      pathname !== `/${locale}`,
  );

  if (pathnameWithoutLocale) {
    const locale = getLocale(req);
    return NextResponse.redirect(
      new URL(
        `/${locale}${
          pathname.startsWith('/') ? '' : '/'
        }${pathname}`,
        req.url,
      ),
    );
  }

  // token이 없는데, 로그인이 필요한 페이지들로 이동하려고 할때 로그인 페이지로 강제 이동
  if (!token) {
    if (
      pathname.includes('/profile') ||
      pathname.includes('/create')
    ) {
      return NextResponse.redirect(
        new URL('/login', req.url),
      );
    }
  }

  // 로그인한 경우, 로그인 화면과 회원 가입 화면 접근 제한
  if (token) {
    if (
      pathname.includes('/login') ||
      pathname.includes('/join')
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
}

export const config = {
  matcher: [
    '/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)',
  ],
};
