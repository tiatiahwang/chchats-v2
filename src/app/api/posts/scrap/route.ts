import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('로그인을 해주세요.', {
        status: 401,
      });
    }

    const { postId } = await req.json();

    const existingScrap = await db.scrap.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    if (existingScrap) {
      await db.scrap.delete({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId,
          },
        },
      });
      return new Response('DELETED');
    }

    await db.scrap.create({
      data: {
        userId: session.user.id,
        postId,
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
