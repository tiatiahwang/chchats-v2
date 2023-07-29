import { getToken } from 'next-auth/jwt';
import {
  type NextRequest,
  NextResponse,
} from 'next/server';

const secret = process.env.JWT_SECRET;

export async function middleware(req: NextRequest) {
  // 'next-auth.session-token' 쿠키가 존재할 때
  const token = await getToken({
    req,
    secret,
    raw: true,
  });

  const { pathname } = req.nextUrl;

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
