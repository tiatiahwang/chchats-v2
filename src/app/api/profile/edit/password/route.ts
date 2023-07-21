import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { PasswordChangeValidator } from '@/lib/validator/profile';
import * as bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response('로그인을 해주세요.', {
        status: 401,
      });
    }

    const body = await req.json();
    const { currentPassword, newPassword } =
      PasswordChangeValidator.parse(body);

    const user = await db.user.findFirst({
      where: { id: session?.user.id },
    });

    if (!user) {
      return new Response(
        '알 수 없는 에러가 발생했습니다.\n잠시 후 다시 시도해 주세요',
        { status: 500 },
      );
    }

    // db에 저장된 비밀번호와 유저가 입력한 현재 비밀번호 일치 여부 확인
    const checkPassword = await bcrypt.compare(
      currentPassword,
      user?.password!,
    );

    if (!checkPassword) {
      return new Response(
        '현재 비밀번호를 다시 확인해주세요.',
        { status: 400 },
      );
    }

    await db.user.update({
      where: {
        id: session?.user.id,
      },
      data: {
        password: await bcrypt.hash(newPassword, 10),
      },
    });

    return new Response('OK');
  } catch (error) {
    return new Response(
      '알 수 없는 에러가 발생했습니다.\n잠시 후 다시 시도해 주세요',
      {
        status: 500,
      },
    );
  }
}
