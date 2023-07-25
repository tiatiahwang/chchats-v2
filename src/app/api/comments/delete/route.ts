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
    const { commentId, replyToId } = await req.json();

    const comment = await db.comment.findFirst({
      where: { id: commentId },
      include: {
        replies: true,
      },
    });

    if (!comment) {
      return new Response('잘못된 요청입니다.', {
        status: 400,
      });
    }

    // 부모 댓글에 대댓글이 달린 경우, 대댓글 부터 먼저 지워 주기
    if (comment.replies.length > 0) {
      await db.comment.deleteMany({
        where: { replyToId: commentId },
      });
    }

    // 대댓글 하나만 삭제하는 경우는  우선 replyToId 값을 null로 만들어주기
    if (replyToId) {
      await db.comment.updateMany({
        where: {
          id: commentId,
        },
        data: {
          replyToId: null,
        },
      });
    }

    await db.comment.deleteMany({
      where: {
        id: commentId,
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
