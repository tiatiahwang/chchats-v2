import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('로그인을 해주세요.', {
        status: 401,
      });
    }

    const url = new URL(req.url);
    const { limit, page } = z
      .object({
        limit: z.string(),
        page: z.string(),
      })
      .parse({
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
      });

    const comments = await db.comment.findMany({
      where: {
        authorId: session.user.id,
      },
      include: {
        post: {
          select: {
            title: true,
            category: {
              select: {
                eng: true,
                name: true,
                ref: true,
              },
            },
            subcategory: {
              select: {
                eng: true,
                name: true,
                ref: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    });

    return new Response(JSON.stringify(comments));
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
