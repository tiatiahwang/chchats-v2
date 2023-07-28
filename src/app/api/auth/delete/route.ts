import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { customAlphabet } from 'nanoid';

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();

    const user = await db.user.findFirst({
      where: {
        id: session?.user.id,
      },
    });

    if (!user) {
      return new Response('잘못된 요청입니다.', {
        status: 400,
      });
    }

    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
    const length = 6;
    const nanoid = customAlphabet(alphabet, length);

    const randomName = nanoid();

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: randomName,
        username: randomName,
        image: '',
        password: '',
        isActive: false,
      },
    });

    return new Response('OK');
  } catch (error) {
    return new Response(
      '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.',
      {
        status: 500,
      },
    );
  }
}
