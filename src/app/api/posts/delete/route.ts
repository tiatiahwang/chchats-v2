import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('로그인을 해주세요.', {
        status: 401,
      });
    }
    const { postId } = await req.json();

    if (!postId) {
      return new Response('잘못된 요청입니다.', {
        status: 400,
      });
    }

    await db.comment.updateMany({
      where: {
        postId,
      },
      data: {
        replyToId: null,
      },
    });

    await db.post.deleteMany({
      where: {
        id: postId,
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
