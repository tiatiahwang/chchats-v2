import { getToken } from 'next-auth/jwt';
import {
  type NextRequest,
  NextResponse,
} from 'next/server';

const secret = process.env.JWT_SECRET;

export async function middleware(req: NextRequest) {
  // 'next-auth.session-token' 쿠키가 존재할 때
  const session = await getToken({
    req,
    secret,
    raw: true,
  });
  const { pathname } = req.nextUrl;

  // 로그인 안한 상태에서, 로그인이 필요한 페이지들 이동시 강제 이동
  if (!session) {
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
  if (session) {
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
    // '/login',
    // '/join',
    // '/profile',
    // '/profile/edit',
    // '/:path*/create',
  ],
};
