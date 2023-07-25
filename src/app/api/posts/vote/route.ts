import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { PostVoteValidator } from '@/lib/validator/post';
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
    const { postId, voteType } =
      PostVoteValidator.parse(body);

    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return new Response('잘못된 요청입니다.', {
        status: 400,
      });
    }

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              userId: session.user.id!,
              postId,
            },
          },
        });
        return new Response('OK');
      }
      await db.vote.update({
        where: {
          userId_postId: {
            userId: session.user.id!,
            postId,
          },
        },
        data: {
          type: voteType,
        },
      });

      return new Response('OK');
    }

    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId,
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
      '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.',
      {
        status: 500,
      },
    );
  }
}
