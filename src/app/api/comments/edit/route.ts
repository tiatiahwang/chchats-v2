import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { CommentEditValidator } from '@/lib/validator/comment';
import { z } from 'zod';

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('로그인을 해주세요.', {
        status: 401,
      });
    }
    const body = await req.json();

    const { text, commentId } =
      CommentEditValidator.parse(body);

    await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        text,
      },
    });

    return new Response('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('유효하지 않은 데이터 입니다.', {
        status: 422,
      });
    }
    return new Response(
      '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요',
      {
        status: 500,
      },
    );
  }
}
