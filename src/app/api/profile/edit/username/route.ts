import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { ChangeUsernameValidator } from '@/lib/validator/profile';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response('로그인을 해주세요.', {
        status: 401,
      });
    }

    const body = await req.json();
    const { username } =
      ChangeUsernameValidator.parse(body);

    const user = await db.user.findFirst({
      where: { id: session?.user.id },
    });

    if (!user) {
      return new Response(
        '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요',
        { status: 500 },
      );
    }

    if (username === user.username) {
      return new Response('새로운 닉네임을 입력해주세요.', {
        status: 400,
      });
    }

    await db.user.update({
      where: {
        id: session?.user.id,
      },
      data: {
        username,
      },
    });

    return new Response('OK');
  } catch (error) {
    return new Response(
      '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요',
      {
        status: 500,
      },
    );
  }
}
